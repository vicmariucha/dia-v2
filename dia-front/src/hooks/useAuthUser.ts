// dia-front/src/hooks/useAuthUser.ts
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthUser } from "@/lib/api";

/**
 * Lê o usuário logado do localStorage.
 * Se não tiver usuário e redirectToLogin = true, redireciona para /login.
 */
export function useAuthUser(redirectToLogin: boolean = true) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      if (redirectToLogin) {
        navigate("/login", { replace: true });
      }
      return;
    }

    try {
      const parsed = JSON.parse(stored) as AuthUser;

      if (!parsed || typeof parsed.id !== "number") {
        if (redirectToLogin) {
          navigate("/login", { replace: true });
        }
        return;
      }

      setUser(parsed);
    } catch {
      if (redirectToLogin) {
        navigate("/login", { replace: true });
      }
    }
  }, [navigate, redirectToLogin]);

  return user;
}
