import { Link, useLocation } from "react-router-dom";
import { CurvedHeader } from "@/components/dia/CurvedHeader";
import { PrimaryButton } from "@/components/dia/PrimaryButton";
import { InfoCard } from "@/components/dia/InfoCard";
import { toast } from "sonner";

const ForgotPasswordSent = () => {
  const location = useLocation();
  const email = location.state?.email || "seu email";

  const handleResend = () => {
    toast.success("Email de recuperação reenviado!");
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
            <p className="text-foreground text-center leading-relaxed">
              Link de recuperação enviado ao email{" "}
              <span className="font-medium text-accent">{email}</span>
            </p>

            <PrimaryButton onClick={handleResend}>
              Enviar novamente
            </PrimaryButton>
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

export default ForgotPasswordSent;
