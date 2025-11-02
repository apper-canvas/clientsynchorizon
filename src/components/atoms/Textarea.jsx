import React from "react";
import { cn } from "@/utils/cn";

const Textarea = React.forwardRef(({ 
  className,
  error,
  ...props 
}, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm",
        "border-slate-300 bg-white placeholder:text-slate-400",
        "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none",
        "transition-all duration-200 resize-vertical",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
        error && "border-error-500 focus:border-error-500 focus:ring-error-500/20",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;