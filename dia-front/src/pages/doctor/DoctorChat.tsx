// src/pages/doctor/DoctorChat.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, User as UserIcon } from "lucide-react";
import DoctorBottomNav from "@/components/dia/DoctorBottomNav";

type Message = {
  id: string;
  from: "me" | "patient";
  text: string;
  timestamp: number;
};

type Patient = {
  id: string;
  name: string;
  avatarUrl?: string;
};

const mockPatient: Patient = {
  id: "p1",
  name: "João Silva",
  avatarUrl: "https://i.pravatar.cc/120?img=32",
};

const formatTime = (t: number) => {
  const d = new Date(t);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const DoctorChat = () => {
  const navigate = useNavigate();
  const patient = mockPatient;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      from: "patient",
      text: "Olá, doutor(a)! Meus níveis de glicemia têm variado bastante.",
      timestamp: Date.now() - 1000 * 60 * 60,
    },
    {
      id: "m2",
      from: "me",
      text: "Olá, João! Você anotou os horários e valores das últimas medições?",
      timestamp: Date.now() - 1000 * 60 * 55,
    },
    {
      id: "m3",
      from: "patient",
      text: "Sim, medi 95 em jejum e 180 após o almoço.",
      timestamp: Date.now() - 1000 * 60 * 50,
    },
  ]);
  const [input, setInput] = useState("");
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    if (!vv) return;

    const handleResize = () => {
      const bottomInset = Math.max(
        0,
        (window.innerHeight - vv.height - vv.offsetTop) || 0,
      );
      setKeyboardOffset(bottomInset);
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    };

    vv.addEventListener("resize", handleResize);
    vv.addEventListener("scroll", handleResize);
    handleResize();

    return () => {
      vv.removeEventListener("resize", handleResize);
      vv.removeEventListener("scroll", handleResize);
    };
  }, []);

  const initials = useMemo(
    () =>
      patient.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    [patient.name],
  );

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const newMsg: Message = {
      id: crypto.randomUUID(),
      from: "me",
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          from: "patient",
          text: "Entendi, doutor(a). Vou acompanhar mais de perto.",
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
      {/* Header */}
      <div className="gradient-primary pt-10 pb-4 px-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white/90 hover:text-white transition-smooth"
            aria-label="Voltar"
          >
            <ArrowLeft size={22} />
          </button>

          {patient.avatarUrl ? (
            <img
              src={patient.avatarUrl}
              alt={patient.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/20 grid place-items-center">
              <span className="text-white text-xs font-semibold">
                {initials}
              </span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-white leading-tight truncate font-poppins">
              {patient.name}
            </h1>
            <p className="text-[12px] text-white/80 font-poppins truncate">
              Paciente
            </p>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      <div
        ref={scrollRef}
        className="max-w-md mx-auto px-4 pt-3 h-[calc(100vh-9rem)] overflow-y-auto"
        style={{
          paddingBottom: `calc(${140}px + env(safe-area-inset-bottom, 0px) + ${keyboardOffset}px)`,
        }}
      >
        <div className="space-y-2">
          {messages.map((m) => {
            const mine = m.from === "me";
            return (
              <div
                key={m.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                {!mine &&
                  (patient.avatarUrl ? (
                    <img
                      src={patient.avatarUrl}
                      alt={patient.name}
                      className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent/10 grid place-items-center mr-2 self-end">
                      <UserIcon className="text-accent" size={16} />
                    </div>
                  ))}

                <div
                  className={[
                    "max-w-[75%] rounded-2xl px-3 py-2",
                    mine
                      ? "bg-accent text-white"
                      : "bg-card border border-border text-foreground",
                  ].join(" ")}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {m.text}
                  </p>
                  <p
                    className={[
                      "text-[10px] mt-1",
                      mine ? "text-white/80" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {formatTime(m.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div
        className="fixed inset-x-0"
        style={{
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

      <DoctorBottomNav />
    </div>
  );
};

export default DoctorChat;
