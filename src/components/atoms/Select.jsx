import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  className,
  children,
  error,
  ...props 
}, ref) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-lg border px-3 py-2 text-sm",
        "border-slate-300 bg-white",
        "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none",
        "transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
        error && "border-error-500 focus:border-error-500 focus:ring-error-500/20",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;