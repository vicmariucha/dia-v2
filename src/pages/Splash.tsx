import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Droplet } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="relative">
        <div className="w-32 h-32 gradient-primary rounded-[40%_60%_60%_40%/60%_40%_60%_40%] flex items-center justify-center animate-pulse">
          <Droplet className="w-16 h-16 text-white" strokeWidth={1.5} />
        </div>
      </div>
      <h1 className="text-5xl font-bold text-accent mt-8 drop-shadow-sm">
        dIA
      </h1>
    </div>
  );
};

export default Splash;
