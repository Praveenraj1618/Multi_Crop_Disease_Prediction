import { Link, useLocation } from "react-router";
import { Leaf, Scan, History, Sprout, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg group-hover:bg-white/30 transition-all">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg leading-tight">
                Agri-Vision AI Pro
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                </div>
                <span className="text-xs text-green-300">Live AI Status</span>
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/upload">
              <Button
                variant="ghost"
                className={`text-white hover:bg-white/20 ${
                  isActive('/upload') ? 'bg-white/20' : ''
                }`}
              >
                <Scan className="w-4 h-4 mr-2" />
                New Scan
              </Button>
            </Link>
            <Link to="/history">
              <Button
                variant="ghost"
                className={`text-white hover:bg-white/20 ${
                  isActive('/history') ? 'bg-white/20' : ''
                }`}
              >
                <History className="w-4 h-4 mr-2" />
                Scan History
              </Button>
            </Link>
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <Sprout className="w-4 h-4 mr-2" />
              Crop Advisory
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <MessageSquare className="w-4 h-4 mr-2" />
              Expert Connect
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Scan className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
