"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Kayıt başarısız");
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("E-posta veya şifre hatalı");
      } else {
        toast.success("Hoş geldiniz!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-primary mb-2">
            Ada&apos;nın Günlüğü
          </h1>
          <p className="text-on-surface-variant text-sm">
            {isRegister ? "Aileye katıl" : "Günlüğüne devam et"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/20 space-y-4"
        >
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">
                Ad Soyad
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isRegister}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                placeholder="Adınız"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-primary text-on-primary font-medium text-sm hover:bg-surface-tint transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isRegister ? (
              "Kayıt Ol"
            ) : (
              "Giriş Yap"
            )}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-on-surface-variant">
          {isRegister ? (
            <>
              Zaten üye misin?{" "}
              <button
                onClick={() => setIsRegister(false)}
                className="text-primary font-medium hover:underline"
              >
                Giriş yap
              </button>
            </>
          ) : (
            <>
              İlk kez mi geliyorsun?{" "}
              <button
                onClick={() => setIsRegister(true)}
                className="text-primary font-medium hover:underline"
              >
                Kayıt ol
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
