import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Dumbbell, Calendar, Clock } from "lucide-react";
import { PrimaryButton } from "@/components/dia/PrimaryButton";
import { AppTextField } from "@/components/dia/AppTextField";
import { InfoCard } from "@/components/dia/InfoCard";
import { BottomNav } from "@/components/dia/BottomNav";
import { toast } from "sonner";

const ActivityForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    activityType: "",
    duration: "",
    intensity: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
  });

  const activityTypes = [
    "Caminhada",
    "Corrida",
    "Ciclismo",
    "Natação",
    "Academia",
    "Futebol",
    "Yoga",
    "Dança",
    "Outro",
  ];

  const intensityLevels = ["Baixa", "Moderada", "Alta"];

  const isValid = formData.activityType && formData.duration && formData.intensity;

  const handleSave = () => {
    if (isValid) {
      toast.success("Atividade salva com sucesso!");
      setTimeout(() => navigate("/home-patient"), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-foreground hover:text-accent transition-smooth"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-foreground">
            Atividade física
          </h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6">
        <InfoCard>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo de atividade <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.activityType}
                onChange={(e) =>
                  setFormData({ ...formData, activityType: e.target.value })
                }
                className="w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              >
                <option value="">Selecione...</option>
                {activityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Duração (min) <span className="text-destructive">*</span>
              </label>
              <AppTextField
                icon={<Dumbbell size={20} />}
                type="number"
                placeholder="Ex: 30"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Intensidade <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.intensity}
                onChange={(e) =>
                  setFormData({ ...formData, intensity: e.target.value })
                }
                className="w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              >
                <option value="">Selecione...</option>
                {intensityLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notas
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Ex.: Caminhada no parque pela manhã"
                rows={3}
                className="w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Data
                </label>
                <AppTextField
                  icon={<Calendar size={20} />}
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hora
                </label>
                <AppTextField
                  icon={<Clock size={20} />}
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>

            <PrimaryButton
              onClick={handleSave}
              disabled={!isValid}
              className="mt-6"
            >
              Salvar atividade
            </PrimaryButton>
          </div>
        </InfoCard>
      </div>

      <BottomNav />
    </div>
  );
};

export default ActivityForm;
