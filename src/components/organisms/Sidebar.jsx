import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "BarChart3" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Companies", href: "/companies", icon: "Building2" },
    { name: "Deals", href: "/deals", icon: "Target" },
    { name: "Activities", href: "/activities", icon: "CheckSquare" }
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href || 
      (item.href !== "/" && location.pathname.startsWith(item.href));

    return (
      <NavLink
        to={item.href}
        onClick={() => onClose?.()}
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
          "hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:scale-105",
          isActive
            ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-medium"
            : "text-slate-600 hover:text-primary-700"
        )}
      >
        <ApperIcon 
          name={item.icon} 
          className={cn(
            "mr-3 h-5 w-5 transition-colors",
            isActive ? "text-white" : "text-slate-500"
          )}
        />
        {item.name}
      </NavLink>
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-50">
      <div className="flex flex-col flex-grow pt-5 bg-white border-r border-slate-200 shadow-soft">
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-medium">
              <ApperIcon name="Users" className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold gradient-text">ClientSync</h1>
              <p className="text-xs text-slate-500">Professional CRM</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 pb-4 space-y-2">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-4 w-4 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-900">Sales Team</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div 
            className={cn(
              "relative flex flex-col w-64 bg-white shadow-strong transform transition-transform duration-300",
              isOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-br from-primary-600 to-primary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" className="h-5 w-5 text-white" />
                </div>
                <div className="ml-2">
                  <h1 className="text-lg font-bold gradient-text">ClientSync</h1>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ApperIcon name="X" className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;