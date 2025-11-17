import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Plus,
  Activity,
  Droplet,
  UtensilsCrossed,
  Dumbbell,
  Stethoscope,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const isDoctorSection =
    location.pathname === "/my-doctor" ||
    location.pathname.startsWith("/doctor/") ||
    location.pathname.startsWith("/chat/");

  const navTextClass = (path: string, forceActive?: boolean) =>
    open
      ? "text-muted-foreground"
      : forceActive || isActive(path)
      ? "text-accent"
      : "text-muted-foreground hover:text-foreground";

  const navIconClass = (path: string, forceActive?: boolean) =>
    open
      ? "text-muted-foreground"
      : forceActive || isActive(path)
      ? "text-accent"
      : "text-muted-foreground group-hover:text-foreground";

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      {open && (
        <button
          aria-label="Fechar menu de registro"
          className="fixed inset-x-0 top-0 bottom-16 z-[80] bg-black/10 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {open && (
        <div className="fixed inset-x-0 bottom-16 z-[120]">
          <div className="max-w-md mx-auto px-6">
            <div className="bg-card border border-accent/30 rounded-3xl shadow-2xl p-3 grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <button
                onClick={() => go("/glucose-form")}
                className="flex flex-col items-center justify-center gap-1 text-xs text-foreground hover:text-accent transition-smooth rounded-xl py-2 hover:bg-muted/60"
              >
                <span className="w-8 h-8 rounded-full grid place-items-center bg-accent/10">
                  <Activity size={18} className="text-accent" />
                </span>
                <span>Glicemia</span>
              </button>

              <button
                onClick={() => go("/insulin-form")}
                className="flex flex-col items-center justify-center gap-1 text-xs text-foreground hover:text-accent transition-smooth rounded-xl py-2 hover:bg-muted/60"
              >
                <span className="w-8 h-8 rounded-full grid place-items-center bg-accent/10">
                  <Droplet size={18} className="text-accent" />
                </span>
                <span>Insulina</span>
              </button>

              <button
                onClick={() => go("/meal-form")}
                className="flex flex-col items-center justify-center gap-1 text-xs text-foreground hover:text-accent transition-smooth rounded-xl py-2 hover:bg-muted/60"
              >
                <span className="w-8 h-8 rounded-full grid place-items-center bg-accent/10">
                  <UtensilsCrossed size={18} className="text-accent" />
                </span>
                <span>Alimentação</span>
              </button>

              <button
                onClick={() => go("/activity-form")}
                className="flex flex-col items-center justify-center gap-1 text-xs text-foreground hover:text-accent transition-smooth rounded-xl py-2 hover:bg-muted/60"
              >
                <span className="w-8 h-8 rounded-full grid place-items-center bg-accent/10">
                  <Dumbbell size={18} className="text-accent" />
                </span>
                <span>Atividade</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 inset-x-0 z-[100] bg-card/95 border-t border-border backdrop-blur supports-[backdrop-filter]:backdrop-blur">
        <nav className="max-w-md mx-auto px-6">
          <div className="grid grid-cols-5 h-16 items-center">
            <button
              onClick={() => navigate("/home-patient")}
              className="group flex flex-col items-center justify-center text-xs transition-smooth"
              aria-current={isActive("/home-patient") ? "page" : undefined}
            >
              <div className={cn("h-6 flex items-center justify-center", navIconClass("/home-patient"))}>
                <Home size={20} />
              </div>
              <span className={cn("mt-1", navTextClass("/home-patient"))}>Início</span>
            </button>

            <button
              onClick={() => navigate("/history")}
              className="group flex flex-col items-center justify-center text-xs transition-smooth"
              aria-current={isActive("/history") ? "page" : undefined}
            >
              <div className={cn("h-6 flex items-center justify-center", navIconClass("/history"))}>
                <History size={20} />
              </div>
              <span className={cn("mt-1", navTextClass("/history"))}>Histórico</span>
            </button>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-haspopup="true"
              aria-label="Abrir menu de registro"
              className="flex flex-col items-center justify-center text-xs"
            >
              <div className="h-6 flex items-center justify-center">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full grid place-items-center transition-smooth shadow-soft",
                    open ? "bg-card ring-2 ring-accent" : "gradient-primary hover:shadow-elevated"
                  )}
                >
                  <Plus size={14} className={cn(open ? "text-accent" : "text-white")} />
                </div>
              </div>
              <span className={cn("mt-1", open ? "text-accent" : "text-muted-foreground")}>
                Registro
              </span>
            </button>

            <button
              onClick={() => navigate("/my-doctor")}
              className="group flex flex-col items-center justify-center text-xs transition-smooth"
              aria-current={isDoctorSection ? "page" : undefined}
            >
              <div className={cn("h-6 flex items-center justify-center", navIconClass("/my-doctor", isDoctorSection))}>
                <Stethoscope size={20} />
              </div>
              <span className={cn("mt-1", navTextClass("/my-doctor", isDoctorSection))}>
                Meu médico
              </span>
            </button>

            <button
              onClick={() => navigate("/perfil")}
              className="group flex flex-col items-center justify-center text-xs transition-smooth"
              aria-current={isActive("/perfil") ? "page" : undefined}
            >
              <div className={cn("h-6 flex items-center justify-center", navIconClass("/perfil"))}>
                <User size={20} />
              </div>
              <span className={cn("mt-1", navTextClass("/perfil"))}>Perfil</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default BottomNav;
