// src/components/dia/DoctorBottomNav.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { Users, MessageCircle, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const DoctorBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isPatientsSection =
    location.pathname === "/doctor" ||
    (location.pathname.startsWith("/doctor/") &&
      !location.pathname.startsWith("/doctor/chat") &&
      !location.pathname.startsWith("/doctor/profile"));

  const isChatSection =
    location.pathname === "/doctor/chat" ||
    location.pathname.startsWith("/doctor/chat/");

  const isProfileSection =
    location.pathname === "/doctor/profile" ||
    location.pathname.startsWith("/doctor/profile/");

  const navTextClass = (active: boolean) =>
    active
      ? "text-accent"
      : "text-muted-foreground hover:text-foreground";

  const navIconClass = (active: boolean) =>
    active
      ? "text-accent"
      : "text-muted-foreground group-hover:text-foreground";

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] bg-card/95 border-t border-border backdrop-blur supports-[backdrop-filter]:backdrop-blur">
      <nav className="max-w-md mx-auto px-6">
        <div className="grid grid-cols-3 h-16 items-center">
          {/* Pacientes */}
          <button
            onClick={() => navigate("/doctor")}
            className="group flex flex-col items-center justify-center text-xs transition-smooth"
            aria-current={isPatientsSection ? "page" : undefined}
          >
            <div
              className={cn(
                "h-6 flex items-center justify-center",
                navIconClass(isPatientsSection),
              )}
            >
              <Users size={20} />
            </div>
            <span
              className={cn(
                "mt-1",
                navTextClass(isPatientsSection),
              )}
            >
              Pacientes
            </span>
          </button>

          {/* Chat */}
          <button
            onClick={() => navigate("/doctor/chat")}
            className="group flex flex-col items-center justify-center text-xs transition-smooth"
            aria-current={isChatSection ? "page" : undefined}
          >
            <div
              className={cn(
                "h-6 flex items-center justify-center",
                navIconClass(isChatSection),
              )}
            >
              <MessageCircle size={20} />
            </div>
            <span
              className={cn(
                "mt-1",
                navTextClass(isChatSection),
              )}
            >
              Chat
            </span>
          </button>

          {/* Perfil */}
          <button
            onClick={() => navigate("/doctor/profile")}
            className="group flex flex-col items-center justify-center text-xs transition-smooth"
            aria-current={isProfileSection ? "page" : undefined}
          >
            <div
              className={cn(
                "h-6 flex items-center justify-center",
                navIconClass(isProfileSection),
              )}
            >
              <UserIcon size={20} />
            </div>
            <span
              className={cn(
                "mt-1",
                navTextClass(isProfileSection),
              )}
            >
              Perfil
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default DoctorBottomNav;
