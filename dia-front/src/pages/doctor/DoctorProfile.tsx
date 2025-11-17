// src/pages/doctor/DoctorProfile.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  User as UserIcon,
  Mail,
  Calendar,
  Stethoscope,
  IdCard,
  CheckCircle,
  LogOut,
} from "lucide-react";
import { InfoCard } from "@/components/dia/InfoCard";
import { AppTextField } from "@/components/dia/AppTextField";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DoctorBottomNav from "@/components/dia/DoctorBottomNav";
import type { UserDetails } from "@/lib/api";

type DoctorData = {
  name: string;
  email: string;
  birthDate: string;
  specialty: string;
  crm: string;
};

const formatPtDate = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("T")[0].split("-");
  return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
};

const isEqual = (a: DoctorData, b: DoctorData) =>
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

const DoctorProfile = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<DoctorData>({
    name: "",
    email: "",
    birthDate: "",
    specialty: "",
    crm: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState<DoctorData>(data);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      try {
        setLoading(true);
        const raw = localStorage.getItem("user");
        if (!raw) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(raw) as UserDetails;
        const profile = (user as any).doctorProfile;

        const mapped: DoctorData = {
          name: user.fullName,
          email: user.email,
          birthDate: user.dateOfBirth?.slice(0, 10) ?? "",
          specialty: profile?.specialty ?? "",
          crm: profile?.crm ?? "",
        };

        setData(mapped);
        setEdited(mapped);
      } catch (err) {
        console.error("Erro ao carregar perfil do médico", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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

    setData(edited);
    setIsEditing(false);

    // opcional: atualizar também o user salvo no localStorage
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const user = JSON.parse(raw) as any;
        user.fullName = edited.name;
        user.email = edited.email;
        user.dateOfBirth = edited.birthDate;
        user.doctorProfile = {
          ...(user.doctorProfile || {}),
          specialty: edited.specialty,
          crm: edited.crm,
        };
        localStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        console.error("Erro ao atualizar user no localStorage", e);
      }
    }

    toast.success("Salvo com sucesso!", {
      icon: <CheckCircle size={18} className="text-success" />,
      position: "top-center",
      duration: 2000,
    });
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Você realmente deseja sair da sua conta?",
    );
    if (!confirmed) return;

    try {
      localStorage.clear();
      sessionStorage.clear();

      toast.success("Logout realizado com sucesso!", {
        position: "top-center",
        duration: 2000,
      });

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erro ao realizar logout", error);
      toast.error("Erro ao sair. Tente novamente.", {
        position: "top-center",
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-semibold text-white mb-1 font-poppins">
            Perfil
          </h1>
          <p className="text-white/80 text-sm font-poppins">
            Suas informações de profissional de saúde
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4 space-y-4">
        <InfoCard>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="text-accent font-semibold">{initials}</span>
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
              Dados profissionais
            </h2>
            <p className="text-xs text-muted-foreground">
              Informações sobre sua atuação
            </p>
          </div>

          <div className="divide-y divide-border mt-2">
            <FieldRow
              icon={<Stethoscope size={16} />}
              label="Especialidade"
              valueNode={
                isEditing ? (
                  <AppTextField
                    value={edited.specialty}
                    onChange={(e) =>
                      setEdited((p) => ({ ...p, specialty: e.target.value }))
                    }
                    placeholder="Ex.: Endocrinologia"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {data.specialty || "—"}
                  </p>
                )
              }
            />

            <FieldRow
              icon={<IdCard size={16} />}
              label="CRM"
              valueNode={
                isEditing ? (
                  <AppTextField
                    value={edited.crm}
                    onChange={(e) =>
                      setEdited((p) => ({ ...p, crm: e.target.value }))
                    }
                    placeholder="123456"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {data.crm || "—"}
                  </p>
                )
              }
            />
          </div>
        </InfoCard>

        {!isEditing ? (
          <div className="flex items-center gap-3">
            <button
              onClick={startEdit}
              className="w-1/2 gradient-primary text-white font-medium py-3.5 px-6 rounded-[32px] shadow-soft hover:shadow-elevated transition-smooth inline-flex items-center justify-center gap-2"
            >
              <Pencil size={18} className="text-white" />
              Editar perfil
            </button>

            <button
              onClick={handleLogout}
              className="w-1/2 bg-card text-muted-foreground font-medium py-3.5 px-6 rounded-[32px] border border-border shadow-soft hover:bg-muted transition-smooth inline-flex items-center justify-center gap-2 text-sm"
            >
              <LogOut size={18} className="text-muted-foreground" />
              Sair
            </button>
          </div>
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

      <DoctorBottomNav />
    </div>
  );
};

export default DoctorProfile;
