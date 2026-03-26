import { motion } from 'framer-motion';
import { Target, Activity, Sprout } from 'lucide-react';

const stats = [
    { label: 'Detections Run', value: '45,210+', icon: Activity, color: 'text-primary' },
    { label: 'Model Accuracy (mAP)', value: '81.5%', icon: Target, color: 'text-neonGreen' },
    { label: 'Supported Crops', value: '16 Classes', icon: Sprout, color: 'text-neonCyan' },
];

export const StatsPanel = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6 mb-24">
            {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className="glass-panel p-6 flex items-center gap-4"
                    >
                        <div className={`p-4 rounded-xl bg-surface ${stat.color} bg-opacity-20`}>
                            <Icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-3xl font-bold mt-1 text-white">{stat.value}</h3>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
