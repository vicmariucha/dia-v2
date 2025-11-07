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
    <div className="min-h-screen relative grid grid-rows-[auto_1fr]">
      <div className="fixed inset-0 -z-10 bg-gradient-to-r from-[#6A0DAD] via-[#384398] to-[#008080]" />

      <CurvedHeader
        withBackground={false}
        padding="sm"
        title="Verifique seu email"
        subtitle="Enviamos um link para redefinir sua senha."
      />

      <div className="relative -mt-2 sm:-mt-3 md:-mt-4 row-start-2">
        <div className="w-full h-full bg-card/95 border border-border rounded-t-[36px] shadow-lg">
          <div className="max-w-md mx-auto px-6 py-6">
            <InfoCard>
              <div className="space-y-4">
                <p className="text-foreground text-center leading-relaxed">
                  Link de recuperação enviado para{" "}
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
                className="text-sm text-muted-foreground hover:underline transition-smooth"
              >
                Voltar ao login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordSent;
