import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/mock";
import { Patient } from "@/lib/types";
import { InfoCard } from "@/components/dia/InfoCard";
import { CurvedHeader } from "@/components/dia/CurvedHeader";
import { ChevronRight } from "lucide-react";
import DoctorBottomNav from "@/components/dia/DoctorBottomNav";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await api.listPatients();
        if (isMounted) setPatients(data || []);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const initialsOf = (name?: string) =>
    (name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "PT";

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-semibold text-white mb-1 font-poppins">
            Seus pacientes
          </h1>
          <p className="text-white/80 text-sm font-poppins">
            Acompanhe e acesse os dados de cada paciente
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4 pb-10 space-y-3">
        {loading && (
          <InfoCard>
            <p className="text-sm text-muted-foreground">Carregando pacientes…</p>
          </InfoCard>
        )}

        {!loading && patients.length === 0 && (
          <InfoCard>
            <p className="text-sm text-muted-foreground text-center">
              Nenhum paciente associado.
            </p>
          </InfoCard>
        )}

        {!loading &&
          patients.map((p) => (
            <InfoCard
              key={p.id}
              onClick={() => navigate(`/doctor/patient/${p.id}`)}
              className="cursor-pointer hover:border-accent/30 border border-transparent"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent grid place-items-center font-semibold">
                    {initialsOf(p.nome)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {p.nome}
                    </p>
                    {p.email && (
                      <p className="text-xs text-muted-foreground truncate">
                        {p.email}
                      </p>
                    )}
                    {p.telefone && (
                      <p className="text-xs text-muted-foreground truncate">
                        {p.telefone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 w-8 h-8 rounded-full bg-accent/10 grid place-items-center">
                  <ChevronRight className="text-accent" size={18} />
                </div>
              </div>
            </InfoCard>
          ))}
      </div>
          <DoctorBottomNav />

    </div>
  );
}
