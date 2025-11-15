import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";
import { CurvedHeader } from "@/components/dia/CurvedHeader";
import { InfoCard } from "@/components/dia/InfoCard";
import { AppTextField } from "@/components/dia/AppTextField";

const SignupDoctor = () => {
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState("");
  const [crm, setCrm] = useState("");

  const handleNext = () => {
    if (specialty && crm) {
      navigate("/home-patient"); // TODO: trocar para home do médico depois
    }
  };

  return (
    <div className="min-h-screen relative grid grid-rows-[auto_1fr]">
      <div className="fixed inset-0 -z-10 bg-gradient-to-r from-[#6A0DAD] via-[#384398] to-[#008080]" />

      <CurvedHeader
        withBackground={false}
        padding="sm"
        title="Bem-vindo(a)"
        subtitle="Comece hoje a ter uma melhor gestão dos pacientes."
      />

      <div className="relative -mt-2 sm:-mt-3 md:-mt-4 row-start-2">
        <div className="w-full h-full bg-card/95 border border-border rounded-t-[36px] shadow-lg">
          <div className="max-w-md mx-auto px-6 py-6">
            <InfoCard className="relative overflow-hidden pb-16">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Especialidade
                  </label>

                  <div className="relative">
                    <select
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="
                        w-full bg-card border border-border rounded-3xl
                        py-3.5 pl-4 pr-10 text-foreground
                        focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                        transition-smooth appearance-none
                      "
                    >
                      <option value="">Selecione...</option>
                      <option value="Endocrinologista">Endocrinologista</option>
                      <option value="Clínico Geral">Clínico Geral</option>
                      <option value="Diabetologista">Diabetologista</option>
                    </select>
                    <ChevronDown
                      size={20}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                  </div>
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
                aria-label="Avançar"
                className="absolute bottom-4 right-6 w-10 h-10 gradient-primary rounded-full grid place-items-center shadow-elevated hover:shadow-soft transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupDoctor;
