// ===== app/layout.tsx (Root Layout - Single Layout for Everything) =====
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '../sidebar';
import { TopNav } from '../topNav';
// import './globals.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = (): void => {
      if (typeof window !== 'undefined') {
        const mobile: boolean = window.innerWidth <= 768;
        console.log(mobile, "Mobile----105000");
        setIsMobile(mobile);
        if (!mobile) {
          setSidebarOpen(false);
        }
      }
    };
    
    checkMobile();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Check if current route should show the dashboard layout
  const shouldShowDashboardLayout = pathname !== '/auth' && pathname !== '/login' && pathname !== '/signup';

  return (
    <html lang="en">
      <body>
        {shouldShowDashboardLayout ? (
          // Dashboard Layout with Sidebar + TopNav
          <div className="h-screen bg-gray-100 overflow-hidden">
            <div className="h-full flex">
              {/* Sidebar */}
              <Sidebar
                isMobile={isMobile}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
              
              {/* Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <TopNav
                  isMobile={isMobile}
                  setSidebarOpen={setSidebarOpen}
                />
                
                {/* Content Area */}
                <div className="flex-1 overflow-hidden">
                  {children}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Auth Layout (no sidebar/topnav)
          <div className="min-h-screen bg-gradient-to-b from-[#24272C] to-[#0C0C0E]">
            {children}
          </div>
        )}
      </body>
    </html>
  );
}