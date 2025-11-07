import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Activity, Clock, Droplet, UtensilsCrossed, Dumbbell } from "lucide-react";
import { InfoCard } from "@/components/dia/InfoCard";
import { BottomNav } from "@/components/dia/BottomNav";

type TabId = "glucose" | "insulin" | "food" | "activity";

function Sparkline24h({
  values,
  width = 170,
  height = 80,
  strokeWidth = 2,
  units = "mg/dL",
  fixedRange, 
}: {
  values: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  units?: string;
  fixedRange?: { min: number; max: number };
}) {
  if (!values || values.length < 2) return null;

  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);

  const yMin = fixedRange ? fixedRange.min : dataMin;
  const yMax = fixedRange ? fixedRange.max : dataMax;

  const axisW = 28;       
  const padX = 4;
  const padY = 6;
  const W = width - axisW - padX * 2;
  const H = height - padY * 2;

  const scaleY = (v: number) =>
    padY + H - ((v - yMin) / (yMax - yMin || 1)) * H;

  const scaleX = (i: number) => axisW + padX + (i * W) / (values.length - 1);

  const points = values.map((v, i) => [scaleX(i), scaleY(v)] as const);

  const path = points.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(" ");

  const areaPath =
    `M ${points[0][0]} ${padY + H} ` +
    points.map(([x, y]) => `L ${x} ${y}`).join(" ") +
    ` L ${points[points.length - 1][0]} ${padY + H} Z`;

  const ticks = [yMin, yMax];
  const fmt = (v: number) => Math.round(v).toString();

  return (
    <svg width={width} height={height} role="img" aria-label="Gráfico das últimas 24 horas" className="block">
      <g className="text-muted-foreground/20" fill="none" stroke="currentColor" strokeWidth={1}>
        {ticks.map((t, i) => {
          const y = scaleY(t);
          return <line key={i} x1={axisW} x2={width - padX} y1={y} y2={y} />;
        })}
      </g>

      <g className="text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1}>
        <line x1={axisW} x2={axisW} y1={padY} y2={padY + H} />
      </g>

      <g className="text-muted-foreground" fontSize="10">
        {ticks.map((t, i) => {
          const y = scaleY(t);
          return (
            <text key={i} x={axisW - 4} y={y} textAnchor="end" dominantBaseline="middle" fill="currentColor">
              {fmt(t)}
            </text>
          );
        })}
        <text x={axisW - 4} y={padY - 2} textAnchor="end" dominantBaseline="ideographic" fill="currentColor">
          {units}
        </text>
      </g>

      <path d={areaPath} className="fill-accent/10" />
      <path d={path} className="stroke-accent" fill="none" strokeWidth={strokeWidth} />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r={2.5} className="fill-accent" />
    </svg>
  );
}

const HomePatient = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("glucose");

  const tabs: { id: TabId; label: string }[] = [
    { id: "glucose", label: "Glicemia" },
    { id: "insulin", label: "Insulina" },
    { id: "food", label: "Alimentação" },
    { id: "activity", label: "Atividade" },
  ];

  // ---- MOCK
  const glucoseData = [
    { value: "120mg/dl", context: "Em jejum", date: "Hoje, 07:30" },
    { value: "110mg/dl", context: "Antes de dormir", date: "Ontem, 22:30" },
    { value: "182mg/dl", context: "Depois do jantar", date: "Ontem, 22:30" },
    { value: "145mg/dl", context: "Antes do jantar", date: "Ontem, 19:00" },
  ];

  const insulinData = [
    { units: 8,  type: "Bolus", time: "Hoje, 12:15" },
    { units: 18, type: "Basal", time: "Hoje, 07:00" },
    { units: 6,  type: "Bolus", time: "Ontem, 19:05" },
    { units: 10, type: "Bolus", time: "Ontem, 13:00" },
    { units: 18, type: "Basal", time: "Anteontem, 07:02" },
  ];

  const foodData = [
    { carbs: 55, mealType: "Almoço",           time: "Hoje, 12:30" },
    { carbs: 32, mealType: "Café da manhã",    time: "Hoje, 08:00" },
    { carbs: 47, mealType: "Jantar",           time: "Ontem, 19:40" },
    { carbs: 18, mealType: "Lanche da tarde",  time: "Ontem, 16:15" },
    { carbs: 24, mealType: "Ceia",             time: "Ontem, 22:10" },
  ];

  const activityData = [
    { duration: "45 min", title: "Corrida",   time: "Hoje, 06:30" },
    { duration: "30 min", title: "Academia",  time: "Ontem, 18:10" },
    { duration: "60 min", title: "Ciclismo",  time: "Ontem, 07:00" },
    { duration: "25 min", title: "Caminhada", time: "Ontem, 12:20" },
    { duration: "40 min", title: "Natação",   time: "Seg, 07:15" },
  ];

  const last24hGlucoseSeries = [
    152, 138, 130, 118, 110, 105, 112, 125, 140, 158, 172, 165,
    150, 142, 135, 128, 120, 115, 122, 136, 148, 160, 155, 145,
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "glucose":
        return (
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
        );

      case "insulin":
        return (
          <div className="space-y-3 pb-4">
            {insulinData.map((item, index) => (
              <InfoCard
                key={index}
                onClick={() => navigate("/insulin-form")}
                className="cursor-pointer hover:border-accent/30 border border-transparent"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                      <Droplet className="text-accent" size={18} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{item.units} U</p>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </InfoCard>
            ))}
          </div>
        );

      case "food":
        return (
          <div className="space-y-3 pb-4">
            {foodData.map((item, index) => (
              <InfoCard
                key={index}
                onClick={() => navigate("/meal-form")}
                className="cursor-pointer hover:border-accent/30 border border-transparent"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                      <UtensilsCrossed className="text-accent" size={18} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{item.carbs} g carboidratos</p>
                      <p className="text-sm text-muted-foreground">{item.mealType}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </InfoCard>
            ))}
          </div>
        );

      case "activity":
        return (
          <div className="space-y-3 pb-4">
            {activityData.map((item, index) => (
              <InfoCard
                key={index}
                onClick={() => navigate("/activity-form")}
                className="cursor-pointer hover:border-accent/30 border border-transparent"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                      <Dumbbell className="text-accent" size={18} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{item.duration}</p>
                      <p className="text-sm text-muted-foreground">{item.title}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </InfoCard>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-semibold text-white mb-1 font-poppins">
            Olá, Paciente!
          </h1>
          <p className="text-white/80 text-sm font-poppins">
            Acompanhe sua saúde diariamente
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4 space-y-4">
        <InfoCard className="relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Média glicemia</p>
              <p className="text-4xl font-semibold text-accent mb-1">
                120<span className="text-2xl">mg/dl</span>
              </p>
              <div className="flex items-center gap-1 text-success">
                <TrendingUp size={16} />
                <span className="text-xs font-medium">Dentro da meta</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <Sparkline24h
                values={last24hGlucoseSeries}
                width={170}
                height={80}
                units="mg/dL"
              />
              <span className="mt-1 text-[11px] text-muted-foreground">Últimas 24 horas</span>
            </div>
          </div>
        </InfoCard>

        <InfoCard className="bg-accent/5 border border-accent/20">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Clock className="text-accent" size={20} />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Dica do dia</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Consuma mais carboidratos no almoço para manter a energia durante o dia.
              </p>
            </div>
          </div>
        </InfoCard>

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

        {renderTabContent()}
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePatient;
