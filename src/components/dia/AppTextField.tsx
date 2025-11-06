import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AppTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const AppTextField = forwardRef<HTMLInputElement, AppTextFieldProps>(
  ({ label, icon, error, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "transition-smooth",
              icon && "pl-12",
              isPassword && "pr-12",
              error && "border-destructive",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive mt-1.5">{error}</p>
        )}
      </div>
    );
  }
);

AppTextField.displayName = "AppTextField";
