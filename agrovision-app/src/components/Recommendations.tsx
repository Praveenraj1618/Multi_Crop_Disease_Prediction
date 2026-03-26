import { motion } from 'framer-motion';
import { ShieldCheck, CloudRain, Droplets } from 'lucide-react';

interface RecommendationsProps {
    disease: string;
    severity: string;
}

export const Recommendations = ({ disease, severity }: RecommendationsProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 glass-panel border border-neonGreen/20 p-8"
        >
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white">Targeted Protocol Outline</h3>
                <span className="text-xs text-gray-400 bg-surface px-3 py-1 rounded-full border border-white/10">Analysis: {disease} | {severity} Severity</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                <div className="flex gap-4">
                    <div className="p-3 bg-neonGreen/10 rounded-xl h-fit">
                        <ShieldCheck className="w-6 h-6 text-neonGreen" />
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Treatment Protocol</h4>
                        <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                            <li>Apply registered fungicides immediately</li>
                            <li>Isolate affected plants if potted</li>
                            <li>Prune infected leaves carefully</li>
                        </ul>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl h-fit">
                        <CloudRain className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Environmental Adjustments</h4>
                        <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                            <li>Increase air circulation</li>
                            <li>Reduce humidity levels below 85%</li>
                            <li>Ensure steady ambient temperature</li>
                        </ul>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="p-3 bg-neonCyan/10 rounded-xl h-fit">
                        <Droplets className="w-6 h-6 text-neonCyan" />
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Prevention Measures</h4>
                        <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                            <li>Avoid overhead watering systems</li>
                            <li>Sterilize pruning tools between plants</li>
                            <li>Implement crop rotation next season</li>
                        </ul>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};
