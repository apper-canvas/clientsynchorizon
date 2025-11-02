import React from "react";
import { cn } from "@/utils/cn";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required = false, 
  className,
  children,
  ...props 
}) => {
  const id = props.id || props.name;

  const renderInput = () => {
    if (children) return children;
    
    switch (type) {
      case "select":
        return <Select error={error} {...props} />;
      case "textarea":
        return <Textarea error={error} {...props} />;
      default:
        return <Input type={type} error={error} {...props} />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      {renderInput()}
      {error && (
        <p className="text-sm text-error-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;