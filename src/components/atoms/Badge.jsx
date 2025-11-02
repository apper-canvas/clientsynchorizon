import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className,
  variant = "default",
  size = "default",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 border border-slate-200",
    primary: "bg-gradient-to-r from-primary-500/10 to-primary-600/10 text-primary-700 border border-primary-200",
    success: "bg-gradient-to-r from-success-500/10 to-success-600/10 text-success-700 border border-success-200",
    warning: "bg-gradient-to-r from-warning-500/10 to-warning-600/10 text-warning-700 border border-warning-200",
    danger: "bg-gradient-to-r from-error-500/10 to-error-600/10 text-error-700 border border-error-200",
    outline: "bg-transparent border border-slate-300 text-slate-600"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        "transition-all duration-200",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;