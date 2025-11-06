import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { CurvedHeader } from "@/components/dia/CurvedHeader";
import { InfoCard } from "@/components/dia/InfoCard";

const SignupPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    diabetesType: "Tipo 1",
    treatment: "Insulina",
    glucoseChecks: "",
    bolusInsulin: "",
    basalInsulin: "",
  });

  const handleNext = () => {
    if (formData.glucoseChecks && formData.bolusInsulin && formData.basalInsulin) {
      navigate("/home-patient");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <CurvedHeader
        title="Bem-vindo(a)"
        subtitle="Comece hoje a ter uma melhor autogestão do diabetes."
      />

      <div className="max-w-md mx-auto px-6 -mt-8">
        <InfoCard className="relative">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo de diabetes
              </label>
              <select
                value={formData.diabetesType}
                onChange={(e) =>
                  setFormData({ ...formData, diabetesType: e.target.value })
                }
                className="w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              >
                <option value="Tipo 1">Tipo 1</option>
                <option value="Tipo 2">Tipo 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tratamento atual
              </label>
              <select
                value={formData.treatment}
                onChange={(e) =>
                  setFormData({ ...formData, treatment: e.target.value })
                }
                className="w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              >
                <option value="Insulina">Insulina</option>
                <option value="Medicação oral">Medicação oral</option>
                <option value="Dieta e exercício">Dieta e exercício</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quantas vezes você mede a glicemia por dia?
              </label>
              <select
                value={formData.glucoseChecks}
                onChange={(e) =>
                  setFormData({ ...formData, glucoseChecks: e.target.value })
                }
                className="w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              >
                <option value="">Selecione...</option>
                <option value="1-2">1-2 vezes</option>
                <option value="3-5">3-5 vezes</option>
                <option value="6+">6 ou mais vezes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quais insulinas você usa?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Bolus
                  </label>
                  <select
                    value={formData.bolusInsulin}
                    onChange={(e) =>
                      setFormData({ ...formData, bolusInsulin: e.target.value })
                    }
                    className="w-full bg-card border border-border rounded-3xl py-3 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                  >
                    <option value="">Selecione...</option>
                    <option value="Regular">Regular</option>
                    <option value="Lispro">Lispro</option>
                    <option value="Aspart">Aspart</option>
                    <option value="Glulisina">Glulisina</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Basal
                  </label>
                  <select
                    value={formData.basalInsulin}
                    onChange={(e) =>
                      setFormData({ ...formData, basalInsulin: e.target.value })
                    }
                    className="w-full bg-card border border-border rounded-3xl py-3 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                  >
                    <option value="">Selecione...</option>
                    <option value="NPH">NPH</option>
                    <option value="Glargina">Glargina</option>
                    <option value="Detemir">Detemir</option>
                    <option value="Degludec">Degludec</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!formData.glucoseChecks || !formData.bolusInsulin || !formData.basalInsulin}
            className="absolute -bottom-4 right-4 gradient-primary p-4 rounded-full shadow-elevated hover:shadow-soft transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </InfoCard>
      </div>
    </div>
  );
};

export default SignupPatient;
