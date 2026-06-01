"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles,
  Send,
  User,
  Bot,
  Lightbulb,
  TrendingUp,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChildContext {
  name: string;
  ageMonths: number;
}

const suggestedQuestions = [
  "Bu ay hangi gelişimsel aktiviteleri yapmalıyız?",
  "Uyku düzeni için ne önerirsin?",
  "Tuvalet iletişiminde nelere dikkat etmeliyim?",
  "Sınır koymakta zorlanıyorum, ne yapabilirim?",
  "Ek gıdaya geçişte nelere dikkat etmeliyim?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Merhaba! 👋 Ben Ada'nın Günlüğü asistanı. Çocuk gelişimi, günlük rutinler, uyku, beslenme veya aklına takılan her konuda bana soru sorabilirsin. Sana kitap bilgisine dayalı, sıcak ve yargılayıcı olmayan yanıtlar vereceğim.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [childContext, setChildContext] = useState<ChildContext | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    fetch("/api/children")
      .then((r) => r.json())
      .then((data) => {
        if (data.children?.length > 0) {
          const c = data.children[0];
          const ageMonths = Math.floor(
            (new Date().getTime() - new Date(c.birthDate).getTime()) /
              (1000 * 60 * 60 * 24 * 30.44)
          );
          setChildContext({ name: c.name, ageMonths });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const userMsg: Message = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            childContext,
          }),
        });

        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply || "Yanıt alınamadı." },
        ]);
      } catch {
        toast.error("Bağlantı hatası");
      } finally {
        setLoading(false);
      }
    },
    [messages, childContext]
  );

  const handleAnalyze = async (type: "weekly" | "monthly") => {
    if (!childContext) return;
    setAnalysisLoading(true);
    setShowAnalysis(true);

    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          childId: "", // will be fetched server-side via auth
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        setAnalysisResult(d.analysis || "Analiz yapılamadı.");
        return;
      }

      const data = await res.json();
      setAnalysisResult(data.analysis);
    } catch {
      setAnalysisResult("Analiz sırasında bir hata oluştu.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) sendMessage(input.trim());
  };

  return (
    <div className="space-y-4 h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-primary flex items-center gap-2">
          <Sparkles size={22} />
          AI Asistan
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleAnalyze("weekly")}
            disabled={analysisLoading || !childContext}
            className="flex items-center gap-1.5 bg-surface border border-outline-variant/20 rounded-full px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            <Calendar size={14} />
            Haftalık Analiz
          </button>
          <button
            onClick={() => handleAnalyze("monthly")}
            disabled={analysisLoading || !childContext}
            className="flex items-center gap-1.5 bg-surface border border-outline-variant/20 rounded-full px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            <TrendingUp size={14} />
            Aylık Analiz
          </button>
        </div>
      </div>

      {showAnalysis && analysisResult && (
        <div className="bg-primary-container/20 rounded-2xl p-4 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">AI Analizi</span>
          </div>
          <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
            {analysisLoading ? "Analiz ediliyor..." : analysisResult}
          </p>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 scrollbar-thin"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-on-primary rounded-br-md"
                  : "bg-surface border border-outline-variant/10 rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-surface border border-outline-variant/10 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && !loading && (
        <div className="flex flex-wrap gap-2 px-2">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="bg-surface border border-outline-variant/20 rounded-full px-3 py-1.5 text-xs text-on-surface-variant hover:bg-surface-container-low hover:border-primary/30 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Bir şey sor..."
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-full border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-surface-tint transition-colors disabled:opacity-50 active:scale-95"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
