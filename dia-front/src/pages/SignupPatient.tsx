// dia-v2/src/pages/SignupPatient.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronDown, ChevronLeft } from "lucide-react";
import { CurvedHeader } from "@/components/dia/CurvedHeader";
import { InfoCard } from "@/components/dia/InfoCard";
import { signupPatient } from "@/lib/api";

const SignupPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    diabetesType: "Tipo 1",
    treatment: "Insulina",
    glucoseChecks: "",
    bolusInsulin: "",
    basalInsulin: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = async () => {
    const { glucoseChecks, bolusInsulin, basalInsulin } = formData;
    if (!glucoseChecks || !bolusInsulin || !basalInsulin) {
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError(null);

      const basicRaw = sessionStorage.getItem("signupBasic");
      const stepRaw = sessionStorage.getItem("signupStep");

      if (!basicRaw || !stepRaw) {
        throw new Error(
          "Informações do cadastro não encontradas. Por favor, recomece o cadastro.",
        );
      }

      const basic = JSON.parse(basicRaw);
      const step = JSON.parse(stepRaw);

      const res = await signupPatient({
        fullName: basic.fullName,
        email: basic.email,
        password: basic.password,
        dateOfBirth: step.dateOfBirth,
        diabetesType: formData.diabetesType,
        treatment: formData.treatment,
        glucoseChecks: formData.glucoseChecks,
        bolusInsulin: formData.bolusInsulin,
        basalInsulin: formData.basalInsulin,
      });

      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("user", JSON.stringify(res.user));

      sessionStorage.removeItem("signupBasic");
      sessionStorage.removeItem("signupStep");

      navigate("/home-patient");
    } catch (error: any) {
      console.error(error);
      setApiError(error.message || "Erro ao concluir cadastro");
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
        title="Personalize sua experiência"
        subtitle="Conte mais sobre o seu tratamento para ajustarmos as recomendações."
      />

      <div className="relative -mt-2 sm:-mt-3 md:-mt-4 row-start-2">
        <div className="w-full h-full bg-card/95 border border-border rounded-t-[36px] shadow-lg">
          <div className="max-w-md mx-auto px-6 py-6">
            <InfoCard>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tipo de diabetes
                  </label>
                  <div className="relative">
                    <select
                      value={formData.diabetesType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          diabetesType: e.target.value,
                        })
                      }
                      className="w-full bg-card border border-border rounded-3xl py-3.5 pl-4 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth appearance-none"
                    >
                      <option value="Tipo 1">Tipo 1</option>
                      <option value="Tipo 2">Tipo 2</option>
                    </select>
                    <ChevronDown
                      size={20}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tratamento atual
                  </label>
                  <div className="relative">
                    <select
                      value={formData.treatment}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          treatment: e.target.value,
                        })
                      }
                      className="w-full bg-card border border-border rounded-3xl py-3.5 pl-4 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth appearance-none"
                    >
                      <option value="Insulina">Insulina</option>
                      <option value="Medicamento oral">
                        Medicamento oral
                      </option>
                      <option value="Insulina + medicamento oral">
                        Insulina + medicamento oral
                      </option>
                    </select>
                    <ChevronDown
                      size={20}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Quantas vezes por dia você mede a glicemia?
                  </label>
                  <div className="relative">
                    <select
                      value={formData.glucoseChecks}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          glucoseChecks: e.target.value,
                        })
                      }
                      className="w-full bg-card border border-border rounded-3xl py-3.5 pl-4 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth appearance-none"
                    >
                      <option value="">Selecione...</option>
                      <option value="1-2">1-2 vezes</option>
                      <option value="3-5">3-5 vezes</option>
                      <option value="6+">6 ou mais vezes</option>
                    </select>
                    <ChevronDown
                      size={20}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                  </div>
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
                      <div className="relative">
                        <select
                          value={formData.bolusInsulin}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bolusInsulin: e.target.value,
                            })
                          }
                          className="w-full bg-card border border-border rounded-3xl py-3 pl-3 pr-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth appearance-none"
                        >
                          <option value="">Selecione...</option>
                          <option value="Regular">Regular</option>
                          <option value="Lispro">Lispro</option>
                          <option value="Aspart">Aspart</option>
                          <option value="Glulisina">Glulisina</option>
                        </select>
                        <ChevronDown
                          size={18}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Basal
                      </label>
                      <div className="relative">
                        <select
                          value={formData.basalInsulin}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              basalInsulin: e.target.value,
                            })
                          }
                          className="w-full bg-card border border-border rounded-3xl py-3 pl-3 pr-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth appearance-none"
                        >
                          <option value="">Selecione...</option>
                          <option value="NPH">NPH</option>
                          <option value="Glargina">Glargina</option>
                          <option value="Detemir">Detemir</option>
                          <option value="Degludec">Degludec</option>
                        </select>
                        <ChevronDown
                          size={18}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBack}
                aria-label="Voltar"
                className="absolute bottom-4 left-6 w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-elevated hover:shadow-soft transition-smooth"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={handleNext}
                disabled={
                  isSubmitting ||
                  !formData.glucoseChecks ||
                  !formData.bolusInsulin ||
                  !formData.basalInsulin
                }
                aria-label="Avançar"
                className="absolute bottom-4 right-6 w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-elevated hover:shadow-soft transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>

              {apiError && (
                <p className="mt-4 text-sm text-red-500">{apiError}</p>
              )}
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPatient;
