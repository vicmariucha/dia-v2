import { useNavigate } from "react-router-dom";
import { InfoCard } from "@/components/dia/InfoCard";
import { BottomNav } from "@/components/dia/BottomNav";
import { ChevronRight, Stethoscope } from "lucide-react";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  photoUrl?: string;
};

const mockDoctors: Doctor[] = [
  { id: "1", name: "Dra. Ana Beatriz", specialty: "Endocrinologista", photoUrl: "https://i.pravatar.cc/100?img=47" },
  { id: "2", name: "Dr. Carlos Eduardo", specialty: "Clínico Geral", photoUrl: "https://i.pravatar.cc/100?img=12" },
];

const MyDoctor = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-semibold text-white mb-1 font-poppins">
            Meus médicos
          </h1>
          <p className="text-white/80 text-sm font-poppins">
            Profissionais vinculados à sua conta
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4 space-y-3">
        {mockDoctors.map((doc) => (
          <InfoCard
            key={doc.id}
            className="cursor-pointer hover:border-accent/30 border border-transparent"
            onClick={() => navigate(`/doctor/${doc.id}`)}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {doc.photoUrl ? (
                  <img
                    src={doc.photoUrl}
                    alt={doc.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-accent/10 grid place-items-center">
                    <Stethoscope className="text-accent" size={20} />
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {doc.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{doc.specialty}</p>
                </div>
              </div>

              <ChevronRight className="text-muted-foreground" size={18} />
            </div>
          </InfoCard>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default MyDoctor;
