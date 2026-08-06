import { redirect } from "next/navigation";

import { Sidebar } from "@/components/layout/sidebar";
import { getSession } from "@/server/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen">
      <Sidebar user={session} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-background px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
