import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
import time

# ---------------------------- #
# 1. SETUP PARAMETERS
# ---------------------------- #
DATA_DIR = r"D:\UserData\Desktop\Multi Crop\detection_code2\efficientnet_data"
EPOCHS = 10
BATCH_SIZE = 32
LEARNING_RATE = 0.001
NUM_CLASSES = 15

# Determine hardware accelerator
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"🚀 Using Device: {device}")

# ---------------------------- #
# 2. DATA AUGMENTATION (ImageNet Standards)
# ---------------------------- #
# EfficientNet-B0 native resolution is 224x224
train_transforms = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

valid_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

print("Scanning custom dataset...")
train_dataset = datasets.ImageFolder(os.path.join(DATA_DIR, "train"), transform=train_transforms)
valid_dataset = datasets.ImageFolder(os.path.join(DATA_DIR, "valid"), transform=valid_transforms)

# Display Class Names order
CLASS_NAMES = train_dataset.classes
print(f"Classes Found ({len(CLASS_NAMES)}): {CLASS_NAMES}")

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4)
valid_loader = DataLoader(valid_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4)

# ---------------------------- #
# 3. BUILD EFFICIENTNET B0
# ---------------------------- #
print("\nDownloading Pre-trained EfficientNet-B0 weights...")
model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)

# Swap out the final classification head to output 15 crops instead of 1000 internet objects
in_features = model.classifier[1].in_features
model.classifier[1] = nn.Linear(in_features, NUM_CLASSES)
model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=LEARNING_RATE, weight_decay=1e-4)
scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=EPOCHS)

# ---------------------------- #
# 4. TRAINING LOOP
# ---------------------------- #
best_acc = 0.0

if __name__ == '__main__':
    print(f"\n⚡ Starting Brain Surgery. Training on {len(train_dataset)} images for {EPOCHS} Epochs...")
    
    for epoch in range(EPOCHS):
        start_time = time.time()
        
        # --- TRAIN ---
        model.train()
        running_loss = 0.0
        running_corrects = 0
        
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            
            _, preds = torch.max(outputs, 1)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(preds == labels.data)
            
        scheduler.step()
        
        epoch_loss = running_loss / len(train_dataset)
        epoch_acc = running_corrects.double() / len(train_dataset)
        
        # --- VALIDATION ---
        model.eval()
        val_loss = 0.0
        val_corrects = 0
        
        with torch.no_grad():
            for inputs, labels in valid_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                _, preds = torch.max(outputs, 1)
                
                val_loss += loss.item() * inputs.size(0)
                val_corrects += torch.sum(preds == labels.data)
                
        val_epoch_loss = val_loss / len(valid_dataset)
        val_epoch_acc = val_corrects.double() / len(valid_dataset)
        
        time_elapsed = time.time() - start_time
        print(f"Epoch {epoch+1}/{EPOCHS} | Time: {time_elapsed:.0f}s | Train Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f} | Val Loss: {val_epoch_loss:.4f} Acc: {val_epoch_acc:.4f}")
        
        # Save Best Model
        if val_epoch_acc > best_acc:
            best_acc = val_epoch_acc
            torch.save(model.state_dict(), "efficientnet_best.pth")
            
    print(f"\n✅ SUCCESS! Best Validation Accuracy: {best_acc:.4f}")
    print("Exported final brain to -> efficientnet_best.pth")
