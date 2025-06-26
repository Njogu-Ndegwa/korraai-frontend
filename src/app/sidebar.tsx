// 'use client'
// // Original
// import { useEffect } from 'react';
// import { 
//   MessageCircle, 
//   BarChart3, 
//   FileText, 
//   Settings, 
//   Users, 
//   Phone,
//   X,
//   LucideIcon,
//   MoreHorizontal,
//   Sparkles,
// } from 'lucide-react';

// interface SidebarProps {
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
//   isMobile: boolean;
//   isOpen: boolean;
//   setIsOpen: (open: boolean) => void;
// }

// interface MenuItem {
//   id: string;
//   icon: LucideIcon;
//   label: string;
//   count: number | null;
// }
// // Sidebar Component
// export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isMobile, isOpen, setIsOpen }) => {
//   const menuItems: MenuItem[] = [
//     { id: 'dashboard', icon: BarChart3, label: 'Dashboard', count: null },
//     { id: 'chats', icon: MessageCircle, label: 'Messages', count: 6 },
//     { id: 'calls', icon: Phone, label: 'Calls', count: null },
//     { id: 'contacts', icon: Users, label: 'Contacts', count: null },
//     { id: 'documents', icon: FileText, label: 'Documents', count: null },
//     { id: 'settings', icon: Settings, label: 'Settings', count: null }
//   ];

//   // Add custom styles only on client-side
//   useEffect(() => {
//     if (typeof document !== 'undefined') {
//       // Check if styles already exist to avoid duplicates
//       if (!document.querySelector('#custom-animations')) {
//         const style = document.createElement('style');
//         style.id = 'custom-animations';
//         style.textContent = `
//           @keyframes fadeIn {
//             from {
//               opacity: 0;
//               transform: translateY(10px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
          
//           .animate-fadeIn {
//             animation: fadeIn 0.3s ease-out;
//           }
//         `;
//         document.head.appendChild(style);
//       }
//     }
//   }, []);

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isMobile && isOpen && (
//         <div 
//           className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
      
//       {/* Sidebar */}
//       <div className={`
//         ${isMobile ? 'fixed' : 'relative'} 
//         ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
//         w-72 h-full bg-slate-900 text-white
//         transition-all duration-300 ease-out z-50 flex flex-col
//         ${!isMobile ? 'border-r border-slate-800' : ''}
//       `}>
//         {/* Header */}
//         <div className="p-6 border-b border-slate-800">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
//                 <Sparkles className="text-white" size={20} />
//               </div>
//               <div>
//                 <span className="text-white font-bold text-xl">Korra AI</span>
//                 <div className="text-slate-400 text-xs">Smart CRM</div>
//               </div>
//             </div>
//             {isMobile && (
//               <button 
//                 onClick={() => setIsOpen(false)}
//                 className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 p-4">
//           <div className="space-y-1">
//             {menuItems.map((item: MenuItem) => {
//               const Icon = item.icon;
//               const isActive: boolean = activeTab === item.id;
//               const isDisabled: boolean = item.id !== 'chats' && item.id !== 'dashboard';
              
//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => {
//                     if (!isDisabled) {
//                       setActiveTab(item.id);
//                       if (isMobile) setIsOpen(false);
//                     }
//                   }}
//                   disabled={isDisabled}
//                   className={`
//                     w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group
//                     ${isActive 
//                       ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
//                       : isDisabled 
//                         ? 'text-slate-600 cursor-not-allowed' 
//                         : 'text-slate-300 hover:bg-slate-800 hover:text-white'
//                     }
//                   `}
//                 >
//                   <div className="flex items-center gap-3">
//                     <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
//                     <span className="font-medium">{item.label}</span>
//                   </div>
//                   {item.count && (
//                     <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-5 text-center font-bold animate-pulse">
//                       {item.count}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </nav>

//         {/* User Section */}
//         <div className="p-6 border-t border-slate-800">
//           <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer">
//             <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
//               JD
//             </div>
//             <div className="flex-1">
//               <div className="text-white font-medium">John Doe</div>
//               <div className="text-slate-400 text-xs">Admin Account</div>
//             </div>
//             <MoreHorizontal size={16} className="text-slate-400" />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };


// // ===== 1. Updated Sidebar Component (components/sidebar/Sidebar.tsx) =====
// 'use client'

// import { useEffect } from 'react';
// import { 
//   MessageCircle, 
//   BarChart3, 
//   FileText, 
//   Settings, 
//   Users, 
//   Phone,
//   X,
//   LucideIcon,
//   MoreHorizontal,
//   Sparkles,
// } from 'lucide-react';

// interface SidebarProps {
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
//   isMobile: boolean;
//   isOpen: boolean;
//   onClose: () => void; // ✅ Changed from setIsOpen to onClose for consistency
// }

// interface MenuItem {
//   id: string;
//   icon: LucideIcon;
//   label: string;
//   count: number | null;
// }

// // Updated Sidebar Component
// export const Sidebar: React.FC<SidebarProps> = ({ 
//   activeTab, 
//   setActiveTab, 
//   isMobile, 
//   isOpen, 
//   onClose 
// }) => {
//   const menuItems: MenuItem[] = [
//     { id: 'dashboard', icon: BarChart3, label: 'Dashboard', count: null },
//     { id: 'chats', icon: MessageCircle, label: 'Messages', count: 6 },
//     { id: 'calls', icon: Phone, label: 'Calls', count: null },
//     { id: 'contacts', icon: Users, label: 'Contacts', count: null },
//     { id: 'documents', icon: FileText, label: 'Documents', count: null },
//     { id: 'settings', icon: Settings, label: 'Settings', count: null }
//   ];

//   // Add custom styles only on client-side
//   useEffect(() => {
//     if (typeof document !== 'undefined') {
//       // Check if styles already exist to avoid duplicates
//       if (!document.querySelector('#custom-animations')) {
//         const style = document.createElement('style');
//         style.id = 'custom-animations';
//         style.textContent = `
//           @keyframes fadeIn {
//             from {
//               opacity: 0;
//               transform: translateY(10px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
          
//           .animate-fadeIn {
//             animation: fadeIn 0.3s ease-out;
//           }
//         `;
//         document.head.appendChild(style);
//       }
//     }
//   }, []);

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isMobile && isOpen && (
//         <div 
//           className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
//           onClick={onClose}
//         />
//       )}
      
//       {/* Sidebar */}
//       <div className={`
//         ${isMobile ? 'fixed' : 'relative'} 
//         ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
//         w-72 h-full bg-slate-900 text-white
//         transition-all duration-300 ease-out z-50 flex flex-col
//         ${!isMobile ? 'border-r border-slate-800' : ''}
//       `}>
//         {/* Header */}
//         <div className="p-6 border-b border-slate-800">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
//                 <Sparkles className="text-white" size={20} />
//               </div>
//               <div>
//                 <span className="text-white font-bold text-xl">Korra AI</span>
//                 <div className="text-slate-400 text-xs">Smart CRM</div>
//               </div>
//             </div>
//             {isMobile && (
//               <button 
//                 onClick={onClose}
//                 className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 p-4">
//           <div className="space-y-1">
//             {menuItems.map((item: MenuItem) => {
//               const Icon = item.icon;
//               const isActive: boolean = activeTab === item.id;
//               const isDisabled: boolean = item.id !== 'chats' && item.id !== 'dashboard';
              
//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => {
//                     if (!isDisabled) {
//                       setActiveTab(item.id);
//                       if (isMobile) onClose(); // ✅ Use onClose instead of setIsOpen
//                     }
//                   }}
//                   disabled={isDisabled}
//                   className={`
//                     w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group
//                     ${isActive 
//                       ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
//                       : isDisabled 
//                         ? 'text-slate-600 cursor-not-allowed' 
//                         : 'text-slate-300 hover:bg-slate-800 hover:text-white'
//                     }
//                   `}
//                 >
//                   <div className="flex items-center gap-3">
//                     <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
//                     <span className="font-medium">{item.label}</span>
//                   </div>
//                   {item.count && (
//                     <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-5 text-center font-bold animate-pulse">
//                       {item.count}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </nav>

//         {/* User Section */}
//         <div className="p-6 border-t border-slate-800">
//           <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer">
//             <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
//               JD
//             </div>
//             <div className="flex-1">
//               <div className="text-white font-medium">John Doe</div>
//               <div className="text-slate-400 text-xs">Admin Account</div>
//             </div>
//             <MoreHorizontal size={16} className="text-slate-400" />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // ===== 1. Updated Sidebar with Next.js Routing (components/sidebar/Sidebar.tsx) =====
// 'use client'
// // New Copy
// import { useEffect } from 'react';
// import { usePathname, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { 
//   MessageCircle, 
//   BarChart3, 
//   FileText, 
//   Settings, 
//   Users, 
//   Phone,
//   X,
//   LucideIcon,
//   MoreHorizontal,
//   Sparkles,
// } from 'lucide-react';

// interface SidebarProps {
//   isMobile: boolean;
//   isOpen: boolean;
//   onClose: () => void;
// }

// interface MenuItem {
//   id: string;
//   icon: LucideIcon;
//   label: string;
//   href: string; // ✅ Added href for routing
//   count: number | null;
//   disabled?: boolean; // ✅ Added disabled flag
// }

// // Production Sidebar Component with Routing
// export const Sidebar: React.FC<SidebarProps> = ({ 
//   isMobile, 
//   isOpen, 
//   onClose 
// }) => {
//   const pathname = usePathname();
//   const router = useRouter();

//   const menuItems: MenuItem[] = [
//     { 
//       id: 'dashboard', 
//       icon: BarChart3, 
//       label: 'Dashboard', 
//       href: '/dashboard',
//       count: null 
//     },
//     { 
//       id: 'chats', 
//       icon: MessageCircle, 
//       label: 'Messages', 
//       href: '/messages',
//       count: 6 
//     },
//     { 
//       id: 'calls', 
//       icon: Phone, 
//       label: 'Calls', 
//       href: '/calls',
//       count: null,
//       disabled: true // ✅ Coming soon
//     },
//     { 
//       id: 'contacts', 
//       icon: Users, 
//       label: 'Contacts', 
//       href: '/contacts',
//       count: null,
//       disabled: true // ✅ Coming soon
//     },
//     { 
//       id: 'documents', 
//       icon: FileText, 
//       label: 'Documents', 
//       href: '/documents',
//       count: null,
//       disabled: true // ✅ Coming soon
//     },
//     { 
//       id: 'settings', 
//       icon: Settings, 
//       label: 'Settings', 
//       href: '/settings',
//       count: null,
//       disabled: true // ✅ Coming soon
//     }
//   ];

//   // Add custom styles only on client-side
//   useEffect(() => {
//     if (typeof document !== 'undefined') {
//       if (!document.querySelector('#custom-animations')) {
//         const style = document.createElement('style');
//         style.id = 'custom-animations';
//         style.textContent = `
//           @keyframes fadeIn {
//             from {
//               opacity: 0;
//               transform: translateY(10px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
          
//           .animate-fadeIn {
//             animation: fadeIn 0.3s ease-out;
//           }
//         `;
//         document.head.appendChild(style);
//       }
//     }
//   }, []);

//   // Helper function to check if route is active
//   const isActiveRoute = (href: string): boolean => {
//     if (href === '/dashboard') {
//       return pathname === '/dashboard' || pathname === '/';
//     }
//     return pathname.startsWith(href);
//   };

//   // Handle navigation click
//   const handleNavigation = (item: MenuItem) => {
//     if (item.disabled) return;
    
//     if (isMobile) {
//       onClose(); // Close mobile sidebar
//     }
    
//     router.push(item.href);
//   };

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isMobile && isOpen && (
//         <div 
//           className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
//           onClick={onClose}
//         />
//       )}
      
//       {/* Sidebar */}
//       <div className={`
//         ${isMobile ? 'fixed' : 'relative'} 
//         ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
//         w-72 h-full bg-slate-900 text-white
//         transition-all duration-300 ease-out z-50 flex flex-col
//         ${!isMobile ? 'border-r border-slate-800' : ''}
//       `}>
//         {/* Header */}
//         <div className="p-6 border-b border-slate-800">
//           <div className="flex items-center justify-between">
//             <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
//               <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
//                 <Sparkles className="text-white" size={20} />
//               </div>
//               <div>
//                 <span className="text-white font-bold text-xl">Korra AI</span>
//                 <div className="text-slate-400 text-xs">Smart CRM</div>
//               </div>
//             </Link>
//             {isMobile && (
//               <button 
//                 onClick={onClose}
//                 className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 p-4">
//           <div className="space-y-1">
//             {menuItems.map((item: MenuItem) => {
//               const Icon = item.icon;
//               const isActive = isActiveRoute(item.href);
              
//               // ✅ For disabled items, render as button
//               if (item.disabled) {
//                 return (
//                   <button
//                     key={item.id}
//                     disabled
//                     className="w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group text-slate-600 cursor-not-allowed"
//                   >
//                     <div className="flex items-center gap-3">
//                       <Icon size={20} />
//                       <span className="font-medium">{item.label}</span>
//                       <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">Soon</span>
//                     </div>
//                     {item.count && (
//                       <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-5 text-center font-bold animate-pulse">
//                         {item.count}
//                       </span>
//                     )}
//                   </button>
//                 );
//               }
              
//               // ✅ For enabled items, render as Link or button with navigation
//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => handleNavigation(item)}
//                   className={`
//                     w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group
//                     ${isActive 
//                       ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
//                       : 'text-slate-300 hover:bg-slate-800 hover:text-white'
//                     }
//                   `}
//                 >
//                   <div className="flex items-center gap-3">
//                     <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
//                     <span className="font-medium">{item.label}</span>
//                   </div>
//                   {item.count && (
//                     <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-5 text-center font-bold animate-pulse">
//                       {item.count}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </nav>

//         {/* User Section */}
//         <div className="p-6 border-t border-slate-800">
//           <Link 
//             href="/profile" 
//             className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer"
//           >
//             <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
//               JD
//             </div>
//             <div className="flex-1">
//               <div className="text-white font-medium">John Doe</div>
//               <div className="text-slate-400 text-xs">Admin Account</div>
//             </div>
//             <MoreHorizontal size={16} className="text-slate-400" />
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// };


'use client'
// Updated with routing functionality but original styling
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MessageCircle, 
  BarChart3, 
  FileText, 
  Settings, 
  Users, 
  Phone,
  X,
  LucideIcon,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
  totalUnreadCount?: number; // ADD THIS
}

interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  href: string;
  count: number | null;
  disabled?: boolean;
}

// Production Sidebar Component with Routing
export const Sidebar: React.FC<SidebarProps> = ({ 
  isMobile, 
  isOpen, 
  onClose,
  totalUnreadCount = 0 
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems: MenuItem[] = [
    { 
      id: 'dashboards', 
      icon: BarChart3, 
      label: 'Dashboard', 
      href: '/dashboards',
      count: null 
    },
    { 
      id: 'chats', 
      icon: MessageCircle, 
      label: 'Chats', 
      href: '/conversations',
      count: totalUnreadCount > 0 ? totalUnreadCount : null
    },
    { 
      id: 'calls', 
      icon: Phone, 
      label: 'Calls', 
      href: '/calls',
      count: null,
      disabled: true
    },
    { 
      id: 'contacts', 
      icon: Users, 
      label: 'Contacts', 
      href: '/contacts',
      count: null,
      disabled: true
    },
    { 
      id: 'documents', 
      icon: FileText, 
      label: 'Documents', 
      href: '/documents',
      count: null,
      disabled: true
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Settings', 
      href: '/settings',
      count: null,
      disabled: true
    }
  ];

  // Add custom styles only on client-side
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (!document.querySelector('#custom-animations')) {
        const style = document.createElement('style');
        style.id = 'custom-animations';
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
      }
    }
  }, []);

  // Helper function to check if route is active
  const isActiveRoute = (href: string): boolean => {
    if (href === '/dashboards') {
      return pathname === '/dashboards' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Handle navigation click
  const handleNavigation = (item: MenuItem) => {
    if (item.disabled) return;
    
    if (isMobile) {
      onClose(); // Close mobile sidebar
    }
    
    router.push(item.href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
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
                onClick={onClose}
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
              const isActive = isActiveRoute(item.href);
              const isDisabled = item.disabled || false;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
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