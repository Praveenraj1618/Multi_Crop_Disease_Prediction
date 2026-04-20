# AgroVision AI Pro: Master Project Log & Metrics

## 1. Project Initialization & Core Problem Space
**Timeline:** *Day 1*
**Initial State:** The project started as a standard YOLOv8 Object Detection application running purely on bounding boxes. The frontend could only display one single prediction box at a time, hiding critical secondary diseases.
**The Problem:** While YOLOv8 is great at drawing spatial boxes, its classification grid struggled (dropping to ~65% precision) when distinguishing heavily similar textures like "Tomato Early Blight" vs "Tomato Late Blight".

## 2. Milestone 1: Multi-Disease Mapping & Camera Access
**Timeline:** *Session 1: Frontend & Backend Harmonization*
We rewrote the fundamental structure of the React Vite App and the FastAPI router securely to handle dense arrays of predictions simultaneously.
*   **Camera Integration:** Hand-wrote HTML5 `mediaDevices` hooks in `Upload.tsx` to summon the user's hardware webcam locally, stream it into a 2D canvas, and dispatch high-resolution snapshot blobs directly to the AI.
*   **Multi-Box Loop:** Refactored Python's `predict_image()` to parse `[x1, y1, x2, y2]` tensors, mapping up to 5 bounding boxes flawlessly dynamically into the UI `Results.tsx` state with custom opacity tags.

## 3. Milestone 2: Dataset Reverse-Engineering
**Timeline:** *Session 2: Preparing the Neural Network*
To solve YOLO's classification weakness, we decided to separate "Localization" from "Classification" entirely. 
*   **Dataset Size (Initial):** ~17,600 master YOLO photographs.
*   **The Script (`generate_crops.py`):** We mapped YOLO's `data.yaml` math across 17,600 files. We algorithmically cropped only the diseased spots out and threw away the pure backgrounds. 
*   **Resulting Micro-Dataset:** Successfully extracted and synthesized **45,228 localized micro-crop textures** mapped rigidly to 15 unique classes.
    *   **Training Split:** 40,959 images (~90.5%)
    *   **Validation Split:** 2,357 images (~5.2%)
    *   **Testing Split:** 1,912 images (~4.2%)

## 4. Milestone 3: The Brain Transplant (EfficientNet-B0)
**Timeline:** *Session 3: Transfer Learning via PyTorch*
Using the new micro-dataset, we ignored YOLO entirely and built a secondary specialized medical image classification network from scratch on the Windows CUDA GPU.
*   **Algorithm:** `models.efficientnet_b0` (Trained originally on 1.2M ImageNet files).
*   **Architecture Modification:** Stripped its standard 1000-class output head and fused it with a sequential 15-class linear medical layer.
*   **Training Loop (`train_efficientnet.py`):** Processed 40,000+ training images across 10 epochs. 

## 5. Milestone 4: The Intelligent Router Pipeline
**Timeline:** *Session 4: API Hybrid Merge*
Modified `api.py` to securely boot both YOLO (`best.pt`) and EfficientNet (`efficientnet_best.pth`) onto the GPU memory.
1. Target image is analyzed by YOLO natively using OpenCV `BGR` color logic purely to pinpoint coordinates (ignoring guesses).
2. The coordinates are sliced from RAM, converted to `RGB`, and handed exclusively to EfficientNet.
3. EfficientNet processes the clean spot and declares the irrefutable truth.
4. Enacted a "Genome Lock" to prevent conflicting crop families in the same image. 

---

## 6. Official Analytical Metrics

### Dataset Specifics & Data Splitting
The data architecture scales out to exactly **45,228 instances** broken down into a rigorous `~90/5/5` ratio to ensure iron-clad testing:
*   **Train Engine (90.5%):** 40,959 textures
*   **Validation Gateway (5.2%):** 2,357 textures
*   **Unseen Testing Vault (4.2%):** 1,912 textures

The model was distributed across 15 distinct classes spanning 4 specific plant species:
1. `Banana_Healthy` | `Banana_Sigatoka`
2. `Chilli_Healthy` | `Chilli_Bacterial_Spot` | `Chilli_Leaf_Curl`
3. `Potato_Healthy` | `Potato_Early_Blight` | `Potato_Late_Blight`
4. `Rice_Healthy` | `Rice_Bacterial_Blight` | `Rice_Blast` | `Rice_Brownspot`
5. `Tomato_Healthy` | `Tomato_Early_Blight` | `Tomato_Late_Blight`

### Stage 1: YOLOv8 Metrics (Spatial Finder)
**Script Evaluation:** Native Ultralytics validation logic. 
**Objective:** How well does the box capture the disease?
*   **Overall mAP50:** `0.850` (85.0%)
*   *Weak Points Triggering Hybrid Necessity:* Banana Sigatoka (`0.48`), Tomato Blights (`~0.65`).

### Stage 2: EfficientNet Metrics (The Medical Classifier)
**Script Evaluation:** `scikit-learn` Confusion Matrix & Detailed Arrays via `analyze_model.py`.
**Objective:** When given a perfect spatial crop, what is the precision of the diagnosis diagnosis?
*   **Global Accuracy:** `0.9922` (99.22%)
*   **Global F1-Score:** `0.9922`
*   **Perfect Highlights:** `Banana_Healthy` (100%), `Chilli_Leaf_Curl` (100%), `Tomato_Early_Blight` (100%).
*   *Weakest Highlights:* `Potato_Early_Blight` (96.9%—still phenomenally high).
