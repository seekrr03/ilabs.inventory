"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Users, Receipt, PieChart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Inventory", icon: Package, href: "/dashboard/inventory" },
  { label: "Vendors", icon: Users, href: "/dashboard/vendors" },
  { label: "Bills", icon: Receipt, href: "/dashboard/bills" },
  { label: "Reporting", icon: PieChart, href: "/dashboard/reporting" },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 h-full bg-white", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">iLabs Ops</h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-slate-100 rounded-lg transition",
                  pathname === route.href ? "bg-slate-100 text-blue-600" : "text-zinc-500"
                )}
              >
                <route.icon className={cn("h-5 w-5 mr-3")} />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}