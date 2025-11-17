// src/pages/doctor/DoctorPatient.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/mock";
import { Patient } from "@/lib/types";
import { InfoCard } from "@/components/dia/InfoCard";
import { PrimaryButton } from "@/components/dia/PrimaryButton";
import { AppTextField } from "@/components/dia/AppTextField";
import Glucose24hChart from "@/components/dia/Glucose24hChart";
import {
  ChevronRight,
  ChevronLeft,
  Activity,
  Droplet,
  UtensilsCrossed,
  Dumbbell,
} from "lucide-react";
import { format } from "date-fns";

/** -------------------- Página principal -------------------- */
export default function DoctorPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<
    "dados" | "relatorios" | "exames" | "solicitar" | "chat"
  >("dados");

  useEffect(() => {
    if (id) api.getPatient(id).then(setPatient);
  }, [id]);

  if (!patient) {
    return (
      <div className="min-h-screen bg-background">
        <div className="gradient-primary pt-12 pb-8 px-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-white mb-1 font-poppins">
              Paciente
            </h1>
            <p className="text-white/80 text-sm font-poppins">
              Carregando dados…
            </p>
          </div>
        </div>
        <div className="max-w-md mx-auto px-6 -mt-4 py-6">
          <InfoCard>
            <p className="text-sm text-muted-foreground">Carregando…</p>
          </InfoCard>
        </div>
      </div>
    );
  }

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: "dados", label: "Dados do paciente" },
    { id: "relatorios", label: "Relatórios" },
    { id: "exames", label: "Exames realizados" },
    { id: "solicitar", label: "Solicitar exame" },
    { id: "chat", label: "Chat" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/doctor")}
            aria-label="Voltar para a lista de pacientes"
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-smooth"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1 font-poppins">
              {patient.nome}
            </h1>
            <p className="text-white/80 text-sm font-poppins">
              Visão do médico
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4 pb-10 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-xs transition-smooth ${
                activeTab === t.id
                  ? "bg-accent text-white shadow-soft"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "dados" && <Dados patient={patient} />}
        {activeTab === "relatorios" && <Relatorios patient={patient} />}
        {activeTab === "exames" && <Exames patient={patient} />}
        {activeTab === "solicitar" && <SolicitarExame patient={patient} />}
        {activeTab === "chat" && <ChatStub patient={patient} />}
      </div>
    </div>
  );
}

/** -------------------- Tab: Dados -------------------- */
function Dados({ patient }: { patient: Patient }) {
  const avg = useMemo(() => {
    const arr = patient.shared.glucose;
    if (!arr.length) return 0;
    return Math.round(arr.reduce((s, g) => s + g.mgdl, 0) / arr.length);
  }, [patient.shared.glucose]);

  const initials =
    (patient.nome || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "PT";

  return (
    <div className="space-y-4">
      <InfoCard className="relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground mb-1">
              Média glicemia (24h)
            </p>
            <p className="text-4xl font-semibold text-accent mb-1">
              {avg}
              <span className="text-2xl">mg/dL</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Somente dados compartilhados pelo paciente.
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-accent/10 text-accent grid place-items-center font-semibold">
            {initials}
          </div>
        </div>
      </InfoCard>

      <InfoCard>
        <Glucose24hChart data={patient.shared.glucose} />
        <p className="text-xs text-muted-foreground mt-2">Últimas 24 horas</p>
      </InfoCard>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MiniInfo
          title="Contato"
          lines={[patient.email ?? "—", patient.telefone ?? "—"]}
          icon={<Activity size={14} />}
        />
        <MiniInfo
          title="Nascimento"
          lines={[patient.nascimento ?? "—"]}
          icon={<Activity size={14} />}
        />
        <MiniInfo
          title="Sexo"
          lines={[patient.sexo ?? "—"]}
          icon={<Activity size={14} />}
        />
      </div>
    </div>
  );
}

function MiniInfo({
  title,
  lines,
  icon,
}: {
  title: string;
  lines: string[];
  icon?: React.ReactNode;
}) {
  return (
    <InfoCard>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-full bg-accent/10 text-accent grid place-items-center">
          {icon}
        </div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>
      {lines.map((l, i) => (
        <div key={i} className="text-sm font-medium text-foreground truncate">
          {l}
        </div>
      ))}
    </InfoCard>
  );
}

/** -------------------- Tab: Relatórios -------------------- */
function Relatorios({ patient }: { patient: Patient }) {
  const [kind, setKind] = useState<
    "glicemia-historico" | "insulina-historico" | "atividades" | "alimentacao"
  >("glicemia-historico");
  const [range, setRange] = useState(90);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string>("");

  const request = async () => {
    setBusy(true);
    const r = await api.requestReport(patient.id, kind, range);
    setSent(r.id);
    setBusy(false);
  };

  return (
    <div className="space-y-4">
      <InfoCard>
        <div className="font-medium mb-2">
          Relatórios disponíveis (compartilhados)
        </div>
        <ul className="list-disc pl-5 text-sm">
          <li>
            Glicemia (últimas 24h): {patient.shared.glucose.length} pontos
          </li>
          <li>Insulina: {patient.shared.insulin.length} registros</li>
          <li>Alimentação: {patient.shared.meals.length} registros</li>
          <li>Atividades: {patient.shared.activities.length} registros</li>
        </ul>
        <div className="text-xs text-muted-foreground mt-2">
          O médico visualiza apenas o que o paciente compartilhou.
        </div>
      </InfoCard>

      <InfoCard>
        <div className="font-medium mb-3">
          Solicitar novo relatório ao paciente
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 items-center">
          <select
            className="w-full bg-card border border-border rounded-3xl py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
            value={kind}
            onChange={(e) => setKind(e.target.value as any)}
          >
            <option value="glicemia-historico">Histórico de glicose</option>
            <option value="insulina-historico">Histórico de insulina</option>
            <option value="alimentacao">Alimentação</option>
            <option value="atividades">Atividades</option>
          </select>

          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-24 bg-card border border-border rounded-3xl py-3 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              value={range}
              onChange={(e) => setRange(parseInt(e.target.value || "0"))}
              min={1}
            />
            <span className="text-sm text-muted-foreground">dias</span>
          </div>

          <PrimaryButton
            onClick={request}
            disabled={busy}
            className="whitespace-nowrap"
          >
            {busy ? "Enviando…" : "Solicitar"}
          </PrimaryButton>
        </div>

        {sent && (
          <div className="text-sm text-success mt-2">
            Pedido enviado ao paciente (ID: {sent}).
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-2">
          O paciente poderá aprovar ou recusar o pedido.
        </div>
      </InfoCard>

      <InfoCard>
        <div className="font-medium mb-2">Pedidos pendentes</div>
        <ul className="divide-y">
          {patient.pendingRequests.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Nenhum pedido pendente.
            </div>
          )}
          {patient.pendingRequests.map((r) => (
            <li key={r.id} className="py-2 flex items-center justify-between">
              <div>
                <div className="text-sm">
                  {labelKind(r.kind)} — {r.rangeDays} dias
                </div>
                <div className="text-xs text-muted-foreground">
                  Solicitado em{" "}
                  {format(new Date(r.requestedAt), "dd/MM/yyyy HH:mm")}
                </div>
              </div>
              <span className="text-[10px] uppercase px-2 py-1 border rounded">
                {r.status}
              </span>
            </li>
          ))}
        </ul>
      </InfoCard>
    </div>
  );
}

function labelKind(k: string) {
  return (
    {
      "glicemia-historico": "Histórico de glicose",
      "insulina-historico": "Histórico de insulina",
      atividades: "Atividades",
      alimentacao: "Alimentação",
    } as Record<string, string>
  )[k] ?? k;
}

/** -------------------- Tab: Exames -------------------- */
function Exames({ patient }: { patient: Patient }) {
  return (
    <InfoCard>
      <div className="font-medium mb-2">Exames realizados</div>
      <ul className="divide-y">
        {patient.shared.exams.length === 0 && (
          <div className="text-sm text-muted-foreground">Nenhum exame.</div>
        )}
        {patient.shared.exams.map((ex) => (
          <li key={ex.id} className="py-2 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">
                {ex.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(ex.date), "dd/MM/yyyy")}
              </div>
            </div>
            {ex.resultUrl ? (
              <a
                className="text-sm underline"
                href={ex.resultUrl}
                target="_blank"
                rel="noreferrer"
              >
                Abrir resultado
              </a>
            ) : (
              <span className="text-sm">—</span>
            )}
          </li>
        ))}
      </ul>
    </InfoCard>
  );
}

/** -------------------- Tab: Solicitar Exame -------------------- */
function SolicitarExame({ patient }: { patient: Patient }) {
  const [name, setName] = useState("Hemoglobina Glicada (HbA1c)");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  const go = async () => {
    setBusy(true);
    await api.requestExam(patient.id, name, notes);
    setBusy(false);
    setOk(true);
    setTimeout(() => setOk(false), 3000);
  };

  return (
    <div className="space-y-3">
      <InfoCard>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <label className="text-sm font-medium text-foreground">Exame</label>
            <AppTextField
              value={name}
              onChange={(e) =>
                setName((e.target as HTMLInputElement).value)
              }
              placeholder="Nome do exame"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium text-foreground">
              Observações ao paciente
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
              placeholder="Ex.: Realizar em jejum. Trazer exames anteriores."
            />
          </div>

          <div>
            <PrimaryButton onClick={go} disabled={busy} className="w-fit">
              {busy ? "Enviando…" : "Solicitar exame"}
            </PrimaryButton>
            {ok && (
              <div className="text-sm text-success mt-2">
                Solicitação enviada para o paciente.
              </div>
            )}
          </div>
        </div>
      </InfoCard>

      <InfoCard>
        <div className="font-medium mb-2">Solicitações em aberto</div>
        <ul className="divide-y">
          {patient.examRequests.length === 0 && (
            <div className="text-sm text-muted-foreground">Nenhuma.</div>
          )}
          {patient.examRequests.map((x) => (
            <li key={x.id} className="py-2 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">
                  {x.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Solicitado em{" "}
                  {format(new Date(x.requestedAt), "dd/MM/yyyy HH:mm")}
                </div>
              </div>
              <span className="text-[10px] uppercase px-2 py-1 border rounded">
                {x.status}
              </span>
            </li>
          ))}
        </ul>
      </InfoCard>
    </div>
  );
}

/** -------------------- Tab: Chat -------------------- */
function ChatStub({ patient }: { patient: Patient }) {
  const [msgs, setMsgs] = useState<
    { from: "doctor" | "patient"; text: string }[]
  >([{ from: "patient", text: `Olá doutor(a)!` }]);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: "doctor", text }]);
    setText("");
  };

  return (
    <InfoCard>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-accent/10 grid place-items-center">
          <ChevronRight className="text-accent" size={16} />
        </div>
        <div className="font-medium">Chat com {patient.nome}</div>
      </div>

      <div className="h-80 border border-border rounded-3xl p-2 overflow-auto flex flex-col gap-2 bg-muted/40">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`max-w-[78%] px-3 py-2 rounded-2xl ${
              m.from === "doctor"
                ? "self-end bg-card border border-border"
                : "self-start bg-primary/10"
            }`}
          >
            <div className="text-xs text-muted-foreground mb-1">
              {m.from === "doctor" ? "Você" : "Paciente"}
            </div>
            <div className="text-sm">{m.text}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-3 pb-1">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva uma mensagem…"
          className="flex-1 bg-card border border-border rounded-3xl py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
        />
        <PrimaryButton onClick={send} className="px-4 py-3 w-auto">
          Enviar
        </PrimaryButton>
      </div>

      <p className="text-xs text-muted-foreground mt-1">
        Em desenvolvimento...
      </p>
    </InfoCard>
  );
}

/** -------------------- (Opcional) Mini legendas -------------------- */
export const Legend = () => (
  <div className="grid grid-cols-4 gap-2">
    <LegendItem icon={<Activity size={14} />} label="Glicemia" />
    <LegendItem icon={<Droplet size={14} />} label="Insulina" />
    <LegendItem icon={<UtensilsCrossed size={14} />} label="Alimentação" />
    <LegendItem icon={<Dumbbell size={14} />} label="Atividade" />
  </div>
);

const LegendItem = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex items-center gap-2 text-xs text-muted-foreground">
    <div className="w-6 h-6 rounded-full bg-accent/10 grid place-items-center text-accent">
      {icon}
    </div>
    <span>{label}</span>
  </div>
  
);
