import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";

const Empty = ({ 
  className,
  title = "No data found",
  description = "Get started by creating your first item.",
  icon = "Package",
  actionLabel = "Get Started",
  onAction,
  showAction = true
}) => {
  return (
    <Card className={cn("mx-auto max-w-md", className)}>
      <CardContent className="p-8 text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-primary-500/10 to-primary-600/10 flex items-center justify-center">
          <ApperIcon name={icon} className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{description}</p>
        {showAction && onAction && (
          <Button onClick={onAction} className="btn-gradient">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Empty;