// 'use client'

// import { useState, useEffect, useRef, ReactElement } from "react";
// import { CallsModule, ContactsModule, DocumentsModule, SettingsModule, Sidebar} from "./mixture";
// import { ChatModule } from "./chat";
// import { DashboardContent } from "./dashboard";
// import { TopNav } from "./topNav";
// // Main Dashboard Component
// const Dashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<string>('dashboard');
//   const [isMobile, setIsMobile] = useState<boolean>(false);
//   const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);

//     const checkMobile = (): void => {
//       const mobile: boolean = window.innerWidth <= 768;
//       setIsMobile(mobile);
//       if (!mobile) {
//         setSidebarOpen(false);
//       }
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   const renderContent = (): ReactElement => {
//     if (!isClient) return <div />;

//     switch (activeTab) {
//       case 'dashboard':
//         return <DashboardContent />;
//       case 'chats':
//         return <ChatModule isMobile={isMobile} />;
//       case 'calls':
//         return <CallsModule />;
//       case 'contacts':
//         return <ContactsModule />;
//       case 'documents':
//         return <DocumentsModule />;
//       case 'settings':
//         return <SettingsModule />;
//       default:
//         return <DashboardContent />;
//     }
//   };

//   return (
//     <div className="h-screen bg-gray-100 overflow-hidden">
//       <div className="h-full flex">
//         {/* Sidebar */}
//         {isClient && (
//         <Sidebar
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//           isMobile={isMobile}
//           isOpen={sidebarOpen}
//           setIsOpen={setSidebarOpen}
//         />
//         )}
//         {/* Main Content */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Top Navigation */}
//           {isClient && (
//           <TopNav
//             isMobile={isMobile}
//             setSidebarOpen={setSidebarOpen}
//           />
//           )}
//           {/* Content Area */}
//           <div className="flex-1 overflow-hidden">
//             {renderContent()}
//           </div>
//         </div>
//       </div>
//     </div> 
//   );
// };

// export default Dashboard;


'use client'
import { useState, useEffect, useRef, ReactElement } from "react";
import { CallsModule, ContactsModule, DocumentsModule, SettingsModule, Sidebar} from "./mixture";
import { ChatModule } from "./chat";
import { DashboardContent } from "./dashboard";
import { TopNav } from "./topNav";

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = (): void => {
      // Check if window exists (client-side only)
      if (typeof window !== 'undefined') {
        const mobile: boolean = window.innerWidth <= 768;
        setIsMobile(mobile);
        if (!mobile) {
          setSidebarOpen(false);
        }
      }
    };
    
    // Only run on client-side
    checkMobile();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const renderContent = (): ReactElement => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'chats':
        return <ChatModule isMobile={isMobile} />;
      case 'calls':
        return <CallsModule />;
      case 'contacts':
        return <ContactsModule />;
      case 'documents':
        return <DocumentsModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <div className="h-full flex">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobile={isMobile}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
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
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

