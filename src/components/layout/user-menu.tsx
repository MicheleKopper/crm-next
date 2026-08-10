"use client";

import { ChevronsUpDown, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import type { SessionPayload } from "@/server/auth/session";

export function UserMenu({
  user,
  collapsed,
}: {
  user: SessionPayload;
  collapsed: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const initial = user.fullName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function handleMyProfile() {
    setOpen(false);
    toast.info("Meu Perfil estará disponível em breve.");
  }

  function handleToggle() {
    if (!open && collapsed && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setFlyoutPos({ top: rect.top - 124, left: rect.right + 8 });
    }
    setOpen((value) => !value);
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative border-t border-navy-800 py-3",
        collapsed ? "px-2" : "px-3"
      )}
    >
      {open && !collapsed && (
        <div className="absolute inset-x-3 bottom-[calc(100%-0.25rem)] overflow-hidden rounded-lg border border-navy-700 bg-navy-800 shadow-lg">
          <button
            type="button"
            onClick={handleMyProfile}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-navy-100 hover:bg-navy-700 hover:text-white"
          >
            <User size={16} />
            Meu Perfil
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 border-t border-navy-700 px-3 py-2.5 text-sm font-medium text-navy-100 hover:bg-navy-700 hover:text-white"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      )}

      {open && collapsed && flyoutPos && (
        <div
          style={{ position: "fixed", top: flyoutPos.top, left: flyoutPos.left }}
          className="z-50 w-56 overflow-hidden rounded-lg border border-navy-700 bg-navy-800 shadow-xl"
        >
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-white">
              {user.fullName}
            </p>
            <p className="truncate text-xs text-navy-100/60">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleMyProfile}
            className="flex w-full items-center gap-2.5 border-t border-navy-700 px-3 py-2.5 text-sm font-medium text-navy-100 hover:bg-navy-700 hover:text-white"
          >
            <User size={16} />
            Meu Perfil
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 border-t border-navy-700 px-3 py-2.5 text-sm font-medium text-navy-100 hover:bg-navy-700 hover:text-white"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        title={collapsed ? user.fullName : undefined}
        onClick={handleToggle}
        className={cn(
          "flex items-center rounded-lg py-2 text-left hover:bg-navy-800",
          collapsed ? "w-full justify-center px-0" : "w-full gap-2.5 px-2"
        )}
      >
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-navy-100 text-sm font-semibold text-navy-900">
          {initial}
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {user.fullName}
              </p>
              <p className="truncate text-xs text-navy-100/60">{user.email}</p>
            </div>
            <ChevronsUpDown size={14} className="flex-shrink-0 text-navy-100/60" />
          </>
        )}
      </button>
    </div>
  );
}
