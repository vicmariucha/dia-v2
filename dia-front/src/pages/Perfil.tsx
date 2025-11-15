// src/pages/Perfil.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  User as UserIcon,
  Mail,
  Calendar,
  Droplet,
  Syringe,
  Activity,
  CheckCircle,
} from "lucide-react";
import { InfoCard } from "@/components/dia/InfoCard";
import { BottomNav } from "@/components/dia/BottomNav";
import { AppTextField } from "@/components/dia/AppTextField";
import { toast } from "sonner";

import { useAuthUser } from "@/hooks/useAuthUser";
import { getUser, type UserDetails } from "@/lib/api";

type PatientData = {
  name: string;
  email: string;
  birthDate: string; // ISO (yyyy-MM-dd)
  diabetesType: "Tipo 1" | "Tipo 2";
  treatment: "Insulina" | "Medicação oral" | "Dieta e exercício";
  glucoseChecks: "1-2" | "3-5" | "6+";
  bolusInsulin: string;
  basalInsulin: string;
};

const formatPtDate = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("T")[0].split("-");
  return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
};

const isEqual = (a: PatientData, b: PatientData) =>
  JSON.stringify(a) === JSON.stringify(b);

const FieldRow = ({
  icon,
  label,
  valueNode,
}: {
  icon?: React.ReactNode;
  label: string;
  valueNode: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 py-2">
    {icon && (
      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
        <span className="text-accent">{icon}</span>
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5">{valueNode}</div>
    </div>
  </div>
);

const Perfil = () => {
  const authUser = useAuthUser();

  // estado base (vai ser sobrescrito pelos dados reais)
  const [data, setData] = useState<PatientData>({
    name: "",
    email: "",
    birthDate: "",
    diabetesType: "Tipo 1",
    treatment: "Insulina",
    glucoseChecks: "1-2",
    bolusInsulin: "",
    basalInsulin: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState<PatientData>(data);
  const [loading, setLoading] = useState(true);

  // ====== carregar dados reais do backend ======
  useEffect(() => {
    if (!authUser) return;

    const load = async () => {
      try {
        setLoading(true);
        const user: UserDetails = await getUser(authUser.id);

        const profile = user.patientProfile;

        const mapped: PatientData = {
          name: user.fullName,
          email: user.email,
          birthDate: user.dateOfBirth?.slice(0, 10) ?? "",
          diabetesType: (profile?.diabetesType as PatientData["diabetesType"]) ?? "Tipo 1",
          treatment: (profile?.treatment as PatientData["treatment"]) ?? "Insulina",
          glucoseChecks:
            (profile?.glucoseChecksPerDay as PatientData["glucoseChecks"]) ?? "1-2",
          bolusInsulin: profile?.bolusInsulin ?? "",
          basalInsulin: profile?.basalInsulin ?? "",
        };

        setData(mapped);
        setEdited(mapped);
      } catch (err) {
        console.error("Erro ao carregar perfil do paciente", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [authUser]);

  const initials = useMemo(() => {
    if (!data.name) return "--";
    return data.name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [data.name]);

  const dirty = !isEqual(edited, data);

  const startEdit = () => {
    setEdited(data);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEdited(data);
    setIsEditing(false);
  };

  const saveEdit = () => {
    if (!dirty) return;

    // por enquanto salva só localmente (UI).
    // depois a gente faz o PUT no backend.
    setData(edited);
    setIsEditing(false);
    toast.success("Salvo com sucesso!", {
      icon: <CheckCircle size={18} className="text-success" />,
      position: "top-center",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-semibold text-white mb-1 font-poppins">
            Perfil
          </h1>
          <p className="text-white/80 text-sm font-poppins">
            Suas informações de paciente
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4 space-y-4">
        <InfoCard>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="text-accent font-semibold">
                {initials}
              </span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Dados pessoais
              </h2>
              <p className="text-xs text-muted-foreground">
                Informações básicas
              </p>
            </div>
          </div>

          <div className="divide-y divide-border mt-2">
            <FieldRow
              icon={<UserIcon size={16} />}
              label="Nome"
              valueNode={
                isEditing ? (
                  <AppTextField
                    value={edited.name}
                    onChange={(e) =>
                      setEdited((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground truncate">
                    {loading && !data.name ? "Carregando..." : data.name}
                  </p>
                )
              }
            />

            <FieldRow
              icon={<Mail size={16} />}
              label="Email"
              valueNode={
                isEditing ? (
                  <AppTextField
                    type="email"
                    value={edited.email}
                    onChange={(e) =>
                      setEdited((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground truncate">
                    {loading && !data.email ? "Carregando..." : data.email}
                  </p>
                )
              }
            />

            <FieldRow
              icon={<Calendar size={16} />}
              label="Data de nascimento"
              valueNode={
                isEditing ? (
                  <AppTextField
                    type="date"
                    value={edited.birthDate}
                    onChange={(e) =>
                      setEdited((p) => ({
                        ...p,
                        birthDate: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {data.birthDate
                      ? formatPtDate(data.birthDate)
                      : loading
                      ? "Carregando..."
                      : "—"}
                  </p>
                )
              }
            />
          </div>
        </InfoCard>

        <InfoCard>
          <div className="mb-2">
            <h2 className="text-base font-semibold text-foreground">
              Dados de saúde
            </h2>
            <p className="text-xs text-muted-foreground">
              Diabetes e tratamento
            </p>
          </div>

          <div className="divide-y divide-border mt-2">
            <FieldRow
              icon={<Droplet size={16} />}
              label="Tipo de diabetes"
              valueNode={
                isEditing ? (
                  <select
                    value={edited.diabetesType}
                    onChange={(e) =>
                      setEdited((p) => ({
                        ...p,
                        diabetesType:
                          e.target
                            .value as PatientData["diabetesType"],
                      }))
                    }
                    className="w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                  >
                    <option value="Tipo 1">Tipo 1</option>
                    <option value="Tipo 2">Tipo 2</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {data.diabetesType}
                  </p>
                )
              }
            />

            <FieldRow
              icon={<Activity size={16} />}
              label="Tratamento atual"
              valueNode={
                isEditing ? (
                  <select
                    value={edited.treatment}
                    onChange={(e) =>
                      setEdited((p) => ({
                        ...p,
                        treatment:
                          e.target.value as PatientData["treatment"],
                      }))
                    }
                    className="w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                  >
                    <option value="Insulina">Insulina</option>
                    <option value="Medicação oral">Medicação oral</option>
                    <option value="Dieta e exercício">
                      Dieta e exercício
                    </option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {data.treatment}
                  </p>
                )
              }
            />

            <FieldRow
              icon={<Activity size={16} />}
              label="Medições de glicemia/dia"
              valueNode={
                isEditing ? (
                  <select
                    value={edited.glucoseChecks}
                    onChange={(e) =>
                      setEdited((p) => ({
                        ...p,
                        glucoseChecks:
                          e.target
                            .value as PatientData["glucoseChecks"],
                      }))
                    }
                    className="w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                  >
                    <option value="1-2">1-2 vezes</option>
                    <option value="3-5">3-5 vezes</option>
                    <option value="6+">6 ou mais vezes</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {data.glucoseChecks} vezes
                  </p>
                )
              }
            />

            <FieldRow
              icon={<Syringe size={16} />}
              label="Insulina bolus"
              valueNode={
                isEditing ? (
                  <select
                    value={edited.bolusInsulin}
                    onChange={(e) =>
                      setEdited((p) => ({
                        ...p,
                        bolusInsulin: e.target.value,
                      }))
                    }
                    className="w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                  >
                    <option value="">Selecione...</option>
                    <option value="Regular">Regular</option>
                    <option value="Lispro">Lispro</option>
                    <option value="Aspart">Aspart</option>
                    <option value="Glulisina">Glulisina</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {data.bolusInsulin || "—"}
                  </p>
                )
              }
            />

            <FieldRow
              icon={<Syringe size={16} />}
              label="Insulina basal"
              valueNode={
                isEditing ? (
                  <select
                    value={edited.basalInsulin}
                    onChange={(e) =>
                      setEdited((p) => ({
                        ...p,
                        basalInsulin: e.target.value,
                      }))
                    }
                    className="w-full bg-card border border-border rounded-3xl py-3.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
                  >
                    <option value="">Selecione...</option>
                    <option value="NPH">NPH</option>
                    <option value="Glargina">Glargina</option>
                    <option value="Detemir">Detemir</option>
                    <option value="Degludec">Degludec</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {data.basalInsulin || "—"}
                  </p>
                )
              }
            />
          </div>
        </InfoCard>

        {!isEditing ? (
          <button
            onClick={startEdit}
            className="w-full gradient-primary text-white font-medium py-3.5 px-6 rounded-[32px] shadow-soft hover:shadow-elevated transition-smooth inline-flex items-center justify-center gap-2"
          >
            <Pencil size={18} className="text-white" />
            Editar perfil
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={cancelEdit}
              className="w-1/2 bg-card text-accent font-medium py-3.5 px-6 rounded-[32px] border-2 border-accent shadow-soft hover:shadow-elevated transition-smooth"
            >
              Cancelar
            </button>

            <button
              onClick={saveEdit}
              disabled={!dirty}
              className="w-1/2 gradient-primary text-white font-medium py-3.5 px-6 rounded-[32px] shadow-soft hover:shadow-elevated transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salvar
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Perfil;
