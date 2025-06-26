// ===== app/layout.tsx (Root Layout - Updated) =====
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '../sidebar';
import { TopNav } from '../topNav';
import { isAuth } from '@/lib/auth';
// import './globals.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

// export default function RootLayout({ children }: RootLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
//   const [isMobile, setIsMobile] = useState<boolean>(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     const checkMobile = (): void => {
//       if (typeof window !== 'undefined') {
//         const mobile: boolean = window.innerWidth <= 768;
//         console.log(mobile, "Mobile----105000");
//         setIsMobile(mobile);
//         if (!mobile) {
//           setSidebarOpen(false);
//         }
//       }
//     };
    
//     checkMobile();
    
//     if (typeof window !== 'undefined') {
//       window.addEventListener('resize', checkMobile);
//       return () => window.removeEventListener('resize', checkMobile);
//     }
//   }, []);

//   // Check if current route should show the dashboard layout
//   const shouldShowDashboardLayout = pathname !== '/auth' && pathname !== '/login' && pathname !== '/signup';
  
//   // Check if current route should hide TopNav (conversations page has its own header)
//   const shouldHideTopNav = pathname.startsWith('/conversations');

//   return (
//     <html lang="en">
//       <body>
//         {shouldShowDashboardLayout ? (
//           // Dashboard Layout with Sidebar + TopNav
//           <div className="h-screen bg-gray-100 overflow-hidden">
//             <div className="h-full flex">
//               {/* Sidebar - Hide on mobile when showing conversations */}
//               {(!isMobile || !shouldHideTopNav) && (
//                 <Sidebar
//                   isMobile={isMobile}
//                   isOpen={sidebarOpen}
//                   onClose={() => setSidebarOpen(false)}
                  
//                 />
//               )}
              
//               {/* Main Content */}
//               <div className="flex-1 flex flex-col overflow-hidden">
//                 {/* Top Navigation - Hide for conversations page */}
//                 {!shouldHideTopNav && (
//                   <TopNav
//                     isMobile={isMobile}
//                     setSidebarOpen={setSidebarOpen}
//                   />
//                 )}
                
//                 {/* Content Area */}
//                 <div className={`flex-1 overflow-hidden ${shouldHideTopNav ? 'h-full' : ''}`}>
//                   {children}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           // Auth Layout (no sidebar/topnav)
//           <div className="min-h-screen bg-gradient-to-b from-[#24272C] to-[#0C0C0E]">
//             {children}
//           </div>
//         )}
//       </body>
//     </html>
//   );
// }

 function RootLayout({ children }: RootLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState<number>(0); // ADD THIS
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
  
  // Check if current route should hide TopNav (conversations page has its own header)
  const shouldHideTopNav = pathname.startsWith('/conversations');

  // ADD THIS FUNCTION to handle unread count updates from conversations page:
  const handleUnreadCountChange = (count: number) => {
    setTotalUnreadCount(count);
  };

  // MODIFY children to inject the callback for conversations page:
 const enhancedChildren = pathname.startsWith('/conversations') 
  ? React.cloneElement(children as React.ReactElement<any>, { 
      onUnreadCountChange: handleUnreadCountChange 
    })
  : children;

  return (
    <html lang="en">
      <body>
        {shouldShowDashboardLayout ? (
          <div className="h-screen bg-gray-100 overflow-hidden">
            <div className="h-full flex">
              {(!isMobile || !shouldHideTopNav) && (
                <Sidebar
                  isMobile={isMobile}
                  isOpen={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                  totalUnreadCount={totalUnreadCount} // PASS THE COUNT HERE
                />
              )}
              
              <div className="flex-1 flex flex-col overflow-hidden">
                {!shouldHideTopNav && (
                  <TopNav
                    isMobile={isMobile}
                    setSidebarOpen={setSidebarOpen}
                  />
                )}
                
                <div className={`flex-1 overflow-hidden ${shouldHideTopNav ? 'h-full' : ''}`}>
                  {enhancedChildren}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-gradient-to-b from-[#24272C] to-[#0C0C0E]">
            {children}
          </div>
        )}
      </body>
    </html>
  );
}

export default isAuth(RootLayout);