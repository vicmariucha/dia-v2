import { useEffect, useMemo, useRef, useState } from "react";
import { InfoCard } from "@/components/dia/InfoCard";
import { BottomNav } from "@/components/dia/BottomNav";
import {
  Activity,
  Droplet,
  UtensilsCrossed,
  Dumbbell,
  CalendarRange,
  Filter,
  Check,
  X,
  Download,
} from "lucide-react";

type TabId = "glucose" | "insulin" | "food" | "activity";
type PeriodKey = "7" | "30" | "90" | "custom";

type GlucoseItem = { id: string; value: number; unit: "mg/dL"; context: string; at: number };
type InsulinItem = { id: string; units: number; type: "Bolus" | "Basal"; at: number };
type FoodItem = { id: string; carbs: number; mealType: string; at: number };
type ActivityItem = { id: string; durationMin: number; title: string; at: number };

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

/** ---------- MOCK DATA (trocar por API) ---------- */
const GLUCOSE: GlucoseItem[] = [
  { id: "g1", value: 120, unit: "mg/dL", context: "Em jejum",          at: now - 1 * day +  2 * 60 * 60 * 1000 },
  { id: "g2", value: 145, unit: "mg/dL", context: "Antes do jantar",   at: now - 2 * day + 19 * 60 * 60 * 1000 },
  { id: "g3", value: 110, unit: "mg/dL", context: "Antes de dormir",   at: now - 2 * day + 22 * 60 * 60 * 1000 },
  { id: "g4", value: 182, unit: "mg/dL", context: "Depois do jantar",  at: now - 3 * day + 21 * 60 * 60 * 1000 },
  { id: "g5", value: 98,  unit: "mg/dL", context: "Em jejum",          at: now - 5 * day +  7 * 60 * 60 * 1000 },
];

const INSULIN: InsulinItem[] = [
  { id: "i1", units: 8,  type: "Bolus", at: now - 0.5 * day },
  { id: "i2", units: 18, type: "Basal", at: now - 1   * day + 7  * 60 * 60 * 1000 },
  { id: "i3", units: 6,  type: "Bolus", at: now - 2   * day + 19 * 60 * 60 * 1000 },
  { id: "i4", units: 10, type: "Bolus", at: now - 3   * day + 13 * 60 * 60 * 1000 },
  { id: "i5", units: 18, type: "Basal", at: now - 4   * day + 7  * 60 * 60 * 1000 },
];

const FOOD: FoodItem[] = [
  { id: "f1", carbs: 55, mealType: "Almoço",          at: now - 0.5 * day },
  { id: "f2", carbs: 32, mealType: "Café da manhã",   at: now - 1   * day + 8  * 60 * 60 * 1000 },
  { id: "f3", carbs: 47, mealType: "Jantar",          at: now - 2   * day + 19 * 60 * 60 * 1000 },
  { id: "f4", carbs: 18, mealType: "Lanche da tarde", at: now - 2   * day + 16 * 60 * 60 * 1000 },
  { id: "f5", carbs: 24, mealType: "Ceia",            at: now - 2   * day + 22 * 60 * 60 * 1000 },
];

const ACTIVITY: ActivityItem[] = [
  { id: "a1", durationMin: 45, title: "Corrida",   at: now - 1 * day + 6.5  * 60 * 60 * 1000 },
  { id: "a2", durationMin: 30, title: "Academia",  at: now - 2 * day + 18   * 60 * 60 * 1000 },
  { id: "a3", durationMin: 60, title: "Ciclismo",  at: now - 2 * day + 7    * 60 * 60 * 1000 },
  { id: "a4", durationMin: 25, title: "Caminhada", at: now - 2 * day + 12   * 60 * 60 * 1000 },
  { id: "a5", durationMin: 40, title: "Natação",   at: now - 3 * day + 7.25 * 60 * 60 * 1000 },
];
/** ------------------------------------------------ */

const ICONS: Record<TabId, (props: any) => JSX.Element> = {
  glucose: (p) => <Activity {...p} />,
  insulin: (p) => <Droplet {...p} />,
  food:    (p) => <UtensilsCrossed {...p} />,
  activity:(p) => <Dumbbell {...p} />,
};

const LABELS: Record<TabId, string> = {
  glucose: "Glicemia",
  insulin: "Insulina",
  food: "Alimentação",
  activity: "Atividade",
};

const formatDateTime = (t: number) =>
  new Date(t).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const toISODate = (t: number) => new Date(t).toISOString().slice(0, 10);

const History = () => {
  const [selected, setSelected] = useState<Set<TabId>>(new Set(["glucose"]));
  const [catOpen, setCatOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [period, setPeriod] = useState<PeriodKey>("30");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    if (catOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [catOpen]);

  const toggleCategory = (id: TabId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (next.size === 0) next.add(id);
      return next;
    });
  };

  const clearCategories = () => setSelected(new Set<TabId>());

  const range = useMemo(() => {
    const end = Date.now();
    if (period === "custom" && customStart && customEnd) {
      const s = new Date(customStart).getTime();
      const e = new Date(customEnd).getTime() + 24 * 60 * 60 * 1000 - 1;
      if (isFinite(s) && isFinite(e) && s <= e) return { start: s, end: e };
    }
    const map: Record<Exclude<PeriodKey, "custom">, number> = { "7": 7, "30": 30, "90": 90 };
    const days = map[(period === "custom" ? "30" : period) as Exclude<PeriodKey, "custom">];
    return { start: end - days * day, end };
  }, [period, customStart, customEnd]);

  const between = <T extends { at: number }>(arr: T[]) =>
    arr.filter((i) => i.at >= range.start && i.at <= range.end).sort((a, b) => b.at - a.at);

  const filtered = useMemo(() => {
    return {
      glucose: between(GLUCOSE),
      insulin: between(INSULIN),
      food: between(FOOD),
      activity: between(ACTIVITY),
    };
  }, [range]);

  const SectionTitle = ({ id }: { id: TabId }) => (
    <div className="flex items-center gap-2 px-1">
      <div className="w-8 h-8 rounded-full bg-accent/10 grid place-items-center">
        {ICONS[id]({ className: "text-accent", size: 16 })}
      </div>
      <h3 className="text-sm font-semibold text-foreground">{LABELS[id]}</h3>
    </div>
  );

  const Section = ({ id }: { id: TabId }) => {
    if (id === "glucose") {
      const list = filtered.glucose;
      return (
        <div className="space-y-3">
          <SectionTitle id={id} />
          {list.map((g) => (
            <InfoCard key={g.id} className="border border-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/10 grid place-items-center">
                    <Activity className="text-accent" size={18} />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {g.value} {g.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">{g.context}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{formatDateTime(g.at)}</p>
              </div>
            </InfoCard>
          ))}
          {list.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              Nenhum registro no período selecionado.
            </p>
          )}
        </div>
      );
    }

    if (id === "insulin") {
      const list = filtered.insulin;
      return (
        <div className="space-y-3">
          <SectionTitle id={id} />
          {list.map((i) => (
            <InfoCard key={i.id} className="border border-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/10 grid place-items-center">
                    <Droplet className="text-accent" size={18} />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">{i.units} U</p>
                    <p className="text-sm text-muted-foreground">{i.type}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{formatDateTime(i.at)}</p>
              </div>
            </InfoCard>
          ))}
          {list.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              Nenhum registro no período selecionado.
            </p>
          )}
        </div>
      );
    }

    if (id === "food") {
      const list = filtered.food;
      return (
        <div className="space-y-3">
          <SectionTitle id={id} />
          {list.map((f) => (
            <InfoCard key={f.id} className="border border-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/10 grid place-items-center">
                    <UtensilsCrossed className="text-accent" size={18} />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">{f.carbs} g carboidratos</p>
                    <p className="text-sm text-muted-foreground">{f.mealType}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{formatDateTime(f.at)}</p>
              </div>
            </InfoCard>
          ))}
          {list.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              Nenhum registro no período selecionado.
            </p>
          )}
        </div>
      );
    }

    const list = filtered.activity;
    return (
      <div className="space-y-3">
        <SectionTitle id={id} />
        {list.map((a) => (
          <InfoCard key={a.id} className="border border-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/10 grid place-items-center">
                  <Dumbbell className="text-accent" size={18} />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{a.durationMin} min</p>
                  <p className="text-sm text-muted-foreground">{a.title}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{formatDateTime(a.at)}</p>
            </div>
          </InfoCard>
        ))}
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum registro no período selecionado.
          </p>
        )}
      </div>
    );
  };

  const categories: TabId[] = ["glucose", "insulin", "food", "activity"];
  const selectedArray = Array.from(selected);

  /** ------- Export helpers (CSV / PDF) ------- */
  const buildRows = () => {
    const rows: { categoria: string; valor: string; detalhe: string; dataHora: string }[] = [];

    if (selected.has("glucose")) {
      for (const g of filtered.glucose) {
        rows.push({
          categoria: LABELS.glucose,
          valor: `${g.value} ${g.unit}`,
          detalhe: g.context,
          dataHora: formatDateTime(g.at),
        });
      }
    }
    if (selected.has("insulin")) {
      for (const i of filtered.insulin) {
        rows.push({
          categoria: LABELS.insulin,
          valor: `${i.units} U`,
          detalhe: i.type,
          dataHora: formatDateTime(i.at),
        });
      }
    }
    if (selected.has("food")) {
      for (const f of filtered.food) {
        rows.push({
          categoria: LABELS.food,
          valor: `${f.carbs} g carboidratos`,
          detalhe: f.mealType,
          dataHora: formatDateTime(f.at),
        });
      }
    }
    if (selected.has("activity")) {
      for (const a of filtered.activity) {
        rows.push({
          categoria: LABELS.activity,
          valor: `${a.durationMin} min`,
          detalhe: a.title,
          dataHora: formatDateTime(a.at),
        });
      }
    }
    return rows;
  };

  const toCSV = (rows: ReturnType<typeof buildRows>) => {
    const header = ["categoria", "valor", "detalhe", "dataHora"];
    const quote = (s: string) => `"${String(s).split('"').join('""')}"`; // sem regex literal
    const lines: string[] = [];
    lines.push(header.map(quote).join(","));
    for (const r of rows) {
      lines.push([r.categoria, r.valor, r.detalhe, r.dataHora].map(quote).join(","));
    }
    return lines.join("\n");
  };

  const download = (content: string | Blob, filename: string) => {
    const blob =
      content instanceof Blob
        ? content
        : new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportPDF = (rows: ReturnType<typeof buildRows>) => {
    // sem dependências: abre nova janela com HTML pronto e dispara print (o usuário salva como PDF)
    const startISO = toISODate(range.start);
    const endISO = toISODate(range.end);
    const cats =
      selected.size === categories.length ? "Todas" : selectedArray.map((id) => LABELS[id]).join(", ");

    const htmlRows = rows
      .map(
        (r) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${r.categoria}</td>
          <td style="padding:8px;border:1px solid #ddd;">${r.valor}</td>
          <td style="padding:8px;border:1px solid #ddd;">${r.detalhe}</td>
          <td style="padding:8px;border:1px solid #ddd; white-space:nowrap;">${r.dataHora}</td>
        </tr>`
      )
      .join("");

    const doc = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Relatório dIA</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; margin: 24px; color: #111; }
            h1 { font-size: 20px; margin: 0 0 8px 0; }
            p.meta { color: #555; margin: 0 0 16px 0; }
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            thead th { text-align: left; background: #f3f3f3; border: 1px solid #ddd; padding: 8px; }
            tr:nth-child(even) { background: #fafafa; }
          </style>
        </head>
        <body>
          <h1>Relatório dIA — Exportar dados</h1>
          <p class="meta"><strong>Período:</strong> ${startISO} a ${endISO} · <strong>Categorias:</strong> ${cats}</p>
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Detalhe</th>
                <th>Data/Hora</th>
              </tr>
            </thead>
            <tbody>
              ${htmlRows || `<tr><td colspan="4" style="padding:12px;text-align:center;color:#777;">Sem dados no período</td></tr>`}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(doc);
    w.document.close();
  };

  const exportReport = () => {
    const rows = buildRows();
    const startISO = toISODate(range.start);
    const endISO = toISODate(range.end);
    const cats =
      selected.size === categories.length ? "todas" : selectedArray.join("-");

    if (exportFormat === "csv") {
      const csv = toCSV(rows);
      download(csv, `relatorio_${cats}_${startISO}_a_${endISO}.csv`);
    } else {
      exportPDF(rows);
    }
  };
  /** -------------------------------------------- */

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-semibold text-white mb-1 font-poppins">
            Histórico
          </h1>
          <p className="text-white/80 text-sm font-poppins">
            Consulte seus registros por período e categoria
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4 space-y-4">
        <InfoCard className="sticky top-2 z-10">
          <div className="flex items-center gap-2 mb-3">
            <CalendarRange size={16} className="text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Período</p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(["7", "30", "90", "custom"] as PeriodKey[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={
                  p === period
                    ? "rounded-full px-3 py-2 text-xs bg-accent text-white font-medium"
                    : "rounded-full px-3 py-2 text-xs bg-card border border-border text-foreground hover:bg-muted transition-smooth"
                }
              >
                {p === "7" && "7 dias"}
                {p === "30" && "30 dias"}
                {p === "90" && "90 dias"}
                {p === "custom" && "Custom"}
              </button>
            ))}
          </div>

          {period === "custom" && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full bg-card border border-border rounded-3xl py-3 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              />
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full bg-card border border-border rounded-3xl py-3 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              />
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 gap-3">
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Categorias</p>
                <div className="flex items-center gap-2">
                  {selected.size > 0 && (
                    <button
                      onClick={clearCategories}
                      className="text-xs text-muted-foreground hover:text-foreground transition-smooth inline-flex items-center gap-1"
                      title="Limpar seleção"
                    >
                      <X size={14} />
                      Limpar
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={() => setCatOpen((v) => !v)}
                aria-expanded={catOpen}
                aria-haspopup="listbox"
                className="mt-2 w-full bg-card border border-border rounded-3xl px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-muted transition-smooth"
              >
                <span className="truncate">
                  {selected.size
                    ? selected.size === categories.length
                      ? "Todas as categorias"
                      : Array.from(selected).map((id) => LABELS[id]).join(", ")
                    : "Selecione categorias..."}
                </span>
                <Filter size={16} className="text-muted-foreground ml-3" />
              </button>

              {catOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-card border border-accent/30 rounded-2xl shadow-2xl z-20 overflow-hidden">
                  <ul role="listbox" className="max-h-64 overflow-auto py-2">
                    {categories.map((id) => {
                      const Icon = ICONS[id];
                      const active = selected.has(id);
                      return (
                        <li key={id}>
                          <button
                            role="option"
                            aria-selected={active}
                            onClick={() => toggleCategory(id)}
                            className="w-full px-3 py-2 flex items-center gap-3 hover:bg-muted/60 transition-smooth text-sm"
                          >
                            <span className="w-8 h-8 rounded-full grid place-items-center bg-accent/10 text-accent">
                              <Icon size={16} />
                            </span>
                            <span className="flex-1 text-foreground">{LABELS[id]}</span>
                            {active ? (
                              <Check size={16} className="text-success" />
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-border" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Formato:</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as "csv" | "pdf")}
                  className="bg-card border border-border rounded-2xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                >
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>

              <button
                onClick={exportReport}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm text-white gradient-primary shadow-soft hover:shadow-elevated transition-smooth whitespace-nowrap"
                disabled={selected.size === 0}
                title="Exportar dados"
              >
                <Download size={16} className="text-white" />
                Exportar dados
              </button>
            </div>
          </div>
        </InfoCard>

        <div className="space-y-6">
          {Array.from(selected).map((id) => (
            <Section key={id} id={id} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default History;
