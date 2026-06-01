import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { Sidebar, BottomNav } from "@/components/layout/navigation";
import { TopBar } from "@/components/layout/topbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <TopBar />
        <main className="flex-1 px-5 md:px-10 pb-24 md:pb-10 max-w-5xl mx-auto w-full py-6">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
