import React from "react";
import { cn } from "@/utils/cn";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = "positive",
  icon, 
  className,
  loading = false 
}) => {
  if (loading) {
    return (
      <Card className={cn("card-hover", className)}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-slate-200 rounded w-24"></div>
              <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
            </div>
            <div className="h-8 bg-slate-200 rounded w-20 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-16"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const changeColor = changeType === "positive" ? "text-success-600" : "text-error-600";
  const changeIcon = changeType === "positive" ? "TrendingUp" : "TrendingDown";

  return (
    <Card className={cn("card-hover", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          {icon && (
            <div className="h-10 w-10 bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-lg flex items-center justify-center">
              <ApperIcon name={icon} className="h-5 w-5 text-primary-600" />
            </div>
          )}
        </div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl font-bold text-slate-900 gradient-text">{value}</h3>
          {change && (
            <div className={cn("flex items-center text-sm font-medium", changeColor)}>
              <ApperIcon name={changeIcon} className="h-3 w-3 mr-1" />
              {change}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;