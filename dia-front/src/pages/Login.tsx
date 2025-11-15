// dia-v2/src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { CurvedHeader } from "@/components/dia/CurvedHeader";
import { PrimaryButton } from "@/components/dia/PrimaryButton";
import { OutlineButton } from "@/components/dia/OutlineButton";
import { AppTextField } from "@/components/dia/AppTextField";
import { login } from "@/lib/api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      newErrors.email = "Por favor, insira um email válido";
      valid = false;
    }
    if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setApiError(null);

      const res = await login({ email, password });

      // guarda token e usuário
      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("user", JSON.stringify(res.user));

      // redireciona conforme o papel (por enquanto tudo pra home-patient)
      if (res.user.role === "PATIENT") {
        navigate("/home-patient");
      } else {
        navigate("/home-patient");
      }
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Erro ao fazer login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative grid grid-rows-[auto_1fr]">
      <div className="fixed inset-0 -z-10 bg-gradient-to-r from-[#6A0DAD] via-[#384398] to-[#008080]" />

      <CurvedHeader
        withBackground={false}
        padding="sm"
        title="Bem-vindo de volta"
        subtitle="Acesse sua conta para continuar acompanhando sua saúde."
      />

      <div className="relative -mt-2 sm:-mt-3 md:-mt-4 row-start-2">
        <div className="w-full h-full bg-card/95 border border-border rounded-t-[36px] shadow-lg">
          <div className="max-w-md mx-auto px-6 py-6">
            <h2 className="text-xl font-semibold text-foreground mb-1">
              Fazer login
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Insira suas credenciais para acessar sua conta.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <AppTextField
                  icon={<Mail size={20} />}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  error={errors.email}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Senha
                </label>
                <AppTextField
                  icon={<Lock size={20} />}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  error={errors.password}
                />
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot"
                  className="text-sm text-muted-foreground hover:underline transition-smooth"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <PrimaryButton onClick={handleLogin} disabled={isSubmitting}>
                {isSubmitting ? "Entrando..." : "Entrar"}
              </PrimaryButton>

              {apiError && (
                <p className="text-sm text-red-500 mt-2">{apiError}</p>
              )}

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-4 text-muted-foreground">ou</span>
                </div>
              </div>

              <OutlineButton
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25..."
                    />
                    {/* path encurtado só pra ícone ilustrativo */}
                  </svg>
                }
              >
                Entrar com Google
              </OutlineButton>
            </div>

            <p className="text-center mt-6 text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                to="/signup"
                className="text-accent font-medium hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
