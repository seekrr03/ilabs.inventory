// app/dashboard/layout.tsx
import { Sidebar } from "@/components/nav/sidebar";
import { UserNav } from "@/components/nav/user-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="w-64 hidden md:block border-r" />
      <div className="flex flex-col flex-1">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold tracking-tight">Office Inventory</h2>
          <UserNav />
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}