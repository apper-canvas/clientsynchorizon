import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const titles = {
      "/": "Dashboard",
      "/contacts": "Contacts", 
      "/companies": "Companies",
      "/deals": "Deals",
      "/activities": "Activities"
    };
    return titles[location.pathname] || "ClientSync";
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 lg:ml-64">
        {/* Header */}
        <Header 
          onMenuToggle={() => setSidebarOpen(true)}
          title={getPageTitle()}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;