// src/pages/CarbCalculator.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InfoCard } from "@/components/dia/InfoCard";
import { AppTextField } from "@/components/dia/AppTextField";
import { BottomNav } from "@/components/dia/BottomNav";
import { Calculator, UtensilsCrossed, Droplet, ArrowLeft } from "lucide-react";

const CarbCalculator = () => {
  const navigate = useNavigate();

  const [carboidratos, setCarboidratos] = useState("");
  const [glicemiaAtual, setGlicemiaAtual] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resultado, setResultado] = useState<string | null>(null);

  const calcularBolus = () => {
    setErrorMessage("");
    setResultado(null);

    const ICR = 15;
    const glicemiaAlvo = 100;
    const fatorSensibilidade = 50;

    const carbsNumber = Number(carboidratos.replace(",", "."));
    const glicemiaNumber = Number(glicemiaAtual.replace(",", "."));

    if (!carboidratos || isNaN(carbsNumber) || carbsNumber <= 0) {
      setErrorMessage(
        "Insira um valor válido para os carboidratos (em gramas).",
      );
      return;
    }

    if (!glicemiaAtual || isNaN(glicemiaNumber) || glicemiaNumber <= 0) {
      setErrorMessage("Insira um valor válido para a glicemia atual.");
      return;
    }

    const bolusAlimentar = carbsNumber / ICR;
    const bolusCorrecao =
      (glicemiaNumber - glicemiaAlvo) / fatorSensibilidade;

    const bolusTotal = Math.max(bolusAlimentar + bolusCorrecao, 0);

    setResultado(bolusTotal.toFixed(1));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header no padrão do app */}
      <div className="gradient-primary pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white/90 hover:text-white transition-smooth mr-1"
            aria-label="Voltar"
          >
            <ArrowLeft size={22} />
          </button>

          <div className="w-10 h-10 rounded-full bg-white/15 grid place-items-center">
            <Calculator size={20} className="text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-white mb-1 font-poppins">
              Calculadora de bolus
            </h1>
            <p className="text-white/80 text-sm font-poppins">
              Ajuda na contagem de carboidratos e correção de glicemia.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4 space-y-4">
        <InfoCard>
          <div className="mb-2">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-accent/10 grid place-items-center">
                <UtensilsCrossed size={16} className="text-accent" />
              </span>
              Dados da refeição
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Informe os carboidratos da refeição e sua glicemia atual.
            </p>
          </div>

          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quantidade de carboidratos (g)
              </label>
              <AppTextField
                type="number"
                placeholder="Ex.: 30"
                value={carboidratos}
                onChange={(e) => setCarboidratos(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Glicemia atual (mg/dL)
              </label>
              <AppTextField
                type="number"
                icon={<Droplet size={18} />}
                placeholder="Ex.: 150"
                value={glicemiaAtual}
                onChange={(e) => setGlicemiaAtual(e.target.value)}
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}

            <button
              onClick={calcularBolus}
              className="w-full gradient-primary text-white font-medium py-3.5 px-6 rounded-[32px] shadow-soft hover:shadow-elevated transition-smooth inline-flex items-center justify-center gap-2"
            >
              <Calculator size={18} className="text-white" />
              Calcular bolus
            </button>

            {resultado && (
              <div className="mt-2 rounded-2xl bg-primary/5 border border-primary/20 px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  Dose de insulina recomendada:
                </p>
                <p className="text-lg font-semibold text-accent">
                  {resultado} U
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Este cálculo é apenas uma estimativa e não substitui a
                  orientação do seu profissional de saúde.
                </p>
              </div>
            )}
          </div>
        </InfoCard>
      </div>

      <BottomNav />
    </div>
  );
};

export default CarbCalculator;
