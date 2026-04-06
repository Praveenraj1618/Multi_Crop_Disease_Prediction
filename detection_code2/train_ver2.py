import os
from ultralytics import YOLO
import torch

def main():
    # ----------------------------
    # 1. DEVICE CHECK
    # ----------------------------
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")

    # ----------------------------
    # 2. LOAD UPGRADED MODEL
    # ----------------------------
    # Upgraded from yolov8s → yolov8m
    model = YOLO("yolov8m.pt")

    # Resolve absolute path for data.yaml to avoid FileNotFoundError
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_yaml_path = os.path.join(current_dir, "multi-crop-disease-detection1.v2i.yolov8", "data.yaml")

    print(f"Dataset path: {data_yaml_path}")

    # ----------------------------
    # 3. TRAIN MODEL
    # ----------------------------
    model.train(
        data=data_yaml_path,    # explicitly use absolute path to be robust
        epochs=80,              # increased from 50
        imgsz=640,
        batch=12,               # reduce slightly for YOLOv8m
        device=device,
        amp=True,               # <--- ADDED: Enables Automatic Mixed Precision for faster/memory-efficient training

        # ------------------------
        # OPTIMIZATION
        # ------------------------
        optimizer="auto",       # <--- CHANGED: "auto" lets YOLO dynamically pick the best optimizer (usually AdamW or SGD) based on dataset config
        lr0=0.01,
        momentum=0.937,
        weight_decay=0.0005,
        cos_lr=True,            # <--- ADDED: Cosine learning rate schedule often converged better and smoother than linear

        # ------------------------
        # AUGMENTATION (tuned)
        # ------------------------
        hsv_h=0.015,
        hsv_s=0.7,
        hsv_v=0.4,

        degrees=12,
        translate=0.1,
        scale=0.6,
        shear=0.0,

        fliplr=0.5,
        flipud=0.0,

        # ------------------------
        # REGULARIZATION
        # ------------------------
        patience=25,            # early stopping
        dropout=0.0,

        # ------------------------
        # TRAINING CONTROL
        # ------------------------
        cache=True,             # faster training
        workers=4,              # Note: requires the standard `if __name__ == "__main__":` block on Windows

        # ------------------------
        # LOGGING
        # ------------------------
        project="runs/train",
        name="multi_crop_v2",
        exist_ok=True,          # <--- ADDED: Prevents crashing if the "multi_crop_v2" directory already exists

        # ------------------------
        # SAVE SETTINGS
        # ------------------------
        save=True,
        save_period=10
    )

    # ----------------------------
    # 4. VALIDATION
    # ----------------------------
    metrics = model.val()
    print("Validation Metrics:")
    print(metrics)

    # ----------------------------
    # 5. EXPORT MODEL
    # ----------------------------
    model.export(format="onnx")

if __name__ == "__main__":
    # Windows requires the multiprocessing entry point to be protected.
    # Without this, setting workers=4 causes a RuntimeError on Windows.
    main()
