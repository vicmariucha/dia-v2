// dia-front/src/pages/GlucoseForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InfoCard } from "@/components/dia/InfoCard";
import { PrimaryButton } from "@/components/dia/PrimaryButton";
import { AppTextField } from "@/components/dia/AppTextField";
import { BottomNav } from "@/components/dia/BottomNav";
import {
  ChevronDown,
  ArrowLeft,
  Droplet,
  Calendar,
  Clock,
} from "lucide-react";
import { createGlucose } from "@/lib/api";
import { useAuthUser } from "@/hooks/useAuthUser";

const GlucoseForm = () => {
  const navigate = useNavigate();
  const user = useAuthUser();

  const [formData, setFormData] = useState({
    value: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    period: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  if (!user) return null;

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
    <div className="min-h-screen bg-background pb-24">
      {/* Header no padrão das outras telas de registro */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-foreground hover:text-accent transition-smooth"
            aria-label="Voltar"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-foreground">
            Glicemia
          </h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6">
        <InfoCard>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Valor da glicemia (mg/dL){" "}
                <span className="text-destructive">*</span>
              </label>
              <AppTextField
                type="number"
                icon={<Droplet size={20} />}
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
                  Data <span className="text-destructive">*</span>
                </label>
                <AppTextField
                  type="date"
                  icon={<Calendar size={20} />}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Horário <span className="text-destructive">*</span>
                </label>
                <AppTextField
                  type="time"
                  icon={<Clock size={20} />}
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Período <span className="text-destructive">*</span>
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
                className="w-full bg-card border border-border rounded-3xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none min-h-[80px]"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Ex: Corrigi com 2U de insulina rápida."
              />
            </div>

            {apiError && (
              <p className="mt-2 text-sm text-destructive">{apiError}</p>
            )}

            <PrimaryButton
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-4"
            >
              {isSubmitting ? "Salvando..." : "Salvar glicemia"}
            </PrimaryButton>
          </div>
        </InfoCard>
      </div>

      <BottomNav />
    </div>
  );
};

export default GlucoseForm;
