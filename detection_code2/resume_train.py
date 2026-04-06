import os
from ultralytics import YOLO

def main():
    # Pinpoint exactly where the latest checkout weight is saved
    current_dir = os.path.dirname(os.path.abspath(__file__))
    last_weights_path = os.path.join(current_dir, "runs", "train", "multi_crop_v2", "weights", "last.pt")

    # Double check if any training progress has actually been saved
    if not os.path.exists(last_weights_path):
        print("\n[ERROR] No checkpoint found!")
        print(f"I couldn't find: {last_weights_path}")
        print("Make sure you complete at least 1 full epoch before stopping, otherwise there's nothing to resume from.\n")
        return

    print(f"\n[INFO] Found checkpoint at: {last_weights_path}")
    print("[INFO] Resuming training from the last saved epoch...\n")
    
    # Load the partially trained weights
    model = YOLO(last_weights_path)

    data_path = os.path.join(current_dir, "multi-crop-disease-detection1.v2i.yolov8", "data.yaml")
    # Calling train with resume=True perfectly restores the optimizer state, epochs, and learning rates
    model.train(resume=True, data=data_path)

if __name__ == "__main__":
    main()
