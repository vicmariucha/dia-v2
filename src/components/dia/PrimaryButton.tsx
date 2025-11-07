import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const PrimaryButton = ({ children, className, ...props }: PrimaryButtonProps) => {
  return (
    <button
      className={cn(
        "w-full gradient-primary text-white font-medium py-3.5 px-6 rounded-[32px] font-poppins",
        "shadow-soft hover:shadow-elevated transition-smooth",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
