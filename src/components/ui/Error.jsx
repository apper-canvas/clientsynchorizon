import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";

const Error = ({ 
  className, 
  message = "Something went wrong. Please try again.",
  onRetry,
  showRetry = true 
}) => {
  return (
    <Card className={cn("mx-auto max-w-md", className)}>
      <CardContent className="p-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-error-500/10 to-error-600/10 flex items-center justify-center">
          <ApperIcon name="AlertCircle" className="h-6 w-6 text-error-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-sm text-slate-600 mb-6">{message}</p>
        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="outline" className="w-full">
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Error;