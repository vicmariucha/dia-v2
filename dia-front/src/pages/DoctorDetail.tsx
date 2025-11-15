import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InfoCard } from "@/components/dia/InfoCard";
import { BottomNav } from "@/components/dia/BottomNav";
import {
  Stethoscope,
  Building2,
  Mail,
  Phone,
  FileText,
  CalendarRange,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  clinic?: string;
  photoUrl?: string;
};

const doctors: Record<string, Doctor> = {
  "1": {
    id: "1",
    name: "Dra. Laura",
    specialty: "Endocrinologista",
    email: "laura.lopes@clinic.com",
    phone: "(11) 99999-1234",
    clinic: "Clínica Vida Saudável",
    photoUrl: "https://i.pravatar.cc/120?img=47",
  },
  "2": {
    id: "2",
    name: "Dr. Eduardo",
    specialty: "Clínico Geral",
    email: "edu@saude.com",
    phone: "(21) 98888-4321",
    clinic: "Instituto Bem-Estar",
    photoUrl: "https://i.pravatar.cc/120?img=12",
  },
};

type DatasetKey = "glucose" | "insulin" | "meals" | "activities";
type PeriodKey = "7" | "30" | "90" | "custom";

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = useMemo<Doctor | undefined>(() => (id ? doctors[id] : undefined), [id]);

  const [datasets, setDatasets] = useState<Record<DatasetKey, boolean>>({
    glucose: true,
    insulin: false,
    meals: false,
    activities: false,
  });
  const [period, setPeriod] = useState<PeriodKey>("90");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background grid place-items-center p-6">
        <p className="text-sm text-muted-foreground">Médico não encontrado.</p>
      </div>
    );
  }

  const initials = doctor.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const toggleDataset = (k: DatasetKey) =>
    setDatasets((prev) => ({ ...prev, [k]: !prev[k] }));

  const hasAnyDataset = Object.values(datasets).some(Boolean);
  const canSend =
    hasAnyDataset &&
    ((period !== "custom") || (customStart && customEnd && customStart <= customEnd));

  const handleSendReport = () => {
    if (!canSend) return;
    // Aqui você chamaria sua API de envio compartilhando os dados selecionados
    toast.success("Relatório enviado com sucesso!", {
      icon: <CheckCircle size={18} className="text-success" />,
      position: "top-center",
      duration: 2200,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {doctor.photoUrl ? (
            <img
              src={doctor.photoUrl}
              alt={doctor.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/15 grid place-items-center">
              <span className="text-white font-semibold">{initials}</span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1 leading-tight font-poppins">
              {doctor.name}
            </h1>
            <p className="text-white/80 text-sm font-poppins">{doctor.specialty}</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4 space-y-4">
        <InfoCard>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent/10 grid place-items-center">
              <Stethoscope className="text-accent" size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Informações do médico</h2>
              <p className="text-xs text-muted-foreground">Contato e clínica</p>
            </div>
          </div>

          <div className="mt-2 space-y-2">
            {doctor.clinic && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="text-muted-foreground" size={16} />
                <span className="text-foreground">{doctor.clinic}</span>
              </div>
            )}
            {doctor.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="text-muted-foreground" size={16} />
                <span className="text-foreground">{doctor.email}</span>
              </div>
            )}
            {doctor.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="text-muted-foreground" size={16} />
                <span className="text-foreground">{doctor.phone}</span>
              </div>
            )}
          </div>
        </InfoCard>

        <InfoCard>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent/10 grid place-items-center">
              <FileText className="text-accent" size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Enviar relatórios</h2>
              <p className="text-xs text-muted-foreground">Escolha os dados e o período</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <label className="flex items-center gap-2 text-sm bg-muted/50 rounded-2xl px-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-current"
                checked={datasets.glucose}
                onChange={() => toggleDataset("glucose")}
              />
              <span>Glicemia</span>
            </label>
            <label className="flex items-center gap-2 text-sm bg-muted/50 rounded-2xl px-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-current"
                checked={datasets.insulin}
                onChange={() => toggleDataset("insulin")}
              />
              <span>Insulina</span>
            </label>
            <label className="flex items-center gap-2 text-sm bg-muted/50 rounded-2xl px-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-current"
                checked={datasets.meals}
                onChange={() => toggleDataset("meals")}
              />
              <span>Alimentação</span>
            </label>
            <label className="flex items-center gap-2 text-sm bg-muted/50 rounded-2xl px-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-current"
                checked={datasets.activities}
                onChange={() => toggleDataset("activities")}
              />
              <span>Atividades</span>
            </label>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
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
          </div>

          <button
            onClick={handleSendReport}
            disabled={!canSend}
            className="w-full mt-4 gradient-primary text-white font-medium py-3.5 px-6 rounded-[32px] shadow-soft hover:shadow-elevated transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar relatório
          </button>
        </InfoCard>

        <InfoCard>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 grid place-items-center">
                <MessageCircle className="text-accent" size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Chat com o médico</h2>
                <p className="text-xs text-muted-foreground">Converse com {doctor.name}</p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/chat/${doctor.id}`)}
              className="text-accent text-sm font-medium hover:underline"
            >
              Abrir chat
            </button>
          </div>
        </InfoCard>
      </div>

      <BottomNav />
    </div>
  );
};

export default DoctorDetail;
