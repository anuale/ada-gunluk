import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ada'nın Günlüğü",
  description: "Çocuk gelişim takip rehberi",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ada Günlük",
  },
};

export const viewport = {
  themeColor: "#436440",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-on-surface font-sans text-base">
        <Providers>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                borderRadius: "16px",
                background: "#1b1c1c",
                color: "#fbf9f8",
                fontSize: "14px",
              },
            }}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
