import io
import cv2
import numpy as np
from PIL import Image
import torch
import torch.nn as nn
from torchvision import models, transforms
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

app = FastAPI(title="Agrovision Pro AI API")

# Setup CORS for the Vite React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained YOLO model (Stage 1: Vision Cropper)
MODEL_PATH = r"D:\UserData\Desktop\Multi Crop\detection_code2\runs\train\multi_crop_v2\weights\best.pt"
model = YOLO(MODEL_PATH)

# Setup EfficientNet (Stage 2: Specialist Classifier)
EFFICIENTNET_PATH = r"D:\UserData\Desktop\Multi Crop\detection_code2\efficientnet_best.pth"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
num_classes = 15
class_names = [
    'Banana_Healthy', 'Banana_Sigatoka', 'Chilli_Bacterial_Spot', 'Chilli_Healthy', 
    'Chilli_Leaf_Curl', 'Potato_Early_Blight', 'Potato_Healthy', 'Potato_Late_Blight', 
    'Rice_Bacterial_Blight', 'Rice_Blast', 'Rice_Brownspot', 'Rice_Healthy', 
    'Tomato_Early_Blight', 'Tomato_Healthy', 'Tomato_Late_Blight'
]

# Boot identical EfficientNet architecture
efficient_model = models.efficientnet_b0(weights=None)
efficient_model.classifier[1] = nn.Linear(efficient_model.classifier[1].in_features, num_classes)
efficient_model.load_state_dict(torch.load(EFFICIENTNET_PATH, map_location=device, weights_only=True))
efficient_model = efficient_model.to(device)
efficient_model.eval()

# Tensor pipeline 
eff_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def classify_crop(img_crop):
    """Predicts disease on an isolated leaf spot directly through EfficientNet"""
    pil_img = Image.fromarray(img_crop)
    input_tensor = eff_transform(pil_img).unsqueeze(0).to(device)
    
    with torch.no_grad():
        outputs = efficient_model(input_tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
        confidence, predicted_idx = torch.max(probabilities, 0)
        
    return class_names[predicted_idx.item()], float(confidence.item())

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    # Read image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Convert BGR to RGB for EfficientNet cropping
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Get image dimensions for normalized coordinates later if needed
    h, w, _ = img.shape

    # Run inference (YOLO natively expects the BGR array from OpenCV)
    results = model.predict(img, conf=0.25)
    
    # Process results with new two-stage Hybrid Logic
    if len(results) > 0 and len(results[0].boxes) > 0:
        boxes = results[0].boxes
        
        detected_boxes = []
        for i in range(len(boxes)):
            # Ignore YOLO's internal class predictions completely!
            yolo_conf = float(boxes.conf[i].item())
            
            # Let YOLO locate regions with a relaxed >20% spatial threshold
            if yolo_conf >= 0.20:
                xyxy = boxes.xyxy[i].cpu().numpy().tolist()
                xyxyn = boxes.xyxyn[i].cpu().numpy().tolist()
                
                # Calculate physical dimensions for NumPy array slicing
                x1, y1, x2, y2 = map(int, xyxy)
                x1, y1 = max(0, x1), max(0, y1)
                x2, y2 = min(w, x2), min(h, y2)
                
                # Prevent crashing on invalid 1-pixel anomalous boxes
                if x2 - x1 < 10 or y2 - y1 < 10:
                    continue
                
                # Physically inject the cropped texture array into the EfficientNet algorithm!
                crop_pixels = img_rgb[y1:y2, x1:x2]
                eff_disease, eff_conf = classify_crop(crop_pixels)
                
                # Re-apply the strict >40% threshold purely on EfficientNet's hyper-accurate score
                if eff_conf >= 0.40:
                    width_ratio = xyxyn[2] - xyxyn[0]
                    height_ratio = xyxyn[3] - xyxyn[1]
                    area_ratio = width_ratio * height_ratio
                    
                    detected_boxes.append({
                        "disease": eff_disease, # Overwritten by EfficientNet!
                        "confidence": round(eff_conf * 100, 2), # Overwritten by EfficientNet!
                        "area_ratio": area_ratio, # Spatial math preserved from YOLO
                        "box": {
                            "x1": xyxyn[0],
                            "y1": xyxyn[1],
                            "x2": xyxyn[2],
                            "y2": xyxyn[3]
                        }
                    })
                
        # Sort using EfficientNet's diagnostic confidence pipeline
        detected_boxes.sort(key=lambda x: x["confidence"], reverse=True)
        
        if len(detected_boxes) > 0:
            primary_detection = detected_boxes[0]
            # Assumes format "PlantName_Condition"
            primary_plant = primary_detection["disease"].split("_")[0]
            
            # Filter cross-contamination and limit to 5
            filtered_boxes = [box for box in detected_boxes if box["disease"].startswith(primary_plant)][:5]
            
            return {
                "success": True,
                "disease": primary_detection["disease"],
                "confidence": primary_detection["confidence"],
                "area_ratio": primary_detection["area_ratio"],
                "box": primary_detection["box"],  # legacy compatibility
                "boxes": filtered_boxes           # robust multi-box array
            }
    
    return {
        "success": False,
        "message": "No disease or crop pattern detected in image."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
