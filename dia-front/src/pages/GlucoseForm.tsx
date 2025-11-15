// dia-front/src/pages/GlucoseForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CurvedHeader } from "@/components/dia/CurvedHeader";
import { InfoCard } from "@/components/dia/InfoCard";
import { PrimaryButton } from "@/components/dia/PrimaryButton";
import { AppTextField } from "@/components/dia/AppTextField";
import { ChevronDown } from "lucide-react";
import { createGlucose } from "@/lib/api";
import { useAuthUser } from "@/hooks/useAuthUser";

const GlucoseForm = () => {
  const navigate = useNavigate();
  const user = useAuthUser(); // se não tiver user, redireciona pro /login

  const [formData, setFormData] = useState({
    value: "",
    date: "",
    time: "",
    period: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // enquanto está redirecionando / ainda não carregou user, não renderiza nada
  if (!user) {
    return null;
  }

  const handleSubmit = async () => {
    const errors: string[] = [];

    if (!formData.value || isNaN(Number(formData.value))) {
      errors.push("Informe um valor numérico para a glicemia.");
    }
    if (!formData.date) {
      errors.push("Informe a data da medição.");
    }
    if (!formData.time) {
      errors.push("Informe o horário da medição.");
    }
    if (!formData.period) {
      errors.push("Informe o período (antes/depois da refeição).");
    }

    if (errors.length > 0) {
      setApiError(errors.join(" "));
      return;
    }

    const measuredAtLocal = `${formData.date}T${formData.time}:00`;
    const measuredAt = new Date(measuredAtLocal).toISOString();

    try {
      setIsSubmitting(true);
      setApiError(null);

      await createGlucose(user.id, {
        value: Number(formData.value),
        measuredAt,
        period: formData.period,
        notes: formData.notes || undefined,
      });

      navigate("/glucose-saved");
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Erro ao salvar glicemia");
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
        title="Registrar glicemia"
        subtitle="Adicione uma nova medição para acompanhar sua evolução."
      />

      <div className="relative -mt-2 sm:-mt-3 md:-mt-4 row-start-2">
        <div className="w-full h-full bg-card/95 border border-border rounded-t-[36px] shadow-lg">
          <div className="max-w-md mx-auto px-6 py-6">
            <InfoCard>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Valor da glicemia (mg/dL)
                  </label>
                  <AppTextField
                    type="number"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    placeholder="Ex: 110"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Data
                    </label>
                    <AppTextField
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Horário
                    </label>
                    <AppTextField
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Período
                  </label>
                  <div className="relative">
                    <select
                      value={formData.period}
                      onChange={(e) =>
                        setFormData({ ...formData, period: e.target.value })
                      }
                      className="w-full bg-card border border-border rounded-3xl py-3.5 pl-4 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth appearance-none"
                    >
                      <option value="">Selecione...</option>
                      <option value="Antes do café">Antes do café</option>
                      <option value="Depois do café">Depois do café</option>
                      <option value="Antes do almoço">Antes do almoço</option>
                      <option value="Depois do almoço">Depois do almoço</option>
                      <option value="Antes do jantar">Antes do jantar</option>
                      <option value="Depois do jantar">Depois do jantar</option>
                      <option value="Madrugada">Madrugada</option>
                    </select>
                    <ChevronDown
                      size={20}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Observações (opcional)
                  </label>
                  <textarea
                    className="w-full bg-card border border-border rounded-3xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none min-h-[80px]"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Ex: Corrigi com 2U de insulina rápida."
                  />
                </div>
              </div>

              {apiError && (
                <p className="mt-4 text-sm text-red-500">{apiError}</p>
              )}

              <div className="mt-4">
                <PrimaryButton onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar medição"}
                </PrimaryButton>
              </div>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlucoseForm;
