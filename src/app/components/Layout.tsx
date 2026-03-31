import { Outlet } from "react-router";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E7D32] via-[#558B2F] to-[#827717]">
      <Navbar />
      <Outlet />
      <footer className="bg-black/20 backdrop-blur-sm text-white py-6 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Empowering Farmers with AI Precision Agriculture 🌱
          </p>
          <p className="text-xs text-white/60 mt-2">
            © 2026 Agri-Vision AI Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
