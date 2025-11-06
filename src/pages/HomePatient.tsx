import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Activity, Clock } from "lucide-react";
import { InfoCard } from "@/components/dia/InfoCard";
import { BottomNav } from "@/components/dia/BottomNav";

const HomePatient = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("glucose");

  const tabs = [
    { id: "glucose", label: "Glicemia" },
    { id: "insulin", label: "Insulina" },
    { id: "food", label: "Alimentação" },
    { id: "activity", label: "Atividade" },
  ];

  const glucoseData = [
    { value: "120mg/dl", context: "Em jejum", date: "Hoje, 07:30" },
    { value: "145mg/dl", context: "Antes do jantar", date: "Ontem, 19:00" },
    { value: "110mg/dl", context: "Antes de dormir", date: "Ontem, 22:30" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary pt-12 pb-8 px-6 rounded-b-[48px]">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-semibold text-white mb-1">
            Olá, Paciente!
          </h1>
          <p className="text-white/80 text-sm">
            Acompanhe sua saúde diariamente
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4 space-y-4">
        {/* Main Metric Card */}
        <InfoCard className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Média glicemia
              </p>
              <p className="text-4xl font-semibold text-accent mb-1">
                120<span className="text-2xl">mg/dl</span>
              </p>
              <div className="flex items-center gap-1 text-success">
                <TrendingUp size={16} />
                <span className="text-xs font-medium">Dentro da meta</span>
              </div>
            </div>
            <div className="w-24 h-16 bg-gradient-to-br from-primary-teal/20 to-primary-purple/20 rounded-2xl flex items-center justify-center">
              <Activity className="text-accent" size={32} />
            </div>
          </div>
        </InfoCard>

        {/* Alert Card */}
        <InfoCard className="bg-accent/5 border border-accent/20">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Clock className="text-accent" size={20} />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Dica do dia</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Consuma mais carboidratos no almoço para manter a energia durante
                o dia.
              </p>
            </div>
          </div>
        </InfoCard>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-6 py-2 rounded-full font-medium text-sm transition-smooth ${
                activeTab === tab.id
                  ? "bg-accent text-white shadow-soft"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Data List */}
        <div className="space-y-3 pb-4">
          {glucoseData.map((item, index) => (
            <InfoCard
              key={index}
              onClick={() => navigate("/glucose-form")}
              className="cursor-pointer hover:border-accent/30 border border-transparent"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-accent mb-1">
                    {item.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.context}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </InfoCard>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePatient;
