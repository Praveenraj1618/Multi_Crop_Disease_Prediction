import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, CircleCheck, TriangleAlert, AlertCircle, Loader2 } from 'lucide-react';
import { mockPredict, type PredictionResponse } from '../api';
import { Recommendations } from './Recommendations';

export const DetectionPanel = () => {
    const [image, setImage] = useState<string | null>(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [result, setResult] = useState<PredictionResponse | null>(null);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageSelection(file);
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageSelection(file);
        }
    };

    const handleImageSelection = async (file: File) => {
        const url = URL.createObjectURL(file);
        setImage(url);
        setIsPredicting(true);
        setResult(null);

        try {
            const data = await mockPredict(file);
            setResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsPredicting(false);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'High': return 'text-red-500 bg-red-500/10 border-red-500/30';
            case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
            case 'Low': return 'text-neonGreen bg-neonGreen/10 border-neonGreen/30';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
        }
    };

    return (
        <section id="analysis-section" className="max-w-7xl mx-auto px-6 py-24">
            <div className="mb-12 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Diagnostic <span className="text-primary">Engine</span></h2>
                <p className="text-gray-400 max-w-2xl mx-auto">Upload a high-resolution image of the affected plant leaf for immediate AI analysis.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT CARD: Dropzone */}
                <div className="glass-panel p-8 h-[500px] flex flex-col relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-white">Input Source</h3>
                        {image && (
                            <button onClick={() => { setImage(null); setResult(null); }} className="text-sm text-gray-400 hover:text-white transition">
                                Clear Selection
                            </button>
                        )}
                    </div>

                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${image ? 'border-primary/50 bg-primary/5' : 'border-gray-600 hover:border-gray-400 hover:bg-surface'
                            }`}
                    >
                        {image ? (
                            <motion.img
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={image}
                                className="w-full h-full object-contain rounded-lg p-2"
                                alt="Uploaded leaf"
                            />
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-400 hover:text-white group">
                                <CloudUpload className="w-16 h-16 mb-4 text-gray-500 group-hover:text-primary transition-colors" />
                                <p className="text-lg font-medium mb-1">Drag & drop image here</p>
                                <p className="text-sm text-gray-500">or click to browse files</p>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        )}
                    </div>
                </div>

                {/* RIGHT CARD: AI Output */}
                <div className="glass-panel-accent p-8 h-[500px] flex flex-col relative">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        Analysis Results
                        {isPredicting && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                    </h3>

                    <div className="flex-1 flex flex-col justify-center items-center">
                        <AnimatePresence mode="wait">
                            {!image ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="text-center text-gray-500"
                                >
                                    Waiting for image input...
                                </motion.div>
                            ) : isPredicting ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <div className="w-24 h-24 rounded-full border-4 border-surface border-t-primary animate-spin" />
                                    <p className="text-primary font-medium animate-pulse">Running Neural Networks...</p>
                                </motion.div>
                            ) : result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    className="w-full h-full flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-start justify-between mb-8">
                                            <div>
                                                <p className="text-sm text-gray-400 font-medium mb-1">Detected Strain</p>
                                                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                                    {result.disease.replace(/_/g, ' ')}
                                                </h2>
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 text-sm font-bold ${getSeverityColor(result.severity)}`}>
                                                {result.severity === 'High' ? <TriangleAlert className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                                {result.severity} Severity
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-8">
                                            <div className="flex justify-between text-sm font-medium">
                                                <span className="text-gray-400">Model Confidence</span>
                                                <span className="text-primary">{(result.confidence * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-primary to-neonCyan"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${result.confidence * 100}%` }}
                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="p-5 rounded-xl bg-surface border border-white/5">
                                            <div className="flex items-center gap-2 text-primary font-medium mb-2">
                                                <CircleCheck className="w-5 h-5" />
                                                Recommended Action
                                            </div>
                                            <p className="text-gray-300 leading-relaxed text-sm">
                                                {result.recommendation}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Expanded Recommendations component renders naturally below if result exists */}
            {result && <Recommendations disease={result.disease} severity={result.severity} />}
        </section>
    );
};
