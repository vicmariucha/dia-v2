import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { CurvedHeader } from "@/components/dia/CurvedHeader";
import { PrimaryButton } from "@/components/dia/PrimaryButton";
import { OutlineButton } from "@/components/dia/OutlineButton";
import { AppTextField } from "@/components/dia/AppTextField";
import { InfoCard } from "@/components/dia/InfoCard";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

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

  const handleLogin = () => {
    if (validateForm()) {
      // Mock login - navigate to patient home
      navigate("/home-patient");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CurvedHeader
        title="Bem-vindo(a)"
        subtitle="Comece hoje a ter uma melhor autogestão do diabetes."
      />

      <div className="max-w-md mx-auto px-6 -mt-8">
        <InfoCard>
          <div className="space-y-4">
            <AppTextField
              icon={<Mail size={20} />}
              type="email"
              placeholder="exemplo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <AppTextField
              icon={<Lock size={20} />}
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <div className="flex justify-end">
              <Link
                to="/forgot"
                className="text-sm text-accent hover:underline transition-smooth"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <PrimaryButton onClick={handleLogin}>Entrar</PrimaryButton>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
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
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              }
            >
              Continue com Google
            </OutlineButton>
          </div>
        </InfoCard>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link to="/signup" className="text-accent font-medium hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
