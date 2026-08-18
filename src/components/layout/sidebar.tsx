"use client";

import {
  Archive,
  ChevronDown,
  ChevronRight,
  Folder,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Ship,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { SessionPayload } from "@/server/auth/session";

import { UserMenu } from "./user-menu";

type NavItem = { label: string; href?: string };
type NavGroup = {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    key: "comercial",
    label: "Comercial",
    icon: Users,
    items: [
      { label: "Dashboard" },
      { label: "Clientes", href: "/clientes" },
      { label: "Leads", href: "/leads" },
      { label: "Contatos" },
      { label: "Oportunidades" },
      { label: "Atividades" },
    ],
  },
  {
    key: "pricing",
    label: "Pricing",
    icon: Wallet,
    items: [{ label: "Ocean Freight" }, { label: "Cotações" }],
  },
  {
    key: "embarques",
    label: "Embarques",
    icon: Ship,
    items: [{ label: "Embarques" }, { label: "Drafts / Bill of Ladings" }],
  },
  {
    key: "inventario",
    label: "Inventário",
    icon: Archive,
    items: [{ label: "Purchase Orders" }, { label: "Flexitanks", href: "/flexitanks" }],
  },
  {
    key: "financeiro",
    label: "Financeiro",
    icon: Wallet,
    items: [
      { label: "Dashboard" },
      { label: "Transações" },
      { label: "Recebíveis" },
      { label: "Pagáveis" },
    ],
  },
  {
    key: "registros",
    label: "Registros",
    icon: Folder,
    items: [
      { label: "Produtos" },
      { label: "Empresas" },
      { label: "Portos" },
      { label: "Serviços do Armador" },
      { label: "Categoria de Produtos" },
    ],
  },
  {
    key: "configuracoes",
    label: "Configurações",
    icon: Settings,
    items: [
      { label: "Usuários" },
      { label: "Auditoria" },
      { label: "Relatar Erro" },
    ],
  },
];

const COLLAPSED_STORAGE_KEY = "sidebar:collapsed";

export function Sidebar({ user }: { user: SessionPayload }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>("comercial");
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(
    null
  );

  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const flyoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(COLLAPSED_STORAGE_KEY);
    if (stored === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    if (!collapsed || !openGroup) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (flyoutRef.current?.contains(target)) return;
      if (buttonRefs.current.get(openGroup!)?.contains(target)) return;
      setOpenGroup(null);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenGroup(null);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [collapsed, openGroup]);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
      return next;
    });
    setOpenGroup(null);
  }

  function handleGroupClick(group: NavGroup) {
    if (!collapsed) {
      setOpenGroup((prev) => (prev === group.key ? null : group.key));
      return;
    }

    if (openGroup === group.key) {
      setOpenGroup(null);
      return;
    }

    const button = buttonRefs.current.get(group.key);
    if (button) {
      const rect = button.getBoundingClientRect();
      setFlyoutPos({ top: rect.top, left: rect.right + 8 });
    }
    setOpenGroup(group.key);
  }

  const activeGroup = NAV_GROUPS.find((group) => group.key === openGroup);

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-shrink-0 flex-col bg-navy-900 text-navy-100 transition-[width] duration-200",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <button
        type="button"
        onClick={toggleCollapsed}
        title={collapsed ? "Expandir menu" : "Recolher menu"}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-navy-100 bg-white text-navy-700 shadow-md hover:bg-navy-100 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-100 dark:hover:bg-navy-700"
      >
        {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
      </button>

      <div
        className={cn(
          "flex items-center py-6",
          collapsed ? "justify-center px-2" : "px-5"
        )}
      >
        {collapsed ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-navy-900">
            C
          </div>
        ) : (
          <div>
            <p className="text-xl font-bold text-white">columbus</p>
            <p className="text-[10px] font-semibold tracking-wide text-navy-100/70">
              LOGÍSTICA INTERNACIONAL
            </p>
          </div>
        )}
      </div>

      <nav
        className={cn(
          "scrollbar-hide flex-1 overflow-y-auto pb-4",
          collapsed ? "px-2" : "px-3"
        )}
      >
        <Link
          href="/dashboard"
          title="Dashboard"
          className={cn(
            "flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium text-navy-100 hover:bg-navy-800",
            collapsed ? "justify-center px-0" : "px-3",
            pathname.startsWith("/dashboard") && "bg-navy-800 font-semibold text-white"
          )}
        >
          <LayoutDashboard size={18} />
          {!collapsed && "Dashboard"}
        </Link>

        {NAV_GROUPS.map((group) => {
          const isOpen = openGroup === group.key;
          const Icon = group.icon;
          return (
            <div key={group.key} className="mt-1">
              <button
                ref={(el) => {
                  if (el) buttonRefs.current.set(group.key, el);
                  else buttonRefs.current.delete(group.key);
                }}
                type="button"
                title={collapsed ? group.label : undefined}
                onClick={() => handleGroupClick(group)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg py-2.5 text-sm font-medium text-navy-100 hover:bg-navy-800",
                  collapsed ? "justify-center px-0" : "px-3",
                  collapsed && isOpen && "bg-navy-800"
                )}
              >
                <Icon size={18} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{group.label}</span>
                    {isOpen ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </>
                )}
              </button>

              {!collapsed && isOpen && (
                <ul className="mt-1 space-y-0.5 border-l border-navy-700 pl-6">
                  {group.items.map((item) => {
                    const isActive = item.href && pathname.startsWith(item.href);
                    return (
                      <li key={item.label}>
                        {item.href ? (
                          <Link
                            href={item.href}
                            className={cn(
                              "block rounded-md px-2 py-1.5 text-sm text-navy-100/90 hover:bg-navy-800 hover:text-white",
                              isActive && "bg-navy-800 font-semibold text-white"
                            )}
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span className="block cursor-not-allowed rounded-md px-2 py-1.5 text-sm text-navy-100/40">
                            {item.label}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {!collapsed && (
        <p className="px-5 pt-2 text-[10px] font-medium tracking-wide text-navy-100/40">
          Powered by CARGOFLOW
        </p>
      )}
      <UserMenu user={user} collapsed={collapsed} />

      {collapsed && activeGroup && flyoutPos && (
        <div
          ref={flyoutRef}
          style={{ position: "fixed", top: flyoutPos.top, left: flyoutPos.left }}
          className="z-50 w-56 rounded-lg border border-navy-700 bg-navy-800 py-2 shadow-xl"
        >
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-navy-100/50">
            {activeGroup.label}
          </p>
          <ul className="space-y-0.5 px-1">
            {activeGroup.items.map((item) => {
              const isActive = item.href && pathname.startsWith(item.href);
              return (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => setOpenGroup(null)}
                      className={cn(
                        "block rounded-md px-2 py-1.5 text-sm text-navy-100/90 hover:bg-navy-700 hover:text-white",
                        isActive && "bg-navy-700 font-semibold text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="block cursor-not-allowed rounded-md px-2 py-1.5 text-sm text-navy-100/40">
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}
