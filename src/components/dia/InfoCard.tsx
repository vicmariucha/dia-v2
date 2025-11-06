import { cn } from "@/lib/utils";

interface InfoCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const InfoCard = ({ children, className, onClick }: InfoCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card rounded-3xl p-6 shadow-soft transition-smooth",
        onClick && "cursor-pointer hover:shadow-elevated",
        className
      )}
    >
      {children}
    </div>
  );
};
