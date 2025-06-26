'use client'


import React from 'react';
import { 
  MessageCircle, 
  BarChart3, 
  FileText, 
  Settings, 
  Users, 
  Phone,
  Menu,
  X,
  Bot,
  Bell,
  LucideIcon,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';


interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  count: number | null;
}

interface Stat {
  label: string;
  value: string;
  change: string;
  color: string;
  icon: LucideIcon;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}


// Constants
const BEARER_TOKEN: string = 'your-bearer-token';
const USER_ID: string = '88280a92-7ab2-45ed-96b8-cc2fbd2ee539';
const TENANT_ID: string = '49592c05-e4f6-4ae1-ba21-9e5034171ffa';

// Sidebar Component
export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isMobile, isOpen, setIsOpen }) => {
  const menuItems: MenuItem[] = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard', count: null },
    { id: 'chats', icon: MessageCircle, label: 'Messages', count: 6 },
    { id: 'calls', icon: Phone, label: 'Calls', count: null },
    { id: 'contacts', icon: Users, label: 'Contacts', count: null },
    { id: 'documents', icon: FileText, label: 'Documents', count: null },
    { id: 'settings', icon: Settings, label: 'Settings', count: null }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'} 
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        w-72 h-full bg-slate-900 text-white
        transition-all duration-300 ease-out z-50 flex flex-col
        ${!isMobile ? 'border-r border-slate-800' : ''}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <span className="text-white font-bold text-xl">Korra AI</span>
                <div className="text-slate-400 text-xs">Smart CRM</div>
              </div>
            </div>
            {isMobile && (
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {menuItems.map((item: MenuItem) => {
              const Icon = item.icon;
              const isActive: boolean = activeTab === item.id;
              const isDisabled: boolean = item.id !== 'chats' && item.id !== 'dashboard';
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!isDisabled) {
                      setActiveTab(item.id);
                      if (isMobile) setIsOpen(false);
                    }
                  }}
                  disabled={isDisabled}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group
                    ${isActive 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
                      : isDisabled 
                        ? 'text-slate-600 cursor-not-allowed' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-5 text-center font-bold animate-pulse">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
              JD
            </div>
            <div className="flex-1">
              <div className="text-white font-medium">John Doe</div>
              <div className="text-slate-400 text-xs">Admin Account</div>
            </div>
            <MoreHorizontal size={16} className="text-slate-400" />
          </div>
        </div>
      </div>
    </>
  );
};

// Placeholder Components for other modules
export const CallsModule: React.FC = () => (
  <div className="h-full flex items-center justify-center bg-gray-50">
    <div className="text-center text-gray-500">
      <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
        <Phone size={40} className="text-gray-600" />
      </div>
      <h3 className="text-2xl font-bold mb-2 text-gray-700">Calls Module</h3>
      <p className="text-gray-500">Coming soon...</p>
    </div>
  </div>
);

export const ContactsModule: React.FC = () => (
  <div className="h-full flex items-center justify-center bg-gray-50">
    <div className="text-center text-gray-500">
      <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users size={40} className="text-gray-600" />
      </div>
      <h3 className="text-2xl font-bold mb-2 text-gray-700">Contacts Module</h3>
      <p className="text-gray-500">Coming soon...</p>
    </div>
  </div>
);

export const DocumentsModule: React.FC = () => (
  <div className="h-full flex items-center justify-center bg-gray-50">
    <div className="text-center text-gray-500">
      <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText size={40} className="text-gray-600" />
      </div>
      <h3 className="text-2xl font-bold mb-2 text-gray-700">Documents Module</h3>
      <p className="text-gray-500">Coming soon...</p>
    </div>
  </div>
);

export const SettingsModule: React.FC = () => (
  <div className="h-full flex items-center justify-center bg-gray-50">
    <div className="text-center text-gray-500">
      <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
        <Settings size={40} className="text-gray-600" />
      </div>
      <h3 className="text-2xl font-bold mb-2 text-gray-700">Settings Module</h3>
      <p className="text-gray-500">Coming soon...</p>
    </div>
  </div>
);


const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`;
document.head.appendChild(style);




