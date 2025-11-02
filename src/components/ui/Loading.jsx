import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  if (variant === "card") {
    return (
      <div className={cn("bg-white rounded-xl border border-slate-200 p-6", className)}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-slate-200 rounded w-24"></div>
            <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
          </div>
          <div className="h-8 bg-slate-200 rounded w-20 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("bg-white rounded-xl border border-slate-200 overflow-hidden", className)}>
        <div className="animate-pulse">
          <div className="bg-slate-50 p-4 border-b border-slate-200">
            <div className="h-4 bg-slate-200 rounded w-32"></div>
          </div>
          {[...Array(8)].map((_, index) => (
            <div key={index} className="p-4 border-b border-slate-200">
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <span className="ml-3 text-slate-600">Loading...</span>
    </div>
  );
};

export default Loading;