import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Stethoscope } from "lucide-react";
import { BottomNav } from "@/components/dia/BottomNav";

type Message = {
  id: string;
  from: "me" | "doctor";
  text: string;
  timestamp: number;
};

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  photoUrl?: string;
};

const doctors: Record<string, Doctor> = {
  "1": { id: "1", name: "Dra. Ana Beatriz", specialty: "Endocrinologista", photoUrl: "https://i.pravatar.cc/120?img=47" },
  "2": { id: "2", name: "Dr. Carlos Eduardo", specialty: "Clínico Geral", photoUrl: "https://i.pravatar.cc/120?img=12" },
};

const formatTime = (t: number) => {
  const d = new Date(t);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const DoctorChat = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const doctor = useMemo<Doctor | undefined>(() => (id ? doctors[id] : undefined), [id]);

  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", from: "doctor", text: "Olá! Como você está hoje?", timestamp: Date.now() - 1000 * 60 * 60 },
    { id: "m2", from: "me", text: "Oi, doutora! Estou bem, medi 110 mg/dL pela manhã.", timestamp: Date.now() - 1000 * 60 * 55 },
    { id: "m3", from: "doctor", text: "Ótimo! Siga com a rotina e me avise se tiver sintomas.", timestamp: Date.now() - 1000 * 60 * 50 },
  ]);
  const [input, setInput] = useState("");
  const [keyboardOffset, setKeyboardOffset] = useState(0); // px extra quando teclado estiver aberto

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // rolar pro fim ao mudar mensagens
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // ajustar quando teclado móvel abrir (visualViewport)
  useEffect(() => {
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    if (!vv) return;

    const handleResize = () => {
      // se a altura visual diminuir, teclado provavelmente abriu.
      const bottomInset = Math.max(0, (window.innerHeight - vv.height - vv.offsetTop) || 0);
      setKeyboardOffset(bottomInset);
      // manter mensagens visíveis
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    };

    vv.addEventListener("resize", handleResize);
    vv.addEventListener("scroll", handleResize);
    handleResize();

    return () => {
      vv.removeEventListener("resize", handleResize);
      vv.removeEventListener("scroll", handleResize);
    };
  }, []);

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

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg: Message = { id: crypto.randomUUID(), from: "me", text, timestamp: Date.now() };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // mock de resposta
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          from: "doctor",
          text: "Entendi. Obrigado por avisar! 👍",
          timestamp: Date.now(),
        },
      ]);
    }, 900);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary pt-10 pb-4 px-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white/90 hover:text-white transition-smooth"
            aria-label="Voltar"
          >
            <ArrowLeft size={22} />
          </button>

          {doctor.photoUrl ? (
            <img src={doctor.photoUrl} alt={doctor.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/20 grid place-items-center">
              <span className="text-white text-xs font-semibold">{initials}</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-white leading-tight truncate font-poppins">
              {doctor.name}
            </h1>
            <p className="text-[12px] text-white/80 font-poppins truncate">{doctor.specialty}</p>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="max-w-md mx-auto px-4 pt-3 h-[calc(100vh-9rem)] overflow-y-auto"
        // espaço para não esconder as últimas mensagens atrás do input
        style={{ paddingBottom: `calc(${140}px + env(safe-area-inset-bottom, 0px) + ${keyboardOffset}px)` }}
      >
        <div className="space-y-2">
          {messages.map((m) => {
            const mine = m.from === "me";
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                {!mine && (
                  doctor.photoUrl ? (
                    <img
                      src={doctor.photoUrl}
                      alt={doctor.name}
                      className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent/10 grid place-items-center mr-2 self-end">
                      <Stethoscope className="text-accent" size={16} />
                    </div>
                  )
                )}

                <div
                  className={[
                    "max-w-[75%] rounded-2xl px-3 py-2",
                    mine ? "bg-accent text-white" : "bg-card border border-border text-foreground",
                  ].join(" ")}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{m.text}</p>
                  <p className={["text-[10px] mt-1", mine ? "text-white/80" : "text-muted-foreground"].join(" ")}>
                    {formatTime(m.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="fixed inset-x-0"
        style={{
          // base acima da bottom nav (64px ~ h-16) + margem extra + teclado
          bottom: `calc(64px + 8px + env(safe-area-inset-bottom, 0px) + ${keyboardOffset}px)`,
        }}
      >
        <div className="max-w-md mx-auto px-4">
          <div className="bg-card border border-border rounded-3xl shadow-soft p-2 flex items-center gap-2 mb-[env(safe-area-inset-bottom)]">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Escreva sua mensagem..."
              // Em mobile, o foco abre o teclado automaticamente
              inputMode="text"
              className="flex-1 bg-transparent outline-none text-sm px-2"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="inline-flex items-center justify-center rounded-full gradient-primary text-white px-3 py-2 shadow-soft hover:shadow-elevated transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Enviar"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default DoctorChat;
