# AgroVision — Multi-Crop Disease Prediction

**Two-stage computer vision · YOLO localization · EfficientNet classification**

A crop-image analysis project combining leaf-region detection with a specialist classifier, exposed through a FastAPI endpoint and a React interface.

[Getting started](#getting-started) · [Model pipeline](#model-pipeline) · [Repository guide](#repository-guide)

## Model pipeline

1. The frontend sends an image to `POST /predict`.
2. YOLO locates candidate regions.
3. Each qualifying region is cropped and resized to 224 × 224 pixels.
4. EfficientNet-B0 classifies the crop into one of 15 labels.
5. The API returns confidence scores and normalized bounding boxes, retaining up to five detections for the primary crop type.

The implementation uses YOLO with `conf=0.25`, rejects crops smaller than 10 pixels in either dimension, and retains classifier outputs at or above 0.40 confidence.

## Supported labels

| Crop | Classes |
| --- | --- |
| Banana | Healthy, Sigatoka |
| Chilli | Healthy, Bacterial Spot, Leaf Curl |
| Potato | Healthy, Early Blight, Late Blight |
| Rice | Healthy, Bacterial Blight, Blast, Brownspot |
| Tomato | Healthy, Early Blight, Late Blight |

## Repository guide

| Path | Purpose |
| --- | --- |
| `Agrovision_Pro/` | React interface wired to the local prediction API |
| `agrovision-app/` | Earlier frontend; its API helper returns a mock prediction |
| `detection_code2/api.py` | Two-stage inference API |
| `detection_code2/generate_crops.py` | Classification crop preparation |
| `detection_code2/train_efficientnet.py` | EfficientNet training |
| `detection_code2/train_ver2.py` | Detector training |
| `detection_code/` | Earlier detection experiments and dataset |
| `project_master_log.md` | Development history and reported experiments |

Start with **Agrovision_Pro** to explore the interface connected to the two-stage API.

## Getting started

This repository contains datasets and multiple model checkpoints, so cloning can be large.

```bash
git clone --depth 1 https://github.com/Praveenraj1618/Multi_Crop_Disease_Prediction.git
cd Multi_Crop_Disease_Prediction
python -m venv .venv
```

Activate with `.venv\Scripts\Activate.ps1` in Windows PowerShell or `source .venv/bin/activate` on macOS/Linux.

### Backend prerequisites

```bash
python -m pip install fastapi uvicorn python-multipart ultralytics torch torchvision opencv-python numpy pillow
```

Before starting, edit the model paths in `detection_code2/api.py`:

| Variable | Required artifact |
| --- | --- |
| `MODEL_PATH` | A compatible trained YOLO checkpoint; the repository contains `detection_code2/runs/train/multi_crop_v2/weights/best.pt` |
| `EFFICIENTNET_PATH` | The trained 15-class `efficientnet_best.pth` classifier |

Both variables currently contain machine-specific absolute Windows paths. The EfficientNet checkpoint is **not present in the repository tree** and must be supplied or produced using the training workflow. The API loads both models at startup.

After the artifacts and paths are ready:

```bash
python detection_code2/api.py
```

API docs: http://localhost:8000/docs

### Frontend

In another terminal, from the repository root:

```bash
cd Agrovision_Pro
npm install
npm run dev
```

Open the address printed by Vite. The processing screen calls `http://localhost:8000/predict`; update that URL in `src/app/screens/Processing.tsx` if your backend runs elsewhere.

## Interface capabilities

The connected frontend includes upload, processing, results, and history screens. Prediction results support multiple bounding boxes. Scan history is saved in the browser's local storage.

The UI's processing-step animation is a presentation aid, not backend progress reporting. Its severity label is derived from bounding-box area rather than a separately validated severity model.

## Evaluation

Training artifacts, plots, and experiment notes are committed under the detection folders and in [the project log](project_master_log.md). Reported classifier results should be distinguished from the accuracy of the complete detector-plus-classifier pipeline; this documentation refresh does not reproduce training or independently verify those metrics.

## Technology

Python, PyTorch, torchvision, Ultralytics YOLO, EfficientNet-B0, FastAPI, OpenCV, React, TypeScript, Vite, and Tailwind CSS.

Frontend asset acknowledgments are preserved in [ATTRIBUTIONS.md](Agrovision_Pro/ATTRIBUTIONS.md).
