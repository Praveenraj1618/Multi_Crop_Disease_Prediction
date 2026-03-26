import { motion } from 'framer-motion';
import { ArrowRight, ScanLine } from 'lucide-react';

export const Hero = () => {
    return (
        <div className="relative pt-32 pb-20 px-6 flex flex-col items-center justify-center min-h-[70vh] text-center overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-neonGreen/10 rounded-full blur-[100px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 text-primary text-sm font-medium mb-8">
                    <ScanLine className="w-4 h-4" />
                    <span>v2.0 Model Now Live</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                    AI-Powered <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-neonCyan">
                        Crop Disease Detection
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                    Analyze plant health instantly using deep learning. Upload a leaf image and let our advanced neural networks diagnose diseases with high precision.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative inline-flex items-center justify-center gap-3 bg-white text-background px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all overflow-hidden"
                    onClick={() => document.getElementById('analysis-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Start Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </motion.button>
            </motion.div>
        </div>
    );
};
