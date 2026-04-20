import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { motion } from "motion/react";
import { getDiseaseByYoloId } from "../data/diseases";

export function Processing() {
  const location = useLocation();
  const navigate = useNavigate();
  const imageUrl = location.state?.image || "";
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Detecting leaf regions", status: "processing" },
    { label: "Identifying disease patterns", status: "pending" },
    { label: "Matching treatment database", status: "pending" },
  ];

  useEffect(() => {
    if (!imageUrl) {
      navigate('/upload');
      return;
    }

    let isMounted = true;

    // Simulate UI processing steps for visual feedback
    const stepTimers = [
      setTimeout(() => isMounted && setCurrentStep(1), 1000),
      setTimeout(() => isMounted && setCurrentStep(2), 2000),
    ];

    const runInference = async () => {
      try {
        // Convert Base64 back to Blob for multipart/form-data upload
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append("file", blob, "upload.jpg");

        // Ping the local Python backend API
        const apiResponse = await fetch("http://localhost:8000/predict", {
          method: "POST",
          body: formData,
        });

        const result = await apiResponse.json();

        if (isMounted) {
          setCurrentStep(3); // Match Treatment DB
          
            if (result.success) {
              const mappedDisease = getDiseaseByYoloId(result.disease, result.confidence);
              let maxSeverity: 'low' | 'medium' | 'high' = 'low';

              // Map all boxes for Results.tsx dynamic overlay
              const mappedBoxes = (result.boxes || [result]).map((b: any) => {
                let sev = 'low';
                if (b.area_ratio !== undefined && mappedDisease.name !== 'Healthy') {
                  if (b.area_ratio > 0.35) sev = 'high';
                  else if (b.area_ratio > 0.10) sev = 'medium';
                }
                if (sev === 'high' || (sev === 'medium' && maxSeverity !== 'high')) {
                  maxSeverity = sev;
                }
                
                return {
                  box: b.box,
                  confidence: b.confidence,
                  mappedDisease: getDiseaseByYoloId(b.disease, b.confidence)
                };
              });

              // Assign Highest calculated severity from any bounding box to the Primary Disease Diagnosis
              mappedDisease.severity = maxSeverity;

              // Save to Local History
              const newScan = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                disease: mappedDisease,
                imageUrl: imageUrl,
                status: mappedDisease.name === 'Healthy' ? 'healthy' : 'detected'
              };

              try {
                const existingScans = JSON.parse(localStorage.getItem('agrovision_scans') || '[]');
                localStorage.setItem('agrovision_scans', JSON.stringify([newScan, ...existingScans]));
              } catch (e) {
                console.error("Could not save to history", e);
              }
              
              setTimeout(() => {
                navigate('/results', { 
                  state: { 
                    disease: mappedDisease,
                    image: imageUrl,
                    boxes: mappedBoxes // Pass array of multiple mapped bounding boxes
                  } 
                });
              }, 1000); // Small delay to let user see "completed"
          } else {
            console.error(result.message);
            // Handle error or healthy fallback
            navigate('/upload');
          }
        }
      } catch (error) {
        console.error("Inference Error:", error);
        if (isMounted) navigate('/upload');
      }
    };

    runInference();

    return () => {
      isMounted = false;
      stepTimers.forEach(timer => clearTimeout(timer));
    };
  }, [imageUrl, navigate]);

  const getStepStatus = (index: number) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "processing";
    return "pending";
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-white/30 border-t-white animate-spin" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Analyzing Crop Health...
            </h1>
            <p className="text-white/80 text-lg">
              Our AI is examining your image for disease indicators
            </p>
          </div>

          {/* Processing Card */}
          <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl mb-8">
            <CardContent className="p-8">
              {/* Image with Scanning Effect */}
              <div className="relative rounded-xl overflow-hidden mb-8 bg-black/20">
                <img
                  src={imageUrl}
                  alt="Processing"
                  className="w-full h-96 object-contain"
                />
                
                {/* Scanning Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <svg width="100%" height="100%" className="opacity-30">
                    <defs>
                      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(46, 125, 50, 0.8)" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  {/* Animated Scanning Line */}
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_20px_rgba(34,197,94,0.8)]"
                    initial={{ top: 0 }}
                    animate={{ top: '100%' }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </div>

                {/* Neural Network Animation */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                    </div>
                    <span className="text-white text-sm font-medium">AI Active</span>
                  </div>
                </div>
              </div>

              {/* Processing Steps */}
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const status = getStepStatus(index);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                        status === "completed"
                          ? "bg-green-500/20 border border-green-500/40"
                          : status === "processing"
                          ? "bg-white/20 border border-white/40"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {status === "completed" ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : status === "processing" ? (
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-white/30" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          status === "completed"
                            ? "text-green-300"
                            : status === "processing"
                            ? "text-white"
                            : "text-white/50"
                        }`}>
                          {step.label}
                        </p>
                      </div>
                      {status === "processing" && (
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-white rounded-full"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Info Text */}
          <div className="text-center">
            <p className="text-white/70 text-sm">
              This usually takes 3-5 seconds. Our AI is analyzing over 500 disease patterns.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
