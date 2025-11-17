import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Utensils, Calendar, Clock } from "lucide-react";
import { PrimaryButton } from "@/components/dia/PrimaryButton";
import { AppTextField } from "@/components/dia/AppTextField";
import { InfoCard } from "@/components/dia/InfoCard";
import { BottomNav } from "@/components/dia/BottomNav";
import { toast } from "sonner";
import { createMeal } from "@/lib/api";
import { useAuthUser } from "@/hooks/useAuthUser";


const MealForm = () => {
  const navigate = useNavigate();
  const user = useAuthUser(); // pega o usuário logado (id, email etc.)

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    mealType: "",
    carbs: "",
    protein: "",
    fat: "",
    sugar: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
  });

  const mealTypes = [
    "Café da manhã",
    "Lanche da manhã",
    "Almoço",
    "Lanche da tarde",
    "Jantar",
    "Ceia",
  ];

  const isValid =
    !!user &&
    !!formData.mealType &&
    !!formData.carbs &&
    !!formData.date &&
    !!formData.time;

  const handleSave = async () => {
    if (!user) return;
    if (!isValid || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const eatenAtLocal = `${formData.date}T${formData.time}:00`;
      const eatenAt = new Date(eatenAtLocal).toISOString();

      await createMeal({
        userId: user.id,
        mealType: formData.mealType,
        carbs: Number(formData.carbs),
        protein: formData.protein
          ? Number(formData.protein)
          : undefined,
        fat: formData.fat ? Number(formData.fat) : undefined,
        sugar: formData.sugar ? Number(formData.sugar) : undefined,
        eatenAt,
        notes: formData.notes || undefined,
      });

      toast.success("Alimentação salva com sucesso!");
      navigate("/home-patient");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar alimentação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-xl font-semibold text-foreground">Alimentação</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6">
        <InfoCard>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo de refeição <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.mealType}
                onChange={(e) =>
                  setFormData({ ...formData, mealType: e.target.value })
                }
                className="w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              >
                <option value="">Selecione...</option>
                {mealTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Macronutrientes
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Carboidratos (g) <span className="text-destructive">*</span>
                  </label>
                  <AppTextField
                    type="number"
                    placeholder="0"
                    value={formData.carbs}
                    onChange={(e) =>
                      setFormData({ ...formData, carbs: e.target.value })
                    }
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Proteínas (g)
                  </label>
                  <AppTextField
                    type="number"
                    placeholder="0"
                    value={formData.protein}
                    onChange={(e) =>
                      setFormData({ ...formData, protein: e.target.value })
                    }
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Gordura (g)
                  </label>
                  <AppTextField
                    type="number"
                    placeholder="0"
                    value={formData.fat}
                    onChange={(e) =>
                      setFormData({ ...formData, fat: e.target.value })
                    }
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Açúcar (g)
                  </label>
                  <AppTextField
                    type="number"
                    placeholder="0"
                    value={formData.sugar}
                    onChange={(e) =>
                      setFormData({ ...formData, sugar: e.target.value })
                    }
                    className="text-sm"
                  />
                </div>
              </div>
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
                placeholder="Ex.: Arroz, feijão, frango grelhado e salada"
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
  disabled={!isValid || isSubmitting}
  className="mt-6"
>
  {isSubmitting ? "Salvando..." : "Salvar alimentação"}
</PrimaryButton>

          </div>
        </InfoCard>
      </div>

      <BottomNav />
    </div>
  );
};

export default MealForm;
