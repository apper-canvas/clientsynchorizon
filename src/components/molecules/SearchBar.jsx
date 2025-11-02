import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  onClear,
  className,
  ...props 
}) => {
  const handleClear = () => {
    onChange({ target: { value: "" } });
    if (onClear) onClear();
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-4 w-4 text-slate-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-10"
        {...props}
      />
      {value && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={handleClear}
        >
          <ApperIcon 
            name="X" 
            className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" 
          />
        </button>
      )}
    </div>
  );
};

export default SearchBar;