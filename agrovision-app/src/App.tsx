import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsPanel } from './components/StatsPanel';
import { DetectionPanel } from './components/DetectionPanel';

function App() {
  return (
    <div className="min-h-screen relative selection:bg-primary/30 selection:text-white">
      {/* Global animated background glow */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-pulse-slow object-cover mix-blend-screen" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[1000px] h-[1000px] bg-neonGreen/5 rounded-full blur-[150px] object-cover mix-blend-screen" />
      </div>

      <Navbar />

      <main>
        <Hero />
        <StatsPanel />
        <DetectionPanel />
      </main>

      <footer className="mt-32 border-t border-surface py-12 text-center text-gray-500 text-sm">
        <p>© 2026 AgroVision AI. Powered by YOLOv8 Deep Learning.</p>
        <p className="mt-2 text-primary/70">Multi-Crop Disease Detection System</p>
      </footer>
    </div>
  );
}

export default App;
