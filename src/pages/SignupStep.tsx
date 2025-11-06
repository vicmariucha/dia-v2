import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronRight } from "lucide-react";
import { CurvedHeader } from "@/components/dia/CurvedHeader";
import { InfoCard } from "@/components/dia/InfoCard";
import { AppTextField } from "@/components/dia/AppTextField";

const SignupStep = () => {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState("");
  const [userType, setUserType] = useState("");

  const handleNext = () => {
    if (birthDate && userType) {
      if (userType === "patient") {
        navigate("/signup-patient");
      } else {
        navigate("/signup-doctor");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CurvedHeader
        title="Bem-vindo(a)"
        subtitle="Comece hoje a ter uma melhor autogestão do diabetes."
      />

      <div className="max-w-md mx-auto px-6 -mt-8">
        <InfoCard className="relative">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Data de nascimento
              </label>
              <AppTextField
                icon={<Calendar size={20} />}
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Eu sou
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              >
                <option value="">Selecione...</option>
                <option value="patient">Paciente</option>
                <option value="doctor">Médico</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!birthDate || !userType}
            className="absolute -bottom-4 right-4 gradient-primary p-4 rounded-full shadow-elevated hover:shadow-soft transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </InfoCard>
      </div>
    </div>
  );
};

export default SignupStep;
