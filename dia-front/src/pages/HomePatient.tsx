// dia-front/src/pages/HomePatient.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Clock,
  Droplet,
  UtensilsCrossed,
  Dumbbell,
} from "lucide-react";
import { InfoCard } from "@/components/dia/InfoCard";
import { BottomNav } from "@/components/dia/BottomNav";
import {
  listGlucose,
  listInsulin,
  GlucoseMeasurement,
  InsulinDose,
  Meal,
  listMeals,
  listActivities,
  Activity as ActivityRecord,
} from "../lib/api";

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

  const scaleX = (i: number) =>
    axisW + padX + (i * W) / (values.length - 1);

  const points = values.map((v, i) => [scaleX(i), scaleY(v)] as const);

  const path = points
    .map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`))
    .join(" ");

  const areaPath =
    `M ${points[0][0]} ${padY + H} ` +
    points.map(([x, y]) => `L ${x} ${y}`).join(" ") +
    ` L ${points[points.length - 1][0]} ${padY + H} Z`;

  const ticks = [yMin, yMax];
  const fmt = (v: number) => Math.round(v).toString();

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Gráfico das últimas 24 horas"
      className="block"
    >
      <g
        className="text-muted-foreground/20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
      >
        {ticks.map((t, i) => {
          const y = scaleY(t);
          return (
            <line
              key={i}
              x1={axisW}
              x2={width - padX}
              y1={y}
              y2={y}
            />
          );
        })}
      </g>

      <g
        className="text-muted-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
      >
        <line
          x1={axisW}
          x2={axisW}
          y1={padY}
          y2={padY + H}
        />
      </g>

      <g className="text-muted-foreground" fontSize="10">
        {ticks.map((t, i) => {
          const y = scaleY(t);
          return (
            <text
              key={i}
              x={axisW - 4}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fill="currentColor"
            >
              {fmt(t)}
            </text>
          );
        })}
        <text
          x={axisW - 4}
          y={padY - 2}
          textAnchor="end"
          dominantBaseline="ideographic"
          fill="currentColor"
        >
          {units}
        </text>
      </g>

      <path d={areaPath} className="fill-accent/10" />
      <path
        d={path}
        className="stroke-accent"
        fill="none"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r={2.5}
        className="fill-accent"
      />
    </svg>
  );
}

type InsulinListItem = {
  units: number;
  type: string;
  time: string;
};

type GlucoseListItem = {
  value: string;
  context: string;
  date: string;
};

type FoodListItem = {
  carbs: number;
  mealType: string;
  time: string;
};

type ActivityListItem = {
  activityType: string;
  durationMinutes: number;
  time: string;
};

const HomePatient = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("glucose");
  const [glucoseData, setGlucoseData] = useState<GlucoseMeasurement[]>([]);
  const [insulinData, setInsulinData] = useState<InsulinListItem[]>([]);
  const [foodData, setFoodData] = useState<FoodListItem[]>([]);
  const [activityData, setActivityData] = useState<ActivityListItem[]>([]);
  const [sparkValues, setSparkValues] = useState<number[]>([]);
  const [avgGlucose, setAvgGlucose] = useState<number | null>(null);

  const tabs: { id: TabId; label: string }[] = [
    { id: "glucose", label: "Glicemia" },
    { id: "insulin", label: "Insulina" },
    { id: "food", label: "Alimentação" },
    { id: "activity", label: "Atividade" },
  ];

  // pega userId do localStorage
  const userId = useMemo(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed?.id ?? null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        // pega tudo em paralelo
        const [glucose, doses, meals, activities] = await Promise.all([
          listGlucose(userId),
          listInsulin(userId, 10),
          listMeals(userId, 10),
          listActivities(userId, 10),
        ]);

        // ---------- GLICEMIA ----------
        const sortedGlucose = [...glucose].sort(
          (a, b) =>
            new Date(b.measuredAt).getTime() -
            new Date(a.measuredAt).getTime(),
        );
        setGlucoseData(sortedGlucose);

        // série e média das últimas 24h
        const now = Date.now();
        const last24h = sortedGlucose.filter(
          (g) =>
            now - new Date(g.measuredAt).getTime() <=
            24 * 60 * 60 * 1000,
        );
        const values = last24h.map((g) => g.value);
        setSparkValues(values);
        if (values.length) {
          const avg =
            values.reduce((acc, v) => acc + v, 0) / values.length;
          setAvgGlucose(avg);
        } else {
          setAvgGlucose(null);
        }

        // ---------- INSULINA ----------
        const mappedInsulin: InsulinListItem[] = doses
          .sort(
            (a, b) =>
              new Date(b.appliedAt).getTime() -
              new Date(a.appliedAt).getTime(),
          )
          .slice(0, 5)
          .map((d: InsulinDose) => ({
            units: d.units,
            type: d.type === "BASAL" ? "Basal" : "Bolus",
            time: new Date(d.appliedAt).toLocaleString("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            }),
          }));

        setInsulinData(mappedInsulin);

        // ---------- ALIMENTAÇÃO ----------
        const mappedMeals: FoodListItem[] = (meals as Meal[])
          .sort(
            (a, b) =>
              new Date(b.eatenAt).getTime() -
              new Date(a.eatenAt).getTime(),
          )
          .slice(0, 5)
          .map((m) => ({
            carbs: m.carbs,
            mealType: m.mealType,
            time: new Date(m.eatenAt).toLocaleString("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            }),
          }));

        setFoodData(mappedMeals);

        // ---------- ATIVIDADE ----------
        const mappedActivities: ActivityListItem[] = (
          activities as ActivityRecord[]
        )
          .sort(
            (a, b) =>
              new Date(b.performedAt).getTime() -
              new Date(a.performedAt).getTime(),
          )
          .slice(0, 5)
          .map((a) => ({
            activityType: a.activityType,
            durationMinutes: a.durationMinutes,
            time: new Date(a.performedAt).toLocaleString("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            }),
          }));

        setActivityData(mappedActivities);
      } catch (error) {
        console.error("Erro ao carregar dados da Home:", error);
      }
    };

    fetchData();
  }, [userId]);

  const glucoseCards: GlucoseListItem[] = useMemo(
    () =>
      glucoseData.slice(0, 5).map((g) => ({
        value: `${g.value}mg/dl`,
        context: g.period,
        date: new Date(g.measuredAt).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }),
      })),
    [glucoseData],
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "glucose":
        return (
          <div className="space-y-3 pb-4">
            {glucoseCards.map((item, index) => (
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
                  <p className="text-xs text-muted-foreground">
                    {item.date}
                  </p>
                </div>
              </InfoCard>
            ))}

            {glucoseCards.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma medição de glicemia registrada ainda.
              </p>
            )}
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
                      <p className="text-base font-semibold text-foreground">
                        {item.units} U
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.type}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.time}
                  </p>
                </div>
              </InfoCard>
            ))}

            {insulinData.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma dose de insulina registrada ainda.
              </p>
            )}
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
                  <div>
                    <p className="text-lg font-semibold text-accent mb-1">
                      {item.carbs} g carboidratos
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.mealType}
                    </p>
                  </div>

                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {item.time}
                  </div>
                </div>
              </InfoCard>
            ))}

            {foodData.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma refeição registrada ainda.
              </p>
            )}
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
                      <p className="text-base font-semibold text-foreground">
                        {item.durationMinutes} min
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.activityType}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {item.time}
                  </p>
                </div>
              </InfoCard>
            ))}

            {activityData.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma atividade registrada ainda.
              </p>
            )}
          </div>
        );
    }
  };

  const avgLabel =
    avgGlucose !== null ? `${Math.round(avgGlucose)}mg/dl` : "--";

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
              <p className="text-sm text-muted-foreground mb-1">
                Média glicemia (últimas 24h)
              </p>
              <p className="text-4xl font-semibold text-accent mb-1">
                {avgLabel}
              </p>
              <div className="flex items-center gap-1 text-success">
                <TrendingUp size={16} />
                <span className="text-xs font-medium">
                  {avgGlucose !== null
                    ? "Dados reais do seu histórico"
                    : "Sem dados nas últimas 24h"}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              {sparkValues.length >= 2 ? (
                <>
                  <Sparkline24h
                    values={sparkValues}
                    width={170}
                    height={80}
                    units="mg/dL"
                  />
                  <span className="mt-1 text-[11px] text-muted-foreground">
                    Últimas 24 horas
                  </span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground mt-6">
                  Sem dados suficientes para o gráfico.
                </span>
              )}
            </div>
          </div>
        </InfoCard>

        <InfoCard className="bg-accent/5 border border-accent/20">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Clock className="text-accent" size={20} />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">
                Dica do dia
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Lembre-se de registrar suas medições e doses de
                insulina logo após realizar, para manter seu histórico
                sempre atualizado.
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
