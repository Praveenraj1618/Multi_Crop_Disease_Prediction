from ultralytics import YOLO
import torch

# ----------------------------
# 1. CHECK DEVICE
# ----------------------------
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# ----------------------------
# 2. LOAD MODEL
# ----------------------------
# Options:
# yolov8n.pt (fast, less accurate)
# yolov8s.pt (balanced)  ← use this
# yolov8m.pt (heavier)

if __name__ == '__main__':
    model = YOLO("yolov8s.pt")

    # ----------------------------
    # 3. TRAIN MODEL
    # ----------------------------
    model.train(
        data="multi-crop-disease-detection1.v1i.yolov8/data.yaml",   # path to your dataset yaml
        epochs=50,          # start with 50
        imgsz=640,          # standard size
        batch=16,           # reduce if memory error
        device=device,
        workers=0,          # FIX: Prevents "resource already mapped" multiprocessing error on Windows

        # Optimization
        lr0=0.01,           # initial learning rate
        optimizer="SGD",    # stable choice

        # Augmentation (light)
        hsv_h=0.015,
        hsv_s=0.7,
        hsv_v=0.4,
        degrees=10,
        translate=0.1,
        scale=0.5,
        fliplr=0.5,

        # Regularization
        patience=20,        # early stopping

        # Logging
        project="runs/train",
        name="multi_crop_model",

        # Save
        save=True,
        save_period=10
    )

    # ----------------------------
    # 4. VALIDATION
    # ----------------------------
    metrics = model.val()
    print(metrics)

    # ----------------------------
    # 5. EXPORT MODEL
    # ----------------------------
    model.export(format="onnx")   # for deployment