import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { CurvedHeader } from "@/components/dia/CurvedHeader";
import { InfoCard } from "@/components/dia/InfoCard";
import { AppTextField } from "@/components/dia/AppTextField";

const SignupDoctor = () => {
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState("");
  const [crm, setCrm] = useState("");

  const handleNext = () => {
    if (specialty && crm) {
      navigate("/home-patient"); // Will be changed to doctor home later
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CurvedHeader
        title="Bem-vindo(a)"
        subtitle="Comece hoje a ter uma melhor gestão dos pacientes."
      />

      <div className="max-w-md mx-auto px-6 -mt-8">
        <InfoCard className="relative">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Especialidade
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              >
                <option value="">Selecione...</option>
                <option value="Endocrinologista">Endocrinologista</option>
                <option value="Clínico Geral">Clínico Geral</option>
                <option value="Diabetologista">Diabetologista</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                CRM
              </label>
              <AppTextField
                type="text"
                placeholder="123456"
                value={crm}
                onChange={(e) => setCrm(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!specialty || !crm}
            className="absolute -bottom-4 right-4 gradient-primary p-4 rounded-full shadow-elevated hover:shadow-soft transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </InfoCard>
      </div>
    </div>
  );
};

export default SignupDoctor;
