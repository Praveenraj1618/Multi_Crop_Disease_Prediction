import os
import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

# Check if analysis libraries exist
try:
    from sklearn.metrics import classification_report, confusion_matrix
    import matplotlib.pyplot as plt
    import seaborn as sns
except ImportError:
    print("CRITICAL: Essential Data Science libraries are strictly required!")
    print("Please run this command first -> pip install scikit-learn matplotlib seaborn")
    exit()

# ---------------------------- #
# 1. SETUP PARAMETERS
# ---------------------------- #
DATA_DIR = r"D:\UserData\Desktop\Multi Crop\detection_code2\efficientnet_data\test"
MODEL_PATH = r"D:\UserData\Desktop\Multi Crop\detection_code2\efficientnet_best.pth"
NUM_CLASSES = 15
BATCH_SIZE = 32

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"🚀 Initializing Medical AI Analysis on Device: {device}")

# Math identical to training conditions
valid_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

print("Scanning unseen testing dataset...")
test_dataset = datasets.ImageFolder(DATA_DIR, transform=valid_transforms)
class_names = test_dataset.classes
test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4)

# ---------------------------- #
# 2. BOOT MODEL
# ---------------------------- #
print("\nLoading EfficientNet Brain...")
model = models.efficientnet_b0(weights=None)
model.classifier[1] = nn.Linear(model.classifier[1].in_features, NUM_CLASSES)
# Load exact weights trained previously
model.load_state_dict(torch.load(MODEL_PATH, map_location=device, weights_only=True))
model = model.to(device)
model.eval() # STRICTLY block weight gradients to enforce unadulterated testing

all_preds = []
all_labels = []

if __name__ == "__main__":
    print(f"\n⚡ Running raw inference on {len(test_dataset)} unseen test samples...")
    
    # Disable tensor tracking algorithm for massive speed boost
    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs = inputs.to(device)
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.numpy())

    # ---------------------------- #
    # 3. GENERATE METRICS
    # ---------------------------- #
    print("\n" + "="*80)
    print("📊 CLASSIFICATION REPORT (Precision, Recall, F1-Score)")
    print("="*80)
    
    # Calculate rigorous science metrics down to 4 decimals
    report = classification_report(all_labels, all_preds, target_names=class_names, digits=4)
    print(report)

    print("\nRendering Graphical Matrix Array...")
    cm = confusion_matrix(all_labels, all_preds)
    
    plt.figure(figsize=(14, 12))
    # Draw heat graph highlighting AI struggles natively mapped to classes
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=class_names, yticklabels=class_names,
                linewidths=1, linecolor='black')
                
    plt.title('Agrovision EfficientNet Confusion Matrix', fontsize=18, fontweight='bold', pad=20)
    plt.ylabel('Ground Truth (Actual Disease)', fontsize=14, fontweight='bold')
    plt.xlabel('AI Diagnosis (Predicted Disease)', fontsize=14, fontweight='bold')
    plt.xticks(rotation=45, ha='right', fontsize=10)
    plt.yticks(rotation=0, fontsize=10)
    plt.tight_layout()
    
    save_path = "confusion_matrix.png"
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"\n🖼️ Heatmap Graph successfully saved locally as: {save_path}")
