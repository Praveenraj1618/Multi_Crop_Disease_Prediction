import { useNavigate } from "react-router";
import { Scan, Play, TrendingUp, Shield, Zap, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { motion } from "motion/react";

export function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Instant Detection",
      description: "AI analysis in under 3 seconds"
    },
    {
      icon: Shield,
      title: "95%+ Accuracy",
      description: "Trained on 500K+ crop images"
    },
    {
      icon: TrendingUp,
      title: "15+ Crops",
      description: "Comprehensive disease database"
    }
  ];

  const stats = [
    { value: "2.5M+", label: "Scans Completed" },
    { value: "98%", label: "Farmer Satisfaction" },
    { value: "45+", label: "Countries" }
  ];

  // Floating particles animation
  const particles = Array.from({ length: 20 });

  return (
    <div className="relative overflow-hidden">
      {/* Floating Leaf Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 text-white/10"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20,
              rotate: 0,
            }}
            animate={{
              y: window.innerHeight + 20,
              rotate: 360,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            🍃
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <div className="inline-block mb-4">
            <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              🚀 Powered by Advanced Computer Vision
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Instant AI Crop Diagnosis
            <br />
            <span className="text-green-300">in Seconds</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
            Detect diseases across 15+ crops with real-time precision
            <br />
            and actionable treatment guidance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate('/upload')}
              className="bg-white text-[#2E7D32] hover:bg-white/90 text-lg px-8 py-6 h-auto shadow-2xl group"
            >
              <Scan className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Start Scan
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-2 border-white text-white hover:bg-white/20 text-lg px-8 py-6 h-auto backdrop-blur-sm"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-16"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Upload Image", desc: "Take or upload a photo of the affected crop" },
              { step: "2", title: "AI Analysis", desc: "Our AI detects diseases in real-time" },
              { step: "3", title: "Get Treatment", desc: "Receive instant treatment recommendations" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-white/80 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <Card className="bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-lg border-white/20 p-8 md:p-12">
            <CardContent className="p-0">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Protect Your Crops?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Join thousands of farmers using AI-powered diagnostics
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/upload')}
                className="bg-white text-[#2E7D32] hover:bg-white/90 text-lg px-10 py-6 h-auto shadow-2xl"
              >
                <Scan className="w-5 h-5 mr-2" />
                Start Your Free Scan
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
