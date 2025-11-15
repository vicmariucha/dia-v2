import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const GlucoseSaved = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home-patient");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-8 animate-fade-in">
      <div className="bg-success rounded-3xl shadow-elevated px-8 py-6 max-w-sm mx-6 animate-scale-in">
        <div className="flex items-center gap-4">
          <CheckCircle className="text-white flex-shrink-0" size={32} />
          <p className="text-white font-medium text-lg">
            Glicemia salva com sucesso!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlucoseSaved;
