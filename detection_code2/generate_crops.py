import os
import cv2
import uuid

# Defined 15 Custom Classes configured from base YAML
class_names = [
    'Banana_Healthy', 'Banana_Sigatoka', 'Chilli_Bacterial_Spot', 'Chilli_Healthy', 
    'Chilli_Leaf_Curl', 'Potato_Early_Blight', 'Potato_Healthy', 'Potato_Late_Blight', 
    'Rice_Bacterial_Blight', 'Rice_Blast', 'Rice_Brownspot', 'Rice_Healthy', 
    'Tomato_Early_Blight', 'Tomato_Healthy', 'Tomato_Late_Blight'
]

# Configure Data Routing Paths
BASE_IN = r"D:\UserData\Desktop\Multi Crop\detection_code2\multi-crop-disease-detection1.v2i.yolov8"
BASE_OUT = r"D:\UserData\Desktop\Multi Crop\detection_code2\efficientnet_data"

def process_split(split_name):
    print(f"Processing '{split_name}' pipeline...")
    img_dir = os.path.join(BASE_IN, split_name, "images")
    lbl_dir = os.path.join(BASE_IN, split_name, "labels")
    
    if not os.path.exists(img_dir): 
        print(f" -> Directory missing: {img_dir}. Skipping.")
        return
    
    # Establish Pure Class Folders
    for c in class_names:
        os.makedirs(os.path.join(BASE_OUT, split_name, c), exist_ok=True)
        
    files_processed = 0
    crops_saved = 0

    for img_name in os.listdir(img_dir):
        if not img_name.lower().endswith(('.jpg', '.png', '.jpeg')): 
            continue
        
        lbl_name = img_name.rsplit('.', 1)[0] + ".txt"
        lbl_path = os.path.join(lbl_dir, lbl_name)
        img_path = os.path.join(img_dir, img_name)
        
        if not os.path.exists(lbl_path): 
            continue
        
        img = cv2.imread(img_path)
        if img is None: 
            continue
            
        h, w, _ = img.shape
        files_processed += 1
        
        with open(lbl_path, "r") as f:
            lines = f.readlines()
            
        for line in lines:
            parts = line.strip().split()
            if len(parts) >= 5:
                c_id = int(parts[0])
                cx = float(parts[1])
                cy = float(parts[2])
                bw = float(parts[3])
                bh = float(parts[4])
                
                # Denormalize absolute pixels from YOLO specs
                px = int(cx * w)
                py = int(cy * h)
                box_w = int(bw * w)
                box_h = int(bh * h)
                
                # Math limits to ensure box is within bounds
                x1 = max(0, int(px - box_w/2))
                y1 = max(0, int(py - box_h/2))
                x2 = min(w, int(px + box_w/2))
                y2 = min(h, int(py + box_h/2))
                
                # Filter out mathematically anomalous sub-crops
                if x2 - x1 < 10 or y2 - y1 < 10: 
                    continue
                
                # Frame Slicing Tensor
                crop = img[y1:y2, x1:x2]
                
                save_dir = os.path.join(BASE_OUT, split_name, class_names[c_id])
                # Generate guaranteed unique hash names for large scale arrays
                unique_name = f"{uuid.uuid4().hex[:10]}.jpg"
                save_path = os.path.join(save_dir, unique_name)
                
                cv2.imwrite(save_path, crop)
                crops_saved += 1
                
    print(f" -> Completed '{split_name}'. Processed {files_processed} master images. Extracted {crops_saved} cropped textures.\n")

if __name__ == "__main__":
    print("==============================================")
    print("🧠 EFFICIENT-NET DATASET GENERATOR INITIATING")
    print("==============================================")
    
    process_split("train")
    process_split("valid")
    process_split("test")
    
    print(f"✅ EXPORT FINISHED: The customized EfficientNet dataset is saved in -> {BASE_OUT}")
