import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Upload as UploadIcon, Camera, Image as ImageIcon, CheckCircle, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { motion, AnimatePresence } from "motion/react";

export function Upload() {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup camera if unmounted
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      // We set srcObject in the UI after render
    } catch (err) {
      console.error(err);
      alert("Unable to access camera or permission denied.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
          processFile(file);
          stopCamera();
        }
      }, 'image/jpeg', 0.9); // high quality
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
      }
    }, 100);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleAnalyze = () => {
    navigate('/processing', { state: { image: previewUrl } });
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setPreviewUrl("");
    setUploadProgress(0);
  };

  return (
    <div className="container mx-auto px-4 py-12 relative">
      {/* Absolute Full Screen Camera Overlay */}
      <AnimatePresence>
        {isCameraActive && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black flex flex-col justify-center items-center"
          >
            <video 
              ref={(ref) => {
                if (ref && streamRef.current) ref.srcObject = streamRef.current;
                videoRef.current = ref;
              }}
              autoPlay 
              playsInline 
              className="max-w-full max-h-[80vh] w-full object-contain mb-8 bg-black"
            />
            
            <div className="flex gap-4 mb-[5vh]">
               <Button onClick={stopCamera} size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
                 Cancel
               </Button>
               <Button onClick={capturePhoto} size="lg" className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white">
                 <Camera className="w-5 h-5 mr-2" />
                 Snap
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Upload Crop Image
          </h1>
          <p className="text-white/80 text-lg">
            Supports field images with complex backgrounds
          </p>
        </div>

        {/* Upload Card */}
        <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <AnimatePresence mode="wait">
              {!uploadedFile ? (
                // Idle State
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-12 transition-all ${
                    isDragging ? 'bg-white/20' : 'bg-transparent'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div
                    className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all ${
                      isDragging
                        ? 'border-white bg-white/10 scale-105'
                        : 'border-white/40 hover:border-white/60 hover:bg-white/5'
                    }`}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="mb-6"
                    >
                      <div className="bg-white/20 backdrop-blur-sm w-24 h-24 rounded-full flex items-center justify-center mx-auto group-hover:bg-white/30 transition-all shadow-lg">
                        <Camera className="w-12 h-12 text-white" />
                      </div>
                    </motion.div>

                    <h3 className="text-2xl font-semibold text-white mb-3">
                      Drag & Drop Your Image Here
                    </h3>
                    <p className="text-white/70 mb-6">
                      or click to browse from your device
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <label htmlFor="file-upload">
                        <Button
                          size="lg"
                          className="bg-white text-[#2E7D32] hover:bg-white/90 shadow-xl cursor-pointer"
                          asChild
                        >
                          <span>
                            <ImageIcon className="w-5 h-5 mr-2" />
                            Choose File
                          </span>
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </label>

                      <Button
                        size="lg"
                        variant="outline"
                        className="bg-white/10 border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm"
                        onClick={startCamera}
                      >
                        <Camera className="w-5 h-5 mr-2" />
                        Take Photo
                      </Button>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-4 text-xs text-white/60">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        JPG, PNG supported
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Max 10MB
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Any resolution
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                // Preview State
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-8"
                >
                  <div className="relative">
                    {/* Close button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleRemove}
                      className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </Button>

                    {/* Image Preview */}
                    <div className="relative rounded-xl overflow-hidden mb-6 bg-black/20">
                      <img
                        src={previewUrl}
                        alt="Uploaded crop"
                        className="w-full h-96 object-contain"
                      />
                      
                      {/* Upload Progress Overlay */}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-white font-medium">Uploading...</p>
                            <p className="text-white/70 text-sm">{uploadProgress}%</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Upload Progress Bar */}
                    {isUploading && (
                      <div className="mb-6">
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}

                    {/* File Info */}
                    {!isUploading && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                          <div>
                            <p className="text-white font-medium">
                              {uploadedFile.name}
                            </p>
                            <p className="text-white/60 text-sm">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemove}
                          className="text-white hover:bg-white/10"
                        >
                          Remove
                        </Button>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {!isUploading && (
                      <div className="flex gap-4">
                        <Button
                          size="lg"
                          onClick={handleAnalyze}
                          className="flex-1 bg-white text-[#2E7D32] hover:bg-white/90 shadow-xl text-lg h-14"
                        >
                          <UploadIcon className="w-5 h-5 mr-2" />
                          Analyze Image
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            { icon: "🎯", title: "High Accuracy", text: "95%+ detection rate" },
            { icon: "⚡", title: "Fast Results", text: "Analysis in 3 seconds" },
            { icon: "🔒", title: "Secure", text: "Your data is protected" }
          ].map((item, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-white/70 text-sm">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
