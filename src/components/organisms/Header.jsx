import React from "react";
import { useAuth } from "@/layouts/Root";
import { useSelector } from "react-redux";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuToggle, title }) => {
  const { logout } = useAuth();
  const { user } = useSelector(state => state.user);

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden mr-3"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-sm text-slate-600">
                Welcome, {user.firstName || user.name}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="LogOut" className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;