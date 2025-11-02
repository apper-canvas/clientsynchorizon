import React from "react";
import { cn } from "@/utils/cn";

const Label = React.forwardRef(({ 
  className,
  required,
  children,
  ...props 
}, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-slate-700 leading-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-error-500 ml-1">*</span>}
    </label>
  );
});

Label.displayName = "Label";

export default Label;