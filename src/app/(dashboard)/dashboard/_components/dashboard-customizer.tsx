"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, LayoutGrid } from "lucide-react";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  DashboardLayoutItem,
  DashboardWidgetSize,
} from "@/server/modules/dashboard-layout/dashboard-layout.dto";

const SIZE_LABELS: Record<DashboardWidgetSize, string> = {
  1: "¼",
  2: "½",
  3: "¾",
  4: "Full",
};

const SIZE_CLASSES: Record<DashboardWidgetSize, string> = {
  1: "sm:col-span-1 lg:col-span-1",
  2: "sm:col-span-2 lg:col-span-2",
  3: "sm:col-span-2 lg:col-span-3",
  4: "sm:col-span-2 lg:col-span-4",
};

const SIZE_CYCLE: DashboardWidgetSize[] = [1, 2, 3, 4];

export type DashboardWidget = { id: string; node: ReactNode; filterVisible: boolean };

/* --------------------------------------------------------------- contexto */

type CustomizerContextValue = {
  editing: boolean;
  toggleEditing: () => void;
  draft: DashboardLayoutItem[];
  setDraft: (updater: (prev: DashboardLayoutItem[]) => DashboardLayoutItem[]) => void;
  save: () => Promise<void>;
  reset: () => Promise<void>;
  cancel: () => void;
  saving: boolean;
};

const DashboardCustomizerContext = createContext<CustomizerContextValue | null>(null);

function useDashboardCustomizer() {
  const context = useContext(DashboardCustomizerContext);
  if (!context) {
    throw new Error("useDashboardCustomizer deve ser usado dentro de DashboardCustomizerProvider");
  }
  return context;
}

export function DashboardCustomizerProvider({
  initialLayout,
  children,
}: {
  initialLayout: DashboardLayoutItem[];
  children: ReactNode;
}) {
  const [savedLayout, setSavedLayout] = useState(initialLayout);
  const [draft, setDraftState] = useState(initialLayout);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  function toggleEditing() {
    if (!editing) setDraftState(savedLayout);
    setEditing(!editing);
  }

  function setDraft(updater: (prev: DashboardLayoutItem[]) => DashboardLayoutItem[]) {
    setDraftState(updater);
  }

  async function save() {
    setSaving(true);
    try {
      const response = await fetch("/api/dashboard-layout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: draft }),
      });
      if (response.ok) {
        const result: DashboardLayoutItem[] = await response.json();
        setSavedLayout(result);
        setDraftState(result);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    setSaving(true);
    try {
      const response = await fetch("/api/dashboard-layout", { method: "DELETE" });
      if (response.ok) {
        const result: DashboardLayoutItem[] = await response.json();
        setSavedLayout(result);
        setDraftState(result);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    setDraftState(savedLayout);
    setEditing(false);
  }

  return (
    <DashboardCustomizerContext.Provider
      value={{ editing, toggleEditing, draft, setDraft, save, reset, cancel, saving }}
    >
      {children}
    </DashboardCustomizerContext.Provider>
  );
}

/* ----------------------------------------------------------- botão gatilho */

export function DashboardCustomizeToggle() {
  const { editing, toggleEditing } = useDashboardCustomizer();
  return (
    <Button
      type="button"
      variant={editing ? "primary" : "secondary"}
      onClick={toggleEditing}
      aria-label="Personalizar"
      aria-pressed={editing}
      title="Personalizar"
      className="h-10 w-10 p-0"
    >
      <LayoutGrid size={16} />
    </Button>
  );
}

/* -------------------------------------------------------- widget arrastável */

function SortableWidget({
  item,
  widget,
  editing,
  onToggleVisible,
  onCycleSize,
}: {
  item: DashboardLayoutItem;
  widget: DashboardWidget;
  editing: boolean;
  onToggleVisible: () => void;
  onCycleSize: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: !editing,
  });

  const style = { transform: CSS.Transform.toString(transform), transition };

  if (!editing) {
    return (
      <div ref={setNodeRef} style={style} className={SIZE_CLASSES[item.size]}>
        {widget.node}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(SIZE_CLASSES[item.size], "relative", isDragging && "z-20 opacity-90")}
    >
      <div
        className={cn(
          "rounded-2xl ring-2 ring-dashed ring-status-lead/40 ring-offset-2 transition-opacity",
          !item.visible && "opacity-40"
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-2 rounded-lg bg-navy-900/90 px-2.5 py-1.5 text-white">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none rounded p-1 hover:bg-white/10 active:cursor-grabbing"
            aria-label="Arrastar para reordenar"
          >
            <GripVertical size={14} />
          </button>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onCycleSize}
              className="rounded px-2 py-1 text-[11px] font-semibold hover:bg-white/10"
              aria-label="Alternar tamanho do card"
              title="Alternar tamanho"
            >
              {SIZE_LABELS[item.size]}
            </button>
            <button
              type="button"
              onClick={onToggleVisible}
              aria-label={item.visible ? "Ocultar card" : "Mostrar card"}
              title={item.visible ? "Ocultar card" : "Mostrar card"}
              className="rounded p-1 hover:bg-white/10"
            >
              {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>
        </div>
        <div className={cn(!item.visible && "pointer-events-none")}>{widget.node}</div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- grade */

export function DashboardWidgetGrid({ widgets }: { widgets: DashboardWidget[] }) {
  const { editing, draft, setDraft, save, reset, cancel, saving } = useDashboardCustomizer();
  const widgetsById = useMemo(() => new Map(widgets.map((widget) => [widget.id, widget])), [widgets]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const visibleItems = editing
    ? draft
    : draft.filter((item) => item.visible && (widgetsById.get(item.id)?.filterVisible ?? true));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setDraft((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex).map((item, index) => ({ ...item, order: index }));
    });
  }

  function toggleVisible(id: string) {
    setDraft((prev) =>
      prev.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item))
    );
  }

  function cycleSize(id: string) {
    setDraft((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextIndex = (SIZE_CYCLE.indexOf(item.size) + 1) % SIZE_CYCLE.length;
        return { ...item, size: SIZE_CYCLE[nextIndex] };
      })
    );
  }

  return (
    <div className="space-y-4">
      {editing && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-status-lead/50 bg-status-lead/5 px-4 py-3">
          <p className="text-sm font-semibold text-navy-900">
            Modo personalização ativo — arraste, redimensione ou oculte os cards.
          </p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={cancel} disabled={saving}>
              Cancelar
            </Button>
            <Button type="button" variant="secondary" onClick={reset} disabled={saving}>
              Restaurar padrão
            </Button>
            <Button type="button" onClick={save} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={visibleItems.map((item) => item.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleItems.map((item) => {
              const widget = widgetsById.get(item.id);
              if (!widget) return null;
              return (
                <SortableWidget
                  key={item.id}
                  item={item}
                  widget={widget}
                  editing={editing}
                  onToggleVisible={() => toggleVisible(item.id)}
                  onCycleSize={() => cycleSize(item.id)}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
