import { cn } from "@/lib/utils";

interface CurvedHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  padding?: "sm" | "md" | "lg";
  withBackground?: boolean;
}

const paddingClasses: Record<NonNullable<CurvedHeaderProps["padding"]>, string> = {
  sm: "pt-8 pb-8",
  md: "pt-12 pb-16",
  lg: "pt-16 pb-20",
};

export const CurvedHeader = ({
  title,
  subtitle,
  className,
  padding = "md",
  withBackground = true,
}: CurvedHeaderProps) => {
  return (
    <div className={cn("relative px-6 overflow-hidden", paddingClasses[padding], className)}>
      {withBackground && (
        <div className="gradient-primary absolute inset-0 z-0" />
      )}

      <div className="relative z-10 max-w-md mx-auto">
        <h1 className="text-3xl font-semibold text-white mb-2 font-poppins">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/90 text-sm leading-relaxed font-poppins">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
