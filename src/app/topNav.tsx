import { Menu, Bell } from "lucide-react";

interface TopNavProps {
  isMobile: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// Top Navigation Component
export const TopNav: React.FC<TopNavProps> = ({ isMobile, setSidebarOpen }) => {
  return (
    <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {isMobile && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
          >
            <Menu size={20} />
          </button>
        )}
        
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 relative transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </button>
        
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20 cursor-pointer hover:scale-105 transition-transform">
          JD
        </div>
      </div>
    </div>
  );
};