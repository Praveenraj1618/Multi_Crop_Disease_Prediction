import { Upload, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = () => {
    return (
        <nav className="fixed w-full z-50 glass-panel border-b border-surface px-6 py-4 flex justify-between items-center bg-background/80">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-xl">
                    <Leaf className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xl font-bold tracking-wider text-white">
                    AgroVision <span className="neon-text text-primary">AI</span>
                </span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                <a href="#home" className="hover:text-primary transition-colors">Home</a>
                <a href="#dashboard" className="hover:text-primary transition-colors">Dashboard</a>
                <a href="#analysis" className="hover:text-primary transition-colors">Analysis</a>
                <a href="#about" className="hover:text-primary transition-colors">About</a>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-primary/20 border border-primary text-primary px-5 py-2.5 rounded-lg font-medium hover:bg-primary/30 transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:shadow-[0_0_25px_rgba(0,242,254,0.5)]"
            >
                <Upload className="w-4 h-4" />
                Upload Image
            </motion.button>
        </nav>
    );
};
