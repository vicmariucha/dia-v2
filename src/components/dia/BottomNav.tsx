import { Home, PlusCircle, UserCircle, Stethoscope } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/home-patient" },
    { icon: PlusCircle, label: "Registro", path: "/glucose-form" },
    { icon: Stethoscope, label: "Meu médico", path: "/doctor" },
    { icon: UserCircle, label: "Perfil", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-elevated rounded-t-3xl z-50">
      <div className="max-w-md mx-auto px-6 py-4">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-smooth",
                  isActive ? "text-accent" : "text-muted-foreground"
                )}
              >
                <item.icon size={24} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
