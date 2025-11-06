import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { CurvedHeader } from "@/components/dia/CurvedHeader";
import { PrimaryButton } from "@/components/dia/PrimaryButton";
import { AppTextField } from "@/components/dia/AppTextField";
import { InfoCard } from "@/components/dia/InfoCard";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleRecover = () => {
    if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      setError("Por favor, insira um email válido");
      return;
    }
    navigate("/forgot-sent", { state: { email } });
  };

  return (
    <div className="min-h-screen bg-background">
      <CurvedHeader
        title="Recuperar senha"
        subtitle="Digite seu email e enviaremos um link para redefinir sua senha."
      />

      <div className="max-w-md mx-auto px-6 -mt-8">
        <InfoCard>
          <div className="space-y-4">
            <AppTextField
              icon={<Mail size={20} />}
              type="email"
              placeholder="exemplo@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              error={error}
            />

            <PrimaryButton onClick={handleRecover}>Recuperar</PrimaryButton>
          </div>
        </InfoCard>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm text-accent hover:underline transition-smooth"
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
