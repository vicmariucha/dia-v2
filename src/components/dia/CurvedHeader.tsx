import { cn } from "@/lib/utils";

interface CurvedHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const CurvedHeader = ({ title, subtitle, className }: CurvedHeaderProps) => {
  return (
    <div className={cn("relative pb-16 pt-12 px-6", className)}>
      <div className="gradient-primary absolute inset-0 rounded-b-[48px]" />
      <div className="relative z-10 max-w-md mx-auto">
        <h1 className="text-3xl font-semibold text-white mb-2">{title}</h1>
        {subtitle && (
          <p className="text-white/90 text-sm leading-relaxed">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
