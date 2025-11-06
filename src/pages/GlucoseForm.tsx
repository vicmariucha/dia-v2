import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Droplet, Calendar, Clock } from "lucide-react";
import { PrimaryButton } from "@/components/dia/PrimaryButton";
import { AppTextField } from "@/components/dia/AppTextField";
import { InfoCard } from "@/components/dia/InfoCard";
import { BottomNav } from "@/components/dia/BottomNav";

const GlucoseForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    glucose: "",
    type: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
  });

  const glucoseTypes = [
    "Em jejum",
    "Antes do café",
    "Depois do café",
    "Antes do almoço",
    "Depois do almoço",
    "Antes do jantar",
    "Depois do jantar",
    "Antes de dormir",
  ];

  const isValid = formData.glucose && formData.type;

  const handleSave = () => {
    if (isValid) {
      navigate("/glucose-saved");
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
          <h1 className="text-xl font-semibold text-foreground">Glicemia</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6">
        <InfoCard>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Glicemia <span className="text-destructive">*</span>
              </label>
              <AppTextField
                icon={<Droplet size={20} />}
                type="number"
                placeholder="Ex: 120"
                value={formData.glucose}
                onChange={(e) =>
                  setFormData({ ...formData, glucose: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">Em mg/dl</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              >
                <option value="">Selecione...</option>
                {glucoseTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
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
                placeholder="Ex.: Não jantei na noite passada"
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
              Salvar glicemia
            </PrimaryButton>
          </div>
        </InfoCard>
      </div>

      <BottomNav />
    </div>
  );
};

export default GlucoseForm;
