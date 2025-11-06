import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface OutlineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const OutlineButton = ({ children, icon, className, ...props }: OutlineButtonProps) => {
  return (
    <button
      className={cn(
        "w-full bg-card text-accent font-medium py-3.5 px-6 rounded-[32px]",
        "border-2 border-accent shadow-soft hover:shadow-elevated transition-smooth",
        "flex items-center justify-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};
