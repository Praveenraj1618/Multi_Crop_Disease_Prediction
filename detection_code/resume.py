from ultralytics import YOLO

# Load the last checkpoint from your crash instead of starting fresh
model = YOLO(r"runs\train\multi_crop_model2\weights\last.pt")

# Resume training with 0 workers to prevent another crash
model.train(resume=True, workers=0)
