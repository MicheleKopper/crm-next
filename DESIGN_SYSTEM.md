# Design System — Columbus CRM (crm-next)

> **Propósito deste documento:** este é o manual oficial de referência visual e de UI/UX do projeto `crm-next`. Ele documenta **exatamente** os padrões já implementados no código — cores, tipografia, espaçamentos, componentes, comportamentos — para que um novo sistema possa reproduzir a mesma identidade visual sem precisar reanalisar o projeto atual.
>
> **Metodologia:** todo valor citado aqui (hex, px, classes Tailwind) foi extraído diretamente do código-fonte, arquivo por arquivo. Nenhum valor foi inventado ou aproximado. Onde o projeto tem inconsistências ou padrões divergentes para o mesmo tipo de componente, isso é documentado explicitamente na seção **20. Inconsistências identificadas** — este documento não corrige nem propõe mudanças ao design atual.
>
> **Stack de referência:** Next.js 16 (App Router) + React 19 + Tailwind CSS v4 (config CSS-first, sem `tailwind.config.*`) + `lucide-react` (ícones) + `recharts` (gráficos) + `sonner` (toasts) + `@dnd-kit` (drag-and-drop) + fontes `Geist`/`Geist Mono` via `next/font/google`.

---

## Sumário

1. [Identidade visual](#1-identidade-visual)
2. [Tipografia](#2-tipografia)
3. [Layout](#3-layout)
4. [Navbar e Sidebar](#4-navbar-e-sidebar)
5. [Cards](#5-cards)
6. [Botões](#6-botões)
7. [Inputs e filtros](#7-inputs-e-filtros)
8. [Tabelas](#8-tabelas)
9. [Gráficos e visualização de dados](#9-gráficos-e-visualização-de-dados)
10. [Status e badges](#10-status-e-badges)
11. [Modais, drawers e menus](#11-modais-drawers-e-menus)
12. [Feedbacks](#12-feedbacks)
13. [Formulários](#13-formulários)
14. [Páginas](#14-páginas)
15. [Responsividade](#15-responsividade)
16. [Ícones](#16-ícones)
17. [Animações e interações](#17-animações-e-interações)
18. [Dark Mode](#18-dark-mode)
19. [Design Tokens (consolidado)](#19-design-tokens-consolidado)
20. [Inconsistências identificadas](#20-inconsistências-identificadas)
21. [Regras para o novo sistema](#21-regras-para-o-novo-sistema)

---

## 1. Identidade visual

### 1.1 Fonte de verdade

Todas as cores do sistema vivem em **`src/app/globals.css`**, como CSS custom properties, mapeadas para utilitários Tailwind via `@theme inline` (Tailwind v4, CSS-first — **não existe `tailwind.config.*` no projeto**).

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: #f4f6fa;
  --foreground: #1b2436;

  --navy-950: #101a30;
  --navy-900: #17233d;
  --navy-800: #1e2c47;
  --navy-700: #2a3b5c;
  --navy-500: #47597a;
  --navy-100: #e7ebf2;

  --status-lead: #2f6fed;
  --status-prospecto: #a35de0;
  --status-ativo: #1fa971;
  --status-inativo: #7a8699;
  --status-perdido: #e0473f;
  --status-incompleto: #b1b1b1;
  --status-warning: #d97706;
  --status-orange: #ea580c;

  /* Escala única para séries de dados (gráficos, barras, donuts).
     Ordem de uso: data-1 → data-5. Nunca usar verde/laranja/vermelho aqui. */
  --data-1: #2f6fed; /* = status-lead — série principal (Bookings) */
  --data-2: #17233d; /* = navy-900   — 2ª série (Containers)      */
  --data-3: #7ea3ee; /*                3ª série (Clientes)        */
  --data-4: #47597a; /* = navy-500   — 4ª série                   */
  --data-5: #c7d6f7; /*                5ª série                   */

  --data-track: #f1f4f9;
  --data-zero: #ccd3e0;
}

.dark {
  --background: #0d1424;
  --foreground: #e7ebf2;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);

  --color-navy-950: var(--navy-950);
  --color-navy-900: var(--navy-900);
  --color-navy-800: var(--navy-800);
  --color-navy-700: var(--navy-700);
  --color-navy-500: var(--navy-500);
  --color-navy-100: var(--navy-100);

  --color-status-lead: var(--status-lead);
  --color-status-prospecto: var(--status-prospecto);
  --color-status-ativo: var(--status-ativo);
  --color-status-inativo: var(--status-inativo);
  --color-status-perdido: var(--status-perdido);
  --color-status-incompleto: var(--status-incompleto);
  --color-status-warning: var(--status-warning);
  --color-status-orange: var(--status-orange);

  --color-data-1: var(--data-1);
  --color-data-2: var(--data-2);
  --color-data-3: var(--data-3);
  --color-data-4: var(--data-4);
  --color-data-5: var(--data-5);
  --color-data-track: var(--data-track);
  --color-data-zero: var(--data-zero);

  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

Cada `--color-X` gera automaticamente as classes `bg-X`, `text-X`, `border-X`, `ring-X`, `fill-X`, `stroke-X`, `divide-X`, `outline-X` etc. Dark mode é **por classe** (`.dark` em `<html>`), não por `prefers-color-scheme`.

### 1.2 Cor principal ("brand navy")

`--navy-900` (`#17233d`) é a cor de marca dominante: fundo da sidebar, fundo do botão primário, cor de texto padrão para títulos/valores em cards claros.

### 1.3 Escala navy (neutros)

| Token | Hex | Papel típico |
|---|---|---|
| `navy-950` | `#101a30` | Overlay de modal/drawer (`bg-navy-950/40`), tom mais escuro do sistema |
| `navy-900` | `#17233d` | Fundo da sidebar, botão primário, texto de título em card claro, avatar/badge de destaque |
| `navy-800` | `#1e2c47` | Hover de item de navegação, painéis escuros (dropdowns), fundo `dark:` de superfícies internas |
| `navy-700` | `#2a3b5c` | Divisor/hover em painéis escuros, borda padrão em dark mode |
| `navy-500` | `#47597a` | Texto secundário/muted, foco de input (`focus:border-navy-500`, `focus:ring-navy-500/20`) |
| `navy-100` | `#e7ebf2` | Borda padrão em light mode, fundo sutil (`bg-navy-100/20`, `/40`, `/60`, `/70`), avatar claro |

> ⚠️ Ver seção **20** — o código também referencia `navy-50`, `navy-200`, `navy-300`, `navy-400`, `navy-600`, que **não existem** como CSS custom properties. Essas classes não têm efeito visual garantido no build atual.

### 1.4 Cores de estado (status)

| Token | Hex | Uso |
|---|---|---|
| `status-lead` | `#2f6fed` | Azul primário/interativo — links, toggle ativo, série de gráfico principal, badge "Lead"/"Novo" |
| `status-prospecto` | `#a35de0` | Roxo — badge "Prospecto" |
| `status-ativo` | `#1fa971` | Verde — sucesso, badge "Ativo", delta positivo, indicador "em estoque"/"convertido" |
| `status-inativo` | `#7a8699` | Cinza-azulado — badge "Inativo" |
| `status-perdido` | `#e0473f` | Vermelho — erro, badge "Perdido"/"Crítico", delta negativo, botão `danger`, campo obrigatório (`*`) |
| `status-incompleto` | `#b1b1b1` | Cinza neutro — badge "Incompleto" (fallback) |
| `status-warning` | `#d97706` | Laranja-âmbar — badge "Contato"/urgência "Médio" |
| `status-orange` | `#ea580c` | Laranja — badge "Negociação"/urgência "Alto" |

Padrão de uso: fundo em 10–15% de opacidade + texto na cor sólida (`bg-status-X/10 text-status-X`), nunca cor sólida de fundo com texto branco (exceto botão `danger`).

### 1.5 Cores de série de dados (gráficos)

```js
// src/components/dashboard/dashboard-card.tsx
export const DATA_COLORS = ["#2f6fed", "#17233d", "#7ea3ee", "#47597a", "#c7d6f7"] as const;
```
Espelha `--data-1` a `--data-5`. Ordem de uso fixa: 1ª série sempre `data-1` (azul), 2ª sempre `data-2` (navy-900), etc. **Regra do projeto** (comentário original em `globals.css`): nunca reutilizar verde/laranja/vermelho (`status-ativo/warning/perdido`) como cor de série — essas ficam reservadas para significado semântico (sucesso/alerta/erro).

`--data-track` (`#f1f4f9`) = trilho de barra de progresso. `--data-zero` (`#ccd3e0`) = cor de texto para valores numéricos iguais a zero.

### 1.6 Cores de fundo e texto

| Token | Light | Dark | Uso |
|---|---|---|---|
| `--background` | `#f4f6fa` | `#0d1424` | Fundo do `<body>` e da área de conteúdo (`bg-background`) |
| `--foreground` | `#1b2436` | `#e7ebf2` | Cor de texto padrão do `<body>` |
| `bg-white` | `#ffffff` | (com `dark:bg-navy-900`) | Fundo de cards, inputs, modais |

### 1.7 Cores de borda

Padrão universal: `border-navy-100` (light) + `dark:border-navy-700` (dark) — repetido literalmente em praticamente todo componente com borda (inputs, selects, textarea, switch, cards, dropdowns, tabelas, paginação).

### 1.8 Paleta de status de embarque (dashboard)

```ts
// src/server/modules/dashboard/dashboard.dto.ts
export const SHIPMENT_STATUS_COLORS: Record<string, string> = {
  Arrived: "#0BA6DF",
  Booked: "#005999",
  Cancelled: "#C40C0C",
  "In Operation": "#E67E22",
  Pending: "#DC3C22",
  Shipped: "#347433",
  "Waiting Departure": "#F1C40F",
};
```
Paleta independente da escala `data-*`, usada especificamente nos donuts de "Status dos embarques" (cor vem de `colorCode` por linha, com fallback `#c7d0d9`).

---

## 2. Tipografia

### 2.1 Família de fonte

```tsx
// src/app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
```
Wired em `globals.css`: `--font-sans: var(--font-geist-sans)`, `--font-mono: var(--font-geist-mono)`. **Geist Sans é a fonte padrão de todo o sistema** (aplicada implicitamente via `font-sans`, sem precisar declarar em cada componente). `font-mono` (Geist Mono) está disponível mas não há uso ativo identificado fora da definição.

### 2.2 Escala de tamanhos

O projeto **prioriza valores arbitrários em px sobre a escala nomeada do Tailwind** — UI densa em dados usa tamanhos muito específicos.

**Escala nomeada em uso:** `text-xs` `text-sm` `text-base` `text-lg` `text-2xl` (não há uso de `text-xl`, `text-3xl` ou maior).

| Classe | Onde é usada |
|---|---|
| `text-2xl font-bold` | Título de página (`<h1>`) em todas as listagens e detalhes |
| `text-2xl font-bold tracking-tight` | Título `<h1>` específico do Dashboard |
| `text-xl font-bold` | Wordmark "columbus" na sidebar |
| `text-lg font-bold` | Título de Modal/Drawer, iniciais do avatar em página de detalhe |
| `text-base font-bold` | Título de seção dentro de página de detalhe (`<h2>`) |
| `text-sm` | Tamanho de corpo/tabela/input/label padrão do sistema |
| `text-xs` | Texto secundário/meta — cabeçalho de tabela, erro de formulário, badges |

**Tamanhos arbitrários (`text-[Npx]`) — do menor ao maior:**

| Classe | Onde é usada |
|---|---|
| `text-[10px]` | Rótulo "COLABORADOR" na sidebar, contador de badge de filtro, eyebrow labels |
| `text-[10.5px] font-semibold` | Micro-tag "sem estoque", legendas de gráfico |
| `text-[11px] font-semibold uppercase tracking-[0.1em]` | **`SectionLabel`** — o padrão oficial de eyebrow/rótulo de seção (`dashboard-card.tsx`) |
| `text-[11px]` | Texto do `DeltaBadge` (variação %) |
| `text-[11.5px]` | Legendas secundárias de métrica ("disponível", texto de delta) |
| `text-[12.5px]` | Legenda muted comum — subtítulo de KPI tile, subtítulo de `DashboardCard`, footer de card |
| `text-[13px]` | Labels de tab/segmented control |
| `text-[13.5px]` | Linhas de legenda do donut, listas dentro de cards |
| `text-[15px] font-semibold tracking-tight` | Título padrão de `DashboardCard` |

**Tamanhos "hero" (números/KPIs) — sempre `font-bold leading-none` + tracking negativo:**

| Classe | Onde é usada |
|---|---|
| `text-[20px] tracking-[-0.03em]` | `MetricValue` variante `"table"` |
| `text-[26px] tracking-[-0.035em]` | Números mensais em `period-cards.tsx` |
| `text-[28px] tracking-[-0.035em]` | Números de tile do grid de flexitanks |
| `text-[30px] tracking-[-0.035em]` | `MetricValue` variante `"hero"` e KPI tiles — **o tamanho padrão de número hero do dashboard** |
| `text-[30px] tracking-[-0.02em]` | Total central dos donuts (mesmo tamanho, tracking ligeiramente diferente) |
| `text-[54px] leading-[0.9] tracking-[-0.04em]` | O maior número do sistema — contador de clientes ativos em `commercial-overview.tsx` |

### 2.3 Peso de fonte

`font-semibold` (o mais comum — labels, cabeçalhos de tabela, botões), `font-bold` (títulos, números hero, iniciais de avatar), `font-medium` (labels de formulário, itens de navegação, texto base de botão).

### 2.4 Tracking (letter-spacing)

- `tracking-wide` + `uppercase text-xs font-semibold` → cabeçalhos de tabela e eyebrow labels no padrão "named scale".
- `tracking-tight` → títulos (`<h1>`, título de `DashboardCard`).
- Tracking negativo arbitrário em números (aumenta com o tamanho): `tracking-[-0.02em]` a `tracking-[-0.04em]`.
- Tracking positivo arbitrário em labels minúsculas maiúsculas: `tracking-[0.09em]` a `tracking-[0.11em]`.

### 2.5 Line-height

- `leading-none` — padrão fixo em **todo** valor numérico/hero (KPIs, totais de donut, métricas).
- `leading-[0.9]` — única exceção, o número de 54px (mais apertado que `leading-none`).
- Texto de corpo usa o line-height padrão do Tailwind (nenhum `leading-tight/snug/relaxed/loose` encontrado em uso).

### 2.6 Hierarquia resumida

```
H1 (título de página)     → text-2xl font-bold [tracking-tight só no Dashboard]
H2 (título de seção)      → text-base font-bold
Título de card            → text-[15px] font-semibold tracking-tight
Subtítulo de card         → text-[12.5px] text-navy-500
Eyebrow / SectionLabel    → text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-500/70
Corpo / tabela / input    → text-sm
Texto secundário / legal  → text-xs ou text-[12.5px], cor text-navy-500
Número KPI (hero)         → text-[30px] font-bold leading-none tracking-[-0.035em]
Número KPI (tabela)       → text-[20px] font-bold leading-none tracking-[-0.03em]
```

---

## 3. Layout

### 3.1 Largura máxima de conteúdo

**Não há um container de largura máxima aplicado à página inteira** — o shell do dashboard é fluido:

```tsx
// src/app/(dashboard)/layout.tsx
<div className="flex h-screen">
  <Sidebar user={session} />
  <div className="flex flex-1 flex-col overflow-hidden">
    <main className="flex-1 overflow-y-auto bg-background px-8 py-6">
      {children}
    </main>
  </div>
</div>
```
Padding da área de conteúdo: **`px-8 py-6`** (32px horizontal / 24px vertical), sem `max-w-*`. `max-w-*` só é usado localmente:

| Classe | Onde |
|---|---|
| `max-w-sm` | Card de login |
| `max-w-lg` | `Modal` (largura padrão) |
| `max-w-2xl` | `Drawer` (override comum via prop `widthClassName`) |
| `max-w-xl` | `Drawer` (largura padrão quando não sobrescrita) |
| `max-w-[140–220px]` | Truncamento de células de tabela |

### 3.2 Grid do Dashboard

```tsx
// dashboard-customizer.tsx — grid real renderizado
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
```
4 colunas em telas grandes (`lg:`), 2 em tablet (`sm:`), 1 em mobile. Cada widget ocupa 1/2/3/4 colunas via classes de span pré-definidas:
```ts
const SIZE_CLASSES: Record<DashboardWidgetSize, string> = {
  1: "sm:col-span-1 lg:col-span-1", // ¼
  2: "sm:col-span-2 lg:col-span-2", // ½
  3: "sm:col-span-2 lg:col-span-3", // ¾
  4: "sm:col-span-2 lg:col-span-4", // Full
};
```
Gap: `gap-6` (24px).

### 3.3 Layout de página padrão (listagem/detalhe)

```tsx
<div className="space-y-6">
  <div className="flex flex-wrap items-center justify-between gap-4">
    {/* h1 + breadcrumb-texto à esquerda; toolbar de ações à direita, gap-2 */}
  </div>
  <div className="rounded-xl bg-white p-6 shadow-sm">
    {/* corpo da lista/detalhe + paginação (mt-4) */}
  </div>
</div>
```
- Ritmo vertical entre blocos: `space-y-6` (24px) nas páginas de listagem/detalhe; o Dashboard usa `space-y-8` (32px) — um nível a mais.
- Linha de cabeçalho: `flex flex-wrap items-center justify-between gap-4`.
- Grupo de botões de toolbar: `flex items-center gap-2`.
- Card de conteúdo: `rounded-xl bg-white p-6 shadow-sm` — mesma classe reaproveitada em praticamente toda seção de página de detalhe.

### 3.4 Border-radius (escala completa, do menor ao maior)

| Classe | px equiv. | Onde é usado |
|---|---|---|
| `rounded-sm` | 2px | Quadrado de legenda de gráfico |
| `rounded-md` | 6px | `DeltaBadge`, botões do `SegmentedControl`, itens de submenu da sidebar |
| `rounded-lg` | 8px | **Radius padrão de controle de UI**: `Button`, `Input`/`Select`/`Textarea`, `Switch`, `Pagination`, dropdowns, itens de navegação |
| `rounded-xl` | 12px | **Cards de conteúdo fora do dashboard** (`rounded-xl bg-white p-6 shadow-sm`), `Modal`, dropdowns de picker |
| `rounded-2xl` | 16px | **`DashboardCard`** (cards do dashboard) e KPI tiles — radius "premium" reservado ao dashboard |
| `rounded-full` | 9999px | Badges, avatares, dots de status, trilho/thumb de switch, botões circulares de ícone |

### 3.5 Sombras (box-shadow)

| Classe/valor | Onde |
|---|---|
| `shadow-sm` | Cards de conteúdo padrão (`rounded-xl ... shadow-sm`), campos de formulário |
| `shadow` (bare) | Thumb do `Switch` |
| `shadow-md` | Botão de recolher a sidebar |
| `shadow-lg` | Dropdowns/popovers (sort menu, user menu, pickers) |
| `shadow-xl` | Modal, Drawer, card de login, popover de filtro |
| `shadow-[0_1px_2px_rgba(16,26,48,0.05),0_8px_24px_-18px_rgba(16,26,48,0.25)]` | **Sombra oficial do `DashboardCard`** — duas camadas: contato justo (1px) + difusa (8px, spread negativo -18px), tingida de navy |
| `shadow-[0_1px_2px_rgba(16,26,48,0.05)]` | Versão single-layer da mesma sombra, usada nas KPI tiles |

### 3.6 Bordas

Largura padrão: `border` (1px) — não há uso de `border-2`/`border-4`. Cor: `border-navy-100` (light) sempre pareado com `dark:border-navy-700` (dark) — o par mais repetido do projeto (57 e 36 ocorrências respectivamente). Variantes suavizadas: `border-navy-100/70` / `dark:border-navy-700/70`.

### 3.7 Espaçamento — padrões observados

| Contexto | Valor |
|---|---|
| Entre seções de página | `space-y-6` (24px), Dashboard usa `space-y-8` (32px) |
| Padding de card de conteúdo | `p-6` (24px) |
| Padding de `DashboardCard` (header/footer) | `px-5 py-4` (header), `px-5 py-3` (footer) |
| Padding de campo de input/select/textarea | `px-3 py-2` |
| Padding de botão | `px-4 py-2` |
| Gap entre botões de toolbar | `gap-2` |
| Gap do grid do dashboard | `gap-6` (24px) |
| Gap interno de card (linhas/itens) | `gap-3` a `gap-3.5` |
| Padding de badge/pill | `px-2.5 py-1` |

### 3.8 Breakpoints usados

| Prefixo | Uso |
|---|---|
| `sm:` (640px) | O mais usado — grids de formulário (1→2/3 colunas), 2ª coluna do dashboard, revelar texto secundário, split de donuts |
| `md:` (768px) | Raro — só em `commercial-overview.tsx` para um split interno |
| `lg:` (1024px) | Grid de 4 colunas do dashboard |
| `xl:` / `2xl:` | **Não usados em nenhum lugar do projeto** |
| `@container` (container query) | **Único uso**: `flexitank-availability-grid.tsx` — `@container` no wrapper, `@lg:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-6` no grid interno, para reagir à largura do próprio card (não da viewport), já que o card pode ter ¼ a largura total via drag-resize do dashboard |

---

## 4. Navbar e Sidebar

> Não há "navbar" horizontal — a navegação principal é uma **sidebar vertical fixa** (`src/components/layout/sidebar.tsx`), com um menu de usuário (`src/components/layout/user-menu.tsx`) ancorado no rodapé dela.

### 4.1 Estrutura e dimensões

```tsx
<aside className="relative flex h-screen flex-shrink-0 flex-col bg-navy-900 text-navy-100 transition-[width] duration-200">
```
- Largura expandida: `w-64` (256px) · Largura recolhida: `w-[72px]`
- Transição de largura: `transition-[width] duration-200`
- Fundo: `bg-navy-900` (`#17233d`) · Texto padrão: `text-navy-100` (`#e7ebf2`)
- Persistência do estado recolhido: `localStorage["sidebar:collapsed"]` (string `"true"`/`"false"`)

**Botão de recolher** (flutua na borda direita da sidebar):
```
"absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-navy-100 bg-white text-navy-700 shadow-md hover:bg-navy-100 dark:border-navy-700 dark:bg-navy-800 dark:text-navy-100 dark:hover:bg-navy-700"
```
Círculo 24×24px, ícone `PanelLeftOpen`/`PanelLeftClose` (`size={14}`).

### 4.2 Logo

- Recolhido: badge quadrado `"flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-navy-900"` com a letra "C".
- Expandido: `<p className="text-xl font-bold text-white">columbus</p>` + `<p className="text-[10px] font-semibold tracking-wide text-navy-100/70">LOGÍSTICA INTERNACIONAL</p>`.

### 4.3 Navegação

**Link de topo (Dashboard, sem submenu):**
```
"flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium text-navy-100 hover:bg-navy-800"
ativo: "bg-navy-800 font-semibold text-white"  (pathname.startsWith)
```
Ícone `LayoutDashboard size={18}`.

**Botão de grupo** (Comercial, Pricing, Embarques, Inventário, Financeiro, Registros, Configurações):
```
"flex w-full items-center gap-3 rounded-lg py-2.5 text-sm font-medium text-navy-100 hover:bg-navy-800"
```
Ícone `size={18}` + label + chevron (`ChevronDown`/`ChevronRight`, `size={14}`) quando expandido.

**Submenu inline** (sidebar expandida, grupo aberto):
```
<ul className="mt-1 space-y-0.5 border-l border-navy-700 pl-6">
  item ativo:    "block rounded-md px-2 py-1.5 text-sm text-navy-100/90 hover:bg-navy-800 hover:text-white" + "bg-navy-800 font-semibold text-white"
  item sem href: "block cursor-not-allowed rounded-md px-2 py-1.5 text-sm text-navy-100/40"  (placeholder/desabilitado)
```

**Flyout colapsado** (sidebar recolhida, grupo clicado): painel `position: fixed` calculado a partir do `getBoundingClientRect()` do botão (`top: rect.top, left: rect.right + 8`):
```
"z-50 w-56 rounded-lg border border-navy-700 bg-navy-800 py-2 shadow-xl"
```
Cabeçalho do grupo: `"px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-navy-100/50"`. Itens: mesmo padrão do submenu inline, mas hover em `navy-700` (não `navy-800`) — ver inconsistência §20.

Fecha com clique fora ou `Escape`.

**Rodapé:** `<p className="px-5 pt-2 text-[10px] font-medium tracking-wide text-navy-100/40">Powered by CARGOFLOW</p>` (só visível expandida).

### 4.4 Dropdown do usuário (`UserMenu`)

Ancorado no fim da sidebar: `<div className="relative border-t border-navy-800 py-3">`.

**Trigger** (avatar + nome + chevron):
```
avatar: "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-navy-100 text-sm font-semibold text-navy-900"  (inicial maiúscula do nome)
nome:   "truncate text-sm font-semibold text-white"
email:  "truncate text-xs text-navy-100/60"
chevron: ChevronsUpDown size={14}, className="text-navy-100/60"
```

**Painel** (dois códigos separados — sidebar expandida vs. recolhida):
- Expandida: `"absolute inset-x-3 bottom-[calc(100%-0.25rem)] overflow-hidden rounded-lg border border-navy-700 bg-navy-800 shadow-lg"` — sem cabeçalho de nome/email (já visível no trigger).
- Recolhida: `"z-50 w-56 overflow-hidden rounded-lg border border-navy-700 bg-navy-800 shadow-xl"`, posicionado via `top: rect.top - 124, left: rect.right + 8`, **com** cabeçalho de nome/email no topo do painel.

**Itens do menu** (ordem fixa): **Meu Perfil → Dark Mode → Sair**
```
Meu Perfil: "flex w-full items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-navy-100 hover:bg-navy-700 hover:text-white"  (User icon, sem borda superior — é o primeiro)
Dark Mode:  mesma classe + "border-t border-navy-700"  (Moon icon + toggle, ver 4.5)
Sair:       mesma classe + "border-t border-navy-700"  (LogOut icon)
```
Divisores são `border-t` no próprio item, não um `<hr>` separado.

### 4.5 Toggle de Dark Mode (dentro do dropdown)

```tsx
<button role="menuitemcheckbox" aria-checked={enabled} className="...">
  <Moon size={16} />
  <span className="flex-1 text-left">Dark Mode</span>
  <span className={cn(
    "relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors",
    enabled ? "bg-status-lead" : "bg-navy-500/50"
  )}>
    <span className={cn(
      "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
      enabled ? "translate-x-4" : "translate-x-0.5"
    )} />
  </span>
</button>
```
Trilho 20×36px, thumb 16×16px branco. Ligado = `bg-status-lead` (`#2f6fed`), desligado = `bg-navy-500/50`. Clicar **não fecha** o menu (diferente de Meu Perfil/Sair).

### 4.6 Comportamento responsivo

Sidebar não tem breakpoint de colapso automático por viewport — o colapso é **manual** (botão) e persistido em `localStorage`. Não há um modo "gaveta mobile" (off-canvas) identificado no código para telas muito estreitas — a sidebar permanece como coluna fixa em qualquer largura de tela.

---

## 5. Cards

### 5.1 Card de dashboard — `DashboardCard` (componente compartilhado)

```tsx
// src/components/dashboard/dashboard-card.tsx
<section className="flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white dark:border-navy-700 dark:bg-navy-900
  shadow-[0_1px_2px_rgba(16,26,48,0.05),0_8px_24px_-18px_rgba(16,26,48,0.25)]">
  <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-navy-100 px-5 py-4 dark:border-navy-700">
    <div className="min-w-0">
      <h3 className="text-[15px] font-semibold tracking-tight text-navy-900 dark:text-navy-100">{title}</h3>
      <p className="text-[12.5px] text-navy-500 dark:text-navy-100/70">{subtitle}</p>
    </div>
    <div className="flex items-center gap-2.5">{actions}</div>
  </header>
  <div className="flex-1">{children}</div>
  <footer className="flex shrink-0 flex-wrap items-center gap-2 border-t border-navy-100 bg-navy-100/20 px-5 py-3 text-xs text-navy-500 dark:border-navy-700 dark:bg-navy-800/40 dark:text-navy-100/70">
    {footer}
  </footer>
</section>
```
- `h-full` + `flex flex-col` + corpo `flex-1`: garante que cards lado a lado na mesma linha do grid fiquem com **exatamente a mesma altura**, mesmo com conteúdo diferente.
- `header`/`footer` são `shrink-0` (nunca comprimem), só o corpo cresce.
- `actions` é o slot para `SegmentedControl`, legendas de gráfico etc.

### 5.2 KPI tile

```tsx
// kpi-strip.tsx
<div className="h-full rounded-2xl border border-navy-100 bg-white p-5 shadow-[0_1px_2px_rgba(16,26,48,0.05)] dark:border-navy-700 dark:bg-navy-900">
  <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-navy-100/70 text-navy-500 dark:bg-navy-800/60 dark:text-navy-100/70">
    <Icon size={17} />
  </span>
  <p className="flex items-baseline gap-2">
    <span className="text-[30px] font-bold leading-none tracking-[-0.035em] text-navy-900 dark:text-navy-100">{value}</span>
    <DeltaBadge value={delta} />
  </p>
  <p className="mt-1.5 text-[12.5px] text-navy-500 dark:text-navy-100/70">{label}</p>
</div>
```
Estrutura fixa: chip de ícone (36×36px) → número hero + badge de variação → label. Não usa `DashboardCard` (é mais simples/compacto, sem header/footer).

### 5.3 Card de conteúdo (fora do dashboard)

```tsx
<section className="rounded-xl bg-white p-6 shadow-sm">
  <div className="mb-4 flex items-center justify-between">
    <div className="flex items-center gap-2 border-l-4 border-navy-900 pl-3">
      <Icon size={16} className="text-navy-900" />
      <h2 className="text-base font-bold text-navy-900">{título da seção}</h2>
    </div>
    {canEdit && <EditButton />}
  </div>
  {/* conteúdo: DetailField em grid, ou formulário inline */}
</section>
```
Radius `rounded-xl` (menor que o `rounded-2xl` do dashboard) — **os cards fora do dashboard usam um radius e uma sombra ligeiramente diferentes dos cards do dashboard** (ver §20). Cabeçalho de seção com barra de destaque à esquerda (`border-l-4 border-navy-900 pl-3`) é exclusivo de páginas de detalhe.

### 5.4 Componentes auxiliares do card (todos em `dashboard-card.tsx`)

| Componente | Classes-chave |
|---|---|
| `SectionLabel` | `text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-500/70 dark:text-navy-100/50` |
| `DeltaBadge` | `rounded-md px-1.5 py-0.5 text-[11px] font-semibold`; positivo `bg-status-ativo/10 text-status-ativo` (`+N%`), negativo `bg-status-perdido/10 text-status-perdido` (`−N%`) |
| `MetricValue` | `font-bold leading-none`; `hero` = `text-[30px] tracking-[-0.035em]`, `table` = `text-[20px] tracking-[-0.03em]`; zero = `text-data-zero` |
| `SegmentedControl` | container `inline-flex gap-0.5 rounded-lg bg-navy-100/60 p-[3px]`; opção ativa `bg-white text-navy-900 shadow-sm`; inativa `text-navy-500 hover:text-navy-900` — "o único estilo de toggle do dashboard" (comentário original) |
| `ProportionBar` | trilho `bg-data-track`, preenchimento com cor sólida ou hachura `FORECAST_BAR` para valores previstos |

### 5.5 Estados e hover

- Cards em si **não têm hover** (não são clicáveis como um todo).
- Linhas/itens **dentro** de cards (linhas de legenda de donut, linhas de acquisition) têm hover: `hover:bg-[#f6f8fa]` (light) / `dark:hover:bg-navy-800/60` (dark).
- Estado vazio dentro de card: `rounded-lg bg-navy-100/40 px-3 py-3 text-[13px] text-navy-500` (ex.: "Nenhuma condição adicionada.").

---

## 6. Botões

Componente único: `src/components/ui/button.tsx`, 4 variantes.

```ts
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-navy-900 text-white hover:bg-navy-800 focus-visible:outline-navy-900",
  secondary:
    "bg-white text-navy-900 border border-navy-100 hover:bg-navy-100 focus-visible:outline-navy-500 dark:bg-navy-900 dark:text-navy-100 dark:border-navy-700 dark:hover:bg-navy-800",
  ghost:
    "bg-transparent text-navy-900 hover:bg-navy-100 dark:text-navy-100 dark:hover:bg-navy-800",
  danger:
    "bg-status-perdido text-white hover:opacity-90",
};

// base (sempre aplicada, antes da variante):
"inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors
 disabled:cursor-not-allowed disabled:opacity-50
 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
```

| Variante | Uso |
|---|---|
| **Primary** | Ação principal/confirmação (Salvar, Aplicar, Exportar) — fundo `navy-900` |
| **Secondary** | Ação secundária (Cancelar, ícones de toolbar — filtro/ordenar/exportar/personalizar) — fundo branco com borda |
| **Ghost** | Ação terciária/discreta (Cancelar dentro do modo de edição) — sem fundo |
| **Danger** | Ação destrutiva (excluir) — fundo `status-perdido` |

- Radius: `rounded-lg`. Padding: `px-4 py-2`. Tipografia: `text-sm font-medium`.
- Botão ícone-only: mesma base + `className="h-9 w-9 p-0"` ou `"h-10 w-10 p-0"` (ex.: filtro, personalizar, exportar, ordenar).
- **Estado disabled**: `disabled:cursor-not-allowed disabled:opacity-50` (mesmo para todas as variantes).
- **Estado loading**: não há um estado "loading" visual dedicado (spinner) — o padrão do projeto é **trocar o texto do botão** e usar `disabled`, ex.: `{saving ? "Salvando..." : "Salvar"}`.
- **Estado active/pressed**: não há classe `active:` explícita — apenas `hover:` e `focus-visible:`.
- Foco: contorno nativo do navegador (`outline`, não `ring` do Tailwind) — `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`, cor do outline por variante (`primary`→`outline-navy-900`, `secondary`→`outline-navy-500`; `ghost`/`danger` não definem cor específica).
- `dark:` só existe em `secondary` e `ghost` — `primary` e `danger` mantêm a mesma cor sólida nos dois temas (cores de destaque fixas, não fazem parte da inversão de tema).
- Ícones dentro de botões: `lucide-react`, tamanho `16` (padrão).

---

## 7. Inputs e filtros

### 7.1 Input, Select, Textarea (mesma "receita" de classes nos três)

```
"block w-full rounded-lg border border-navy-100 bg-white px-3 py-2 text-sm text-navy-900 shadow-sm
 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20
 disabled:bg-navy-100/50 disabled:text-navy-500
 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100 dark:disabled:bg-navy-800/50 dark:disabled:text-navy-100/50"
```
- `Input`/`Textarea` adicionam `placeholder:text-navy-500/60 dark:placeholder:text-navy-100/40`.
- `Textarea` não define estado `disabled` (única diferença).
- Foco: sem outline nativo (`focus:outline-none`), anel de 2px em `navy-500` a 20% de opacidade (`focus:ring-2 focus:ring-navy-500/20`) + borda muda para `navy-500`.
- **Não há estado de erro visual embutido no próprio Input** — mensagens de erro são renderizadas separadamente (ver §13, `WizardField`).

**`Select` deixou de ser um `<select>` nativo puro — agora é um combobox com busca integrada** (`src/components/ui/select.tsx`), mantendo a API (`{...register(...)}`, `value`/`onChange`, `defaultValue` via `FormData`) e a aparência fechada idênticas à receita acima:
- Fechado: `<button>` com as mesmas classes de Input/Select + label da opção selecionada (ou "Selecione" em `text-navy-500/60 dark:text-navy-100/40`) + ícone `ChevronDown` (`size={15}`) à direita.
- Aberto: painel `absolute` abaixo do botão (`rounded-lg border border-navy-100 bg-white shadow-lg dark:border-navy-700 dark:bg-navy-900`) com um campo de busca no topo (ícone `Search` + input sem borda própria, foco automático) e uma lista `role="listbox"` (`max-h-56 overflow-y-auto`) filtrada pelo texto digitado; opção destacada/selecionada em `bg-navy-100 dark:bg-navy-800`; sem resultado mostra "Nenhum resultado encontrado" (`text-navy-500 dark:text-navy-100/50`).
- Fecha com clique fora, `Escape` ou seleção; navegação por `↑`/`↓`/`Enter`.
- Por baixo, mantém um `<select>` nativo real oculto (`sr-only`, não `display:none`) recebendo todas as props originais — é isso que preserva `register()` do react-hook-form e a leitura via `FormData` nativo dos formulários que usam `<form action={...}>`, sem precisar mudar nenhum call site.
- Único `<select>` nativo que ficou de fora dessa troca: o seletor de itens por página em `pagination.tsx` (10/20/50/100) — não usa o componente `Select`, e busca não agrega valor a 4 opções fixas.

### 7.2 Label

```
"mb-1 block text-sm font-medium text-navy-900 dark:text-navy-100"
```
Campo obrigatório: `<span className="ml-0.5 text-status-perdido">*</span>` logo após o texto do label (padrão de `WizardField`).

### 7.3 Switch (toggle de formulário)

```tsx
// src/components/ui/switch.tsx
<label className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-navy-100 bg-navy-100/30 px-4 py-3 dark:border-navy-700 dark:bg-navy-800/40">
  <span>
    <span className="block text-sm font-medium text-navy-900 dark:text-navy-100">{label}</span>
    <span className="block text-xs text-navy-500 dark:text-navy-100/70">{description}</span>
  </span>
  <span className="relative mt-0.5 inline-flex h-5 w-9 flex-shrink-0 items-center">
    <input type="checkbox" className="peer sr-only" />
    <span className="absolute inset-0 rounded-full bg-navy-500/30 transition-colors
      peer-checked:bg-navy-900 peer-focus-visible:ring-2 peer-focus-visible:ring-navy-500/30
      dark:bg-navy-100/20 dark:peer-checked:bg-status-lead" />
    <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
  </span>
</label>
```
Este é o `Switch` "de formulário" (com label + descrição, dentro de uma caixa com borda) — **diferente** do toggle de Dark Mode no menu do usuário (que é inline, sem caixa). Ver §20.

### 7.4 Busca (SearchBar) — expansível

```tsx
// src/components/list/search-bar.tsx
<div className="flex h-9 items-center overflow-hidden rounded-lg border transition-all duration-300 ease-in-out
  {expanded ? "w-64 border-navy-100 bg-white dark:border-navy-700 dark:bg-navy-900" : "w-9 border-transparent bg-transparent"}">
  <button className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-100 hover:text-navy-900 dark:text-navy-100/70 dark:hover:bg-navy-800 dark:hover:text-navy-100">
    <Search size={16} />
  </button>
  <input className="w-full min-w-0 bg-transparent pr-3 text-sm text-navy-900 outline-none placeholder:text-navy-500/60 dark:text-navy-100 dark:placeholder:text-navy-100/40" />
</div>
```
Colapsado = ícone de 36×36px sem borda. Expande para 256px de largura ao clicar (`transition-all duration-300 ease-in-out`), foca o input. Colapsa de volta ao perder foco **somente se vazio**. `Escape` limpa e colapsa. Busca é debounced (300ms) e sincronizada com a URL (`?search=`, reseta `offset=0`).

### 7.5 Ordenação (SortMenu) — dropdown

```
trigger: Button variant="secondary" h-9 w-9 p-0, ícone ArrowUpDown
  ativo: "border-navy-900 text-navy-900 dark:border-navy-100 dark:text-navy-100"
painel: "absolute right-0 top-[calc(100%+0.5rem)] z-20 w-52 rounded-lg border border-navy-100 bg-white py-1 shadow-lg dark:border-navy-700 dark:bg-navy-900"
cabeçalho: "px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400" → "Ordenar por"
opção: "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-navy-50 dark:hover:bg-navy-800"
  ativa: "font-semibold text-navy-900 dark:text-navy-100" + ícone ArrowUp/ArrowDown conforme direção
```
Clicar no campo já ativo inverte a direção; clicar em campo novo define `asc`. Fecha em clique fora.

### 7.6 Filtros (Modal de filtro — padrão por página, ex. `flexitanks/_components/filter-modal.tsx`)

```
trigger: Button variant="secondary" h-9 w-9 p-0, ícone Filter, dentro de <div className="relative">
badge de contagem: "absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-navy-900 text-[10px] font-semibold text-white"
botão "Limpar" (só quando há filtro ativo): Button variant="ghost" className="h-9 px-2 text-xs"
```
Corpo do modal = componente `Modal` compartilhado + `<form className="space-y-4">`, um `<div>` por campo (`Label` + `Select`/`Input`), rodapé `flex justify-end gap-2 pt-2` com Cancelar (`secondary`)/Aplicar (`primary`, `type="submit"`). Estado sincronizado via query string, sempre resetando `offset=0`.

O **Filtro Inteligente Global** do Dashboard (`global-filter-button.tsx`) segue a mesma lógica de trigger+badge, mas em vez de `Modal` usa um **popover posicionado** (`absolute right-0 top-[calc(100%+8px)]`), permitindo múltiplas condições dinâmicas (campo + operador + valor) com conector E/OU.

### 7.7 Chips / Tags

Não há um componente `Chip` dedicado e reutilizável — o papel de "tag"/chip é preenchido pelos componentes de badge (§10) e por pills inline como o contador `+N esperados` (`rounded-md bg-status-lead/10 px-1.5 py-0.5 font-semibold text-status-lead`).

### 7.8 Date picker

Não há um componente de date picker customizado — os campos de data usam `<Input type="date" />` (input nativo do navegador), estilizado com as mesmas classes do Input padrão.

### 7.9 Checkbox / Radio button

Não há componentes `Checkbox`/`Radio` dedicados e estilizados no design system atual — o único controle binário estilizado é o `Switch` (toggle), reaproveitado onde uma escolha booleana é necessária. Inputs nativos `type="checkbox"` aparecem apenas como base funcional invisível (`sr-only`) por trás do `Switch`.

### 7.10 Estados

| Estado | Tratamento |
|---|---|
| Foco | `focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20` (Input/Select/Textarea) |
| Erro | Sem estilo de borda de erro embutido no campo; mensagem de erro exibida abaixo via `<p className="mt-1 text-xs text-status-perdido">` (`WizardField`) |
| Disabled | `disabled:bg-navy-100/50 disabled:text-navy-500` |
| Preenchido | Sem estilo visual diferenciado — mesma aparência de vazio/preenchido |

---

## 8. Tabelas

Duas visões coexistem por página de listagem: **cards** (linhas estilo card, padrão) e **lista/tabela** (`<table>` real), alternadas por `ViewToggle` (§ view-mode).

### 8.1 Modo "cards" (linha estilo card) — ex. `CustomerRow`

```
"grid grid-cols-[104px_2fr_1.5fr_1.5fr_auto] items-start gap-4 rounded-lg border-b border-navy-100 py-4 px-2 -mx-2 last:border-b-0 hover:bg-navy-50"
```
Colunas: badge de status (104px fixo) → identificação (nome + razão social + doc, truncados) → bloco de metadados 1 (2 colunas internas) → bloco de metadados 2 (2 colunas internas) → seta de navegação (`ChevronRight`, `rounded-full p-2 text-navy-700 hover:bg-navy-100`).

### 8.2 Modo "tabela" — ex. `CustomerTableView`

```
<table className="w-full text-left text-sm">
cabeçalho: "whitespace-nowrap py-2 pr-4 text-xs font-semibold uppercase tracking-wide text-navy-400"
linhas: divide-y divide-navy-100, hover:bg-navy-50
células: py-3 pr-4, truncamento via max-w-[Npx] truncate quando necessário
```
Alinhamento: esquerda por padrão; coluna de ação (seta) alinhada à direita.

### 8.3 Paginação

```
// src/components/ui/pagination.tsx
"flex items-center justify-end gap-3"
select de tamanho de página (10/20/50/100): "rounded-lg border border-navy-100 bg-white px-2 py-1.5 text-sm text-navy-900 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100"
botões prev/next: "rounded-lg border border-navy-100 p-2 text-navy-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-700 dark:text-navy-100"
contagem: "text-sm text-navy-500 dark:text-navy-100/70" → "{mostrados} de {total}"
```
Só renderizada quando há itens e não há busca ativa.

### 8.4 Ordenação e filtros

Ver §7.5/7.6 — não ficam embutidos na tabela, são controles de toolbar acima dela, sincronizados via query string (`sortBy`, `sortDir`, filtros específicos por página).

### 8.5 Estado vazio

Convenção padrão: `<p className="py-12 text-center text-navy-500">{mensagem}</p>` — grande espaçamento vertical, texto centralizado, sem ícone/ilustração. Mensagens reais encontradas:
- "Nenhum cliente cadastrado."
- "Nenhum lead cadastrado."
- "Nenhum flexitank localizado."
- "Nenhum item visível. Ajuste as opções de exibição."

### 8.6 Responsividade

Não foi identificado um padrão de "tabela vira cards no mobile" automático — a alternância cards/tabela é manual (toggle do usuário, persistido em `localStorage`), não reativa a breakpoint.

---

## 9. Gráficos e visualização de dados

Biblioteca: **recharts**. Todos os gráficos vivem em `src/app/(dashboard)/dashboard/_components/`.

### 9.1 Estilo compartilhado de gráfico de barras

```js
const LIGHT_TOOLTIP_STYLE = {
  borderRadius: 10,
  border: "1px solid #e7ebf2",
  boxShadow: "0 8px 24px -18px rgba(16,26,48,0.35)",
  fontSize: 12,
  background: "#ffffff",
  color: "#1b2436",
};
const DARK_TOOLTIP_STYLE = { ...LIGHT_TOOLTIP_STYLE, border: "1px solid #2a3b5c", background: "#17233d", color: "#e7ebf2" };
const LIGHT_AXIS_TICK = { fontSize: 11.5, fill: "#8c97ab" };
const DARK_AXIS_TICK  = { fontSize: 11.5, fill: "#8a94ab" };
const LIGHT_GRID_STROKE = "#f1f4f9";  const DARK_GRID_STROKE = "#22304d";
const LIGHT_AXIS_LINE   = "#e7ebf2";  const DARK_AXIS_LINE   = "#2a3b5c";
const LIGHT_CURSOR_FILL = "#f7f9fc";  const DARK_CURSOR_FILL = "#1e2c47";
```
- `<ResponsiveContainer width="100%" height={260}>` — **altura fixa de 260px** para todo gráfico de barras.
- `<CartesianGrid vertical={false} />` — só linhas horizontais.
- Eixos sem linha de tick (`tickLine={false}`), `YAxis` com `width={30}`, sem linha própria (`axisLine={false}`).
- Wrapper do gráfico: `"px-3 pb-2 pt-4"`.
- Como as cores do tooltip/eixo são objetos JS (não classes Tailwind), a alternância clara/escura é feita lendo `useTheme()` em tempo de render, não via CSS.

### 9.2 Barras — "Embarques nos últimos 12 meses"

Séries: `containers` (`DATA_COLORS[1]` = `#17233d`, mas **`#8a9cc2` no dark mode** — a cor original é navy-900 e "sumiria" sobre um card escuro), `bookings` (`#2f6fed`), `customers` (`#7ea3ee`). `barGap={3}`, cantos arredondados só no topo (`radius={[3,3,0,0]}`). Legenda no slot `actions` do card (dot 8×8px + label). Rodapé: `Pico em <b>{mês}</b> · <b>{containers}</b> containers`.

### 9.3 Barras empilhadas — "Perfil de cargas"

6 séries em rampa contínua do navy mais escuro ao azul mais claro:
```
light: #17233d → #2a3b5c → #47597a → #2f6fed → #7ea3ee → #c7d6f7
dark:  #64749c → #8494b8 → #a4b1d0 → #4f8cff → #94b6f5 → #c7d6f7 (última inalterada)
```
`stackId="cargo"` (barras empilhadas), só a última série do stack tem cantos arredondados. Legenda no slot `footer` (não `actions`).

### 9.4 Donut/Pizza — "Status dos embarques"

SVG manual (não `recharts`) — `viewBox="0 0 120 120"`, container rotacionado `-rotate-90` (arco começa às 12h):
```js
const RADIUS = 48, CIRCUMFERENCE = 2π×48, GAP = 3, STROKE = 15, STROKE_HOVER = 19;
```
- Círculo de trilho: `stroke = theme === "dark" ? "#28324a" : "#eef1f4"`.
- Cada arco: comprimento = `max(fração×circunferência − GAP, 1)` (o `GAP` cria a separação visual entre fatias); `strokeWidth` aumenta para `STROKE_HOVER` (19) no hover; opacidade cai para `0.28` nas fatias não-hover; transição `duration-200`.
- Cores das fatias: `SHIPMENT_STATUS_COLORS` (§1.8), fallback `#c7d0d9`.
- Label central: total (`text-[30px] font-bold leading-none tracking-[-0.02em]`) + caption uppercase (`text-[10px] uppercase tracking-[0.11em]`).
- Legenda: uma linha por status — dot 9×9px + nome + contagem (`tabular-nums`) + percentual em negrito; hover na linha destaca a fatia correspondente (estado compartilhado).
- Layout: dois donuts lado a lado (Bookings/Containers) com divisor vertical (desktop) ou horizontal (mobile).
- Estado sem dados: círculo cinza com texto "Sem dados" no centro.

### 9.5 Indicadores/tendência (mini-gráfico de barras verticais)

`commercial-overview.tsx` (`TrendBar`) — 3 barras verticais (mês anterior/atual/próximo) sem eixo nem grid, altura calculada em px (`max(6, round(valor/máximo × 56))`); mês passado = `bg-navy-100`/`dark:bg-navy-700`; mês atual = `bg-status-lead`; próximo mês (previsão) = hachura `FORECAST_BAR`.

### 9.6 Hachura de "valor previsto"

```js
export const FORECAST_BAR = "repeating-linear-gradient(135deg,#c7d6f7 0 5px,#e8effc 5px 10px)";
```
Padrão diagonal usado em toda barra/segmento que representa um valor futuro/projetado (nunca dado real) — convenção visual consistente entre `ProportionBar`, `TrendBar` e `period-cards.tsx`.

---

## 10. Status e badges

Todos em `src/components/ui/badge.tsx`. Forma compartilhada (repetida inline em cada função, não extraída):
```
"inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold"
```
Fórmula de cor: `bg-{token}/10 text-{token}` (fundo em 10% de opacidade + texto na cor sólida). Nenhum badge tem variante `dark:` própria — as opacidades já funcionam nos dois temas.

| Componente | Valor → classes |
|---|---|
| `StatusBadge` (empresas/clientes) | `Lead`→lead, `Prospecto`→prospecto, `Ativo`→ativo, `Inativo`→inativo, `Perdido`→perdido, `Incompleto` (default)→`bg-status-incompleto/15 text-navy-500` |
| `LeadStatusBadge` | `Novo` (default)→lead, `Contato`→warning, `Negociação`→orange, `Convertido`→ativo, `Perdido`→perdido |
| `UrgencyBadge` | `Baixo`→ativo, `Médio`→warning, `Alto`→orange, `Crítico`→perdido; fallback `bg-navy-100 text-navy-500` |
| `FlexitankStatusBadge` | `Available` (default)→ativo, `Used`→warning, `Waiting`→`bg-navy-500/10 text-navy-700`, `Damaged`→perdido; fallback `bg-navy-100 text-navy-500` |
| `FlexitankSizeBadge` | estilo único fixo `bg-status-lead/10 text-status-lead` (sem mapa) |
| `ScoreBadge` | estilo único fixo `bg-status-perdido/10 text-status-perdido`, texto `"Score {n}"` |

**Indicadores positivos/negativos (variação percentual)** — `DeltaBadge` (`dashboard-card.tsx`):
```
positivo: "bg-status-ativo/10 text-status-ativo"  → "+N%"
negativo: "bg-status-perdido/10 text-status-perdido" → "−N%"  (usa o caractere "−", não hífen)
```
Mesma lógica de cor (verde=alta/vermelho=queda) reaparece em `commercial-overview.tsx` com símbolos `▲`/`▼` no lugar do sinal.

---

## 11. Modais, drawers e menus

### 11.1 Modal (`src/components/ui/modal.tsx`)

```
overlay: "fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 p-4"
painel:  "w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-navy-900"
header:  "mb-4 flex items-center justify-between" → título text-lg font-bold + botão fechar (X, rounded-full p-1)
```
- Centralizado na tela, largura máx. `32rem` (512px).
- Sem slot de footer dedicado — footer é parte do `children`, estilizado ad hoc pelo chamador.
- Sem wrapper de scroll dedicado — o painel cresce com o conteúdo.
- Fecha com `Escape` ou clique no X. **Não fecha ao clicar no overlay** (sem handler de clique no overlay).
- Renderizado via `createPortal(..., document.body)`.
- Sem animação de entrada/saída — aparece/desaparece instantaneamente (`open ? conteúdo : null`).

### 11.2 Drawer (`src/components/ui/drawer.tsx`)

```
overlay: "fixed inset-0 z-50 flex justify-end bg-navy-950/40"   (mesma cor do Modal, alinhado à direita)
painel:  "flex h-full w-full flex-col bg-white shadow-xl dark:bg-navy-900" + widthClassName (padrão "max-w-xl")
header:  "flex items-start gap-3 border-b border-navy-100 px-6 py-5 dark:border-navy-700"
         ícone opcional: caixa 40×40px "rounded-xl bg-navy-900/5 text-navy-900"
corpo:   "flex-1 overflow-y-auto px-6 py-5"   (scroll independente)
footer:  "border-t border-navy-100 px-6 py-4 dark:border-navy-700"   (opcional)
```
- Ocupa a altura inteira da tela, entra pela direita (`justify-end` no overlay).
- Slot extra `headerExtra` entre o header e o corpo (sem estilo próprio).
- Mesmo mecanismo de fechamento do Modal (`Escape`, botão X — `p-2` em vez de `p-1`).
- **Sem animação de slide** — o componente monta/desmonta (não há `transform`/`transition` de entrada).

### 11.3 Diferenças Modal vs. Drawer

| Aspecto | Modal | Drawer |
|---|---|---|
| Posição | Centralizado | Ancorado à direita, altura total |
| Tamanho | `max-w-lg`, altura pelo conteúdo | `max-w-xl` (customizável), sempre `h-full` |
| Padding | Único `p-6` | Header/corpo/footer com paddings próprios |
| Radius | `rounded-xl` | Sem radius (encosta na borda da tela) |
| Scroll | Não gerenciado (painel cresce) | Corpo com `overflow-y-auto` dedicado |
| Ícone no header | Não tem | Slot opcional com caixa 40×40px |
| Footer | Não tem slot próprio | Slot dedicado com borda superior |

### 11.4 Dropdowns/menus de popover (padrão comum a `SortMenu`, `UserMenu`, pickers)

```
painel: rounded-lg (ou rounded-xl para o filtro global), border border-navy-100, bg-white, shadow-lg (ou shadow-xl), dark:border-navy-700 dark:bg-navy-900
```
Todos fecham com clique-fora (`mousedown` no `document`, checando `ref.contains`) e a maioria também com `Escape`. Nenhum usa uma lib de popover (Radix/Headless UI) — todos são implementados à mão com `useState` + `useRef` + listener de `mousedown`.

---

## 12. Feedbacks

### 12.1 Toasts

```tsx
// src/app/layout.tsx
<Toaster richColors position="top-right" />
```
Biblioteca `sonner`, montado uma vez na raiz, dentro do `ThemeProvider`. Convenção de uso:
```js
toast.success("Cliente adicionado com sucesso.");
toast.error(body?.message ?? "Erro ao adicionar cliente. Tente novamente.");
toast.info("Meu Perfil estará disponível em breve."); // único uso de .info no projeto
```
Padrão: sucesso = mensagem de confirmação fixa; erro = mensagem vinda da API (`body?.message`) com fallback fixo em português.

### 12.2 Loading / Skeleton

**Não existe nenhum componente de skeleton/shimmer no projeto** (nenhuma ocorrência de "skeleton" ou `animate-pulse` em todo o `src/`). Estados de carregamento são tratados apenas trocando o texto de um botão + `disabled`, ex.: `{saving ? "Salvando..." : "Salvar"}`. **Isso é um vazio no design system atual**, não um padrão a ser replicado como "ausência de loading" — ver §20.

### 12.3 Empty states

Padrão de lista/tabela: `<p className="py-12 text-center text-navy-500">{mensagem}</p>`. Padrão contextual (dentro de um card/painel menor): `rounded-lg bg-navy-100/40 px-3 py-3 text-[13px] text-navy-500` (ex.: filtro sem condições, disponibilidade de flexitank vazia). Nenhum ilustração/ícone é usado em empty states — só texto.

### 12.4 Confirmações

Ações destrutivas (ex. deletar lead) usam um **Modal** de confirmação dedicado (`delete-lead-modal.tsx`), não um `window.confirm()` nativo nem um toast de "desfazer".

### 12.5 Mensagens de validação/erro de formulário

Ver §13 — texto `text-xs text-status-perdido` abaixo do campo (`WizardField`).

---

## 13. Formulários

### 13.1 Labels e campo obrigatório

```tsx
<Label htmlFor={id}>{label}{required && <span className="ml-0.5 text-status-perdido">*</span>}</Label>
```

### 13.2 Mensagens de erro

```tsx
{error && <p className="mt-1 text-xs text-status-perdido">{error}</p>}
```
(`WizardField`, `src/components/ui/wizard.tsx`) — texto vermelho pequeno logo abaixo do campo, sem alterar a borda do input.

### 13.3 Organização de campos

- Formulários simples (filtros, exportação): `<form className="space-y-4">`, um `<div>` por campo.
- Formulários maiores/multi-etapa (criar lead, criar cliente): componentizados como **`Wizard`** com `Stepper` (indicador de progresso) + `WizardSection` (agrupador com ícone+título) + `WizardField` (label+erro+campo).
- Grids de campo responsivos: `grid gap-4 sm:grid-cols-2` (ou `sm:grid-cols-3`), com `sm:col-span-2` em campos que devem ocupar a linha inteira (padrão repetido em praticamente todo formulário/drawer de criação/edição).

### 13.4 Stepper (Wizard multi-etapa)

```
wrapper: "border-b border-navy-100 bg-navy-100/20 px-6 py-4 dark:border-navy-700 dark:bg-navy-800/40"
círculo do passo (32×32px): concluído/ativo → "bg-navy-900 text-white"; ativo também ganha "ring-4 ring-navy-900/15"; pendente → "border border-navy-200 bg-white text-navy-400"
linha conectora: "mx-2 h-px flex-1 translate-y-[-10px]", bg-navy-900 (concluído) ou bg-navy-200 (pendente)
```
Conteúdo do círculo: ícone `Check` (concluído) ou número do passo.

### 13.5 Botões de formulário

Rodapé padrão: `<div className="flex justify-end gap-2 pt-2">` — Cancelar (`variant="secondary"`, `type="button"`) à esquerda, ação principal (`type="submit"`, `variant="primary"` implícito) à direita.

### 13.6 Espaçamento

`space-y-4` (16px) entre campos dentro de um formulário simples; `gap-4` em grids de campo; `py-4`/`px-6` no header do Stepper.

---

## 14. Páginas

### 14.1 Página de Dashboard

```
<DashboardCustomizerProvider>
  <div className="space-y-8">
    <header: h1 "Dashboard" + toolbar (Personalizar, Filtros) à direita>
    <DashboardWidgetGrid>  {/* grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 */}
      {/* KPI tiles, DashboardCards com gráficos/tabelas, em qualquer ordem/tamanho definidos pelo usuário */}
    </DashboardWidgetGrid>
  </div>
</DashboardCustomizerProvider>
```
Características únicas desta página: (1) grid de widgets reordenável/redimensionável/ocultável via drag-and-drop (`@dnd-kit`), persistido por usuário no banco; (2) um Filtro Inteligente Global (popover com condições dinâmicas campo+operador+valor, conector E/OU) que filtra todos os widgets de uma vez, com auto-ocultação de cards sem resultado; (3) `space-y-8` em vez do `space-y-6` das demais páginas.

### 14.2 Página de listagem

```
<div className="space-y-6">
  <header: h1 + "Home > Seção" (texto, não breadcrumb component) | toolbar: Search, Sort, Filter, Export, ViewToggle, Criar (Drawer)>
  {opcional: SummarySection — KPIs/contadores do módulo}
  <div className="rounded-xl bg-white p-6 shadow-sm">
    <ListBody>  {/* alterna entre visão "cards" (linhas) e "lista" (table), via ViewToggle */}
    <Pagination />  {/* mt-4, só se houver itens e nenhuma busca ativa */}
  </div>
</div>
```
Exemplos: `clientes/page.tsx`, `leads/page.tsx`, `flexitanks/page.tsx` — estrutura idêntica nos três.

### 14.3 Página de detalhes

```
<div className="space-y-6">
  <p>"{Seção} > Detalhes"</p>  {/* breadcrumb-texto */}
  <header className="flex items-start justify-between gap-4">
    {avatar 56×56px + nome text-2xl + StatusPicker}  |  {botão de excluir, se permitido}
  </header>
  <section className="rounded-xl bg-white p-6 shadow-sm">  {/* seção 1: identificação/localização */}
  <section className="rounded-xl bg-white p-6 shadow-sm">  {/* seção 2: perfil comercial/observações */}
  <Link>← Voltar para a lista</Link>
</div>
```
Cada seção alterna entre um componente "View" (somente leitura, grid de `DetailField`) e um componente "Form" (edição inline) via estado local `editing` — **não usa Modal/Drawer para editar, a edição acontece no lugar**. Não há tabs nesta página — é uma pilha vertical de seções.

### 14.4 Página de formulário (criação)

Criação de registros usa **Drawer** (não uma rota de página dedicada) — ex. `CreateCustomerDrawer`, `CreateLeadDrawer`, `TransferDrawer` — abertos a partir do botão "+ Novo"/"+ Transferir" na toolbar da listagem. Estrutura interna: `Wizard` (Stepper + seções) quando o formulário é longo, ou formulário simples de uma etapa quando curto.

### 14.5 Página de configurações

**Não identificada como implementada** — os itens do grupo "Configurações" na sidebar (Usuários, Auditoria, Relatar Erro) não têm `href` (são placeholders desabilitados, `cursor-not-allowed`). Não há, portanto, um padrão estrutural de página de configurações a documentar a partir do código atual.

### 14.6 Página de login

```tsx
<div>{/* tela cheia, centralizado */}
  <div className="w-full max-w-sm rounded-2xl bg-white p-... shadow-xl">
    {/* logo, título, LoginForm: email + senha via react-hook-form + zod, Button primary full-width */}
  </div>
</div>
```

---

## 15. Responsividade

| Breakpoint | Comportamento geral |
|---|---|
| **Mobile** (< 640px, sem prefixo) | Layout de 1 coluna em todo grid (dashboard e formulários); sidebar permanece fixa (sem modo gaveta identificado); texto secundário oculto em alguns lugares (`sm:inline` só aparece a partir do próximo breakpoint) |
| **Tablet `sm:` (≥640px)** | Formulários passam a 2–3 colunas; dashboard passa a 2 colunas; donuts de status ficam lado a lado; revela texto/colunas secundárias |
| **Desktop `lg:` (≥1024px)** | Dashboard passa a 4 colunas — único breakpoint que usa `lg:` no projeto |
| **`md:` (≥768px)** | Uso raro e pontual (só em `commercial-overview.tsx`) |
| **`xl:`/`2xl:`** | Não usados em nenhum lugar |
| **Container queries (`@container`)** | Único uso: grid de tamanhos de flexitank, que reage à largura do **card**, não da viewport (necessário porque o card pode ter de ¼ a 100% da largura via drag-resize do dashboard) |

Não há um menu mobile "hambúrguer" — a sidebar (fixa, recolhível manualmente) é o único padrão de navegação em qualquer tamanho de tela encontrado no código.

---

## 16. Ícones

- **Biblioteca**: `lucide-react` (única biblioteca de ícones do projeto).
- **Tamanhos em uso**: `13`, `14`, `15`, `16`, `17`, `18` — nunca abaixo de 13 nem acima de 18 em UI de interface (donuts/avatares usam dimensões próprias em px, não ícones).

| Tamanho | Contexto típico |
|---|---|
| `13` | Ícone de copiar (`CopyButton`) |
| `14` | Ícones pequenos: chevron, X de fechar (Modal), grip de arrastar, setas de ordenação |
| `15` | Ícone de `WizardSection`, ícones de view toggle |
| `16` | **Tamanho padrão** — ícones de botão, itens de menu, toolbar (Filter, Search, ArrowUpDown, FileDown, Moon, User, LogOut) |
| `17` | Ícone dentro do chip de KPI tile |
| `18` | Ícone de navegação da sidebar, X de fechar (Drawer) |

- **Cor**: sempre herdada do texto do elemento pai (`text-navy-500`, `text-navy-100` etc.) — nenhum ícone tem cor fixa própria, exceto quando dentro de um badge/status (herda a cor do status).
- **Onde usar**: à esquerda do texto em botões e itens de menu (`gap-2` a `gap-2.5`); sozinho em botões icon-only (`h-9 w-9 p-0` / `h-10 w-10 p-0`); dentro de chips coloridos (KPI, drawer header) como elemento decorativo de 36–40px.

---

## 17. Animações e interações

O projeto **não usa nenhuma biblioteca de animação** (sem Framer Motion/GSAP) — todas as transições são CSS puro via utilitários Tailwind, e o drag-and-drop usa `@dnd-kit`.

| Interação | Implementação |
|---|---|
| Hover em botões/links | `transition-colors` (cor de fundo/texto) |
| Colapso/expansão da sidebar | `transition-[width] duration-200` |
| Expansão da busca | `transition-all duration-300 ease-in-out` |
| Toggle do Switch (thumb) | `transition-transform` (translate-x) |
| Toggle do Switch (trilho) | `transition-colors` |
| Hover no donut (fatia) | `transition-[opacity,stroke-width] duration-200` — engrossa o traço e destaca a fatia, esmaece as demais (`opacity-0.28`) |
| Ring de foco em inputs | Instantâneo (`focus:ring-2`, sem transição declarada) |
| Modal/Drawer abrir/fechar | **Sem transição** — monta/desmonta instantaneamente |
| Dropdowns/popovers abrir/fechar | **Sem transição** — aparecem/desaparecem instantaneamente |
| Drag-and-drop de widgets (dashboard) | `@dnd-kit/core` + `@dnd-kit/sortable`, `PointerSensor` com `activationConstraint: { distance: 5 }` (evita arrastar sem querer), widget arrastado ganha `opacity-90` e `z-20` |
| Gráficos (recharts) | Animação padrão do recharts na primeira renderização (barras "crescem"); sem configuração customizada de duração |

**Microinterações identificadas:**
- Hover em linha de tabela/card: muda o fundo (`hover:bg-navy-50`/`hover:bg-navy-800`).
- Hover em linha de legenda do donut: destaca a fatia correspondente no SVG (interação cruzada entre dois elementos, via estado React compartilhado).
- Botão "Personalizar"/"Filtros": muda de `secondary` para `primary` quando ativo (indicação de estado, não uma animação).

---

## 18. Dark Mode

### 18.1 Arquitetura

- **Estratégia**: por classe (`.dark` em `<html>`), habilitada via `@custom-variant dark (&:where(.dark, .dark *));` em `globals.css` (Tailwind v4) — **não** é `prefers-color-scheme`.
- **Provider**: `src/components/theme/theme-provider.tsx` — contexto React (`ThemeContext`/`useTheme()`), estado `"light" | "dark"`.
- **Persistência**: `localStorage["theme"]` — mesmo padrão de outras preferências de UI do projeto (`ViewModeProvider`, `sidebar:collapsed`).
- **Anti-flash**: um `<script>` inline em `src/app/layout.tsx` roda antes da hidratação, lê o `localStorage` e aplica `.dark` no `<html>` de imediato; o React em si sempre inicia assumindo `"light"` (igual ao servidor) e corrige via `useEffect` logo após montar — evita tanto o flash de tela clara quanto um erro de hidratação (componentes que calculam cor via JS, como os gráficos, precisam bater exatamente com o HTML gerado pelo servidor no primeiro render).
- `<html suppressHydrationWarning>` — necessário porque a classe `.dark` é aplicada por script fora do ciclo do React.

### 18.2 O que muda entre os temas

Os tokens de marca (`navy-*`, `status-*`, `data-*`) **não são redefinidos** sob `.dark` — eles servem como cor de destaque fixa em muitos lugares (sidebar, botão primário, badges) e inverter o valor quebraria esses usos. Só `--background`/`--foreground` têm valor próprio em `.dark`:

```css
:root { --background: #f4f6fa; --foreground: #1b2436; }
.dark { --background: #0d1424; --foreground: #e7ebf2; }
```

Todo o resto do dark mode é feito com classes `dark:` pontuais, reaproveitando a própria escala `navy-*` em novos papéis:

| Papel (light) | Equivalente `dark:` |
|---|---|
| `bg-white` (superfície de card) | `dark:bg-navy-900` |
| `text-navy-900` (título) | `dark:text-navy-100` |
| `text-navy-500` (texto secundário) | `dark:text-navy-100/70` (ou `/50`, `/40` para variações mais apagadas) |
| `border-navy-100` (borda de card) | `dark:border-navy-700` |
| `bg-navy-100/XX` (fundo sutil interno) | `dark:bg-navy-800/60` (ou `/40`) |

Esse par (`text-navy-100` sobre `bg-navy-900`) é **o mesmo par que a sidebar já usa nativamente em ambos os temas** — o dark mode do resto do sistema foi desenhado para ficar visualmente coerente com o "chrome" escuro que já existia.

### 18.3 Componentes afetados

- **Cobertura completa**: menu do usuário/sidebar (já eram escuros por padrão), todos os componentes de `src/components/ui/*`, `src/components/list/*`, 100% do Dashboard (cards, KPIs, gráficos, donut, filtro, modo de personalização), a tela de login, e as três áreas de produto implementadas — Clientes, Leads e Flexitanks (listagem em cards, listagem em tabela, páginas de detalhe, drawers de criação, modais de filtro/exclusão, pickers de status/urgência/score). As demais entradas do menu (Contatos, Oportunidades, Pricing, Embarques, Financeiro, Registros, Configurações) não têm página implementada — não há o que aplicar tema nelas ainda.
- **Casos especiais**: gráficos recharts (cores via JS, não CSS — usam `useTheme()` para escolher entre conjuntos de cor `LIGHT_*`/`DARK_*`); séries de gráfico que eram navy-900 (invisíveis num card escuro) ganharam uma versão clareada só para o tema escuro (ver §9.2/9.3); SVG do donut usa uma cor de trilho calculada em JS (`#eef1f4` claro / `#28324a` escuro); a barra de destaque `border-l-4 border-navy-900` nos cabeçalhos de seção de página de detalhe (§5.3) precisou de `dark:border-navy-100` — sem isso ela some por ficar da mesma cor do card escuro atrás dela.

### 18.4 Persistência e comportamento

- Alternado pelo item **Dark Mode** no dropdown do usuário (§4.5) — não fecha o menu ao clicar.
- Persiste em `localStorage`, sobrevive a refresh e a fechar/reabrir o navegador (mesmo dispositivo/navegador — não é uma preferência por conta de usuário no banco).
- Ao ativar/desativar, a mudança é instantânea em toda a tela (troca de classe no `<html>`), sem transição animada.

---

## 19. Design Tokens (consolidado)

```css
/* ============ COLORS ============ */
--color-background:        #f4f6fa;   /* dark: #0d1424 */
--color-foreground:        #1b2436;   /* dark: #e7ebf2 */

--color-navy-950:          #101a30;
--color-navy-900:          #17233d;   /* marca principal */
--color-navy-800:          #1e2c47;
--color-navy-700:          #2a3b5c;
--color-navy-500:          #47597a;
--color-navy-100:          #e7ebf2;

--color-status-lead:       #2f6fed;   /* azul — interativo/primário */
--color-status-prospecto:  #a35de0;   /* roxo */
--color-status-ativo:      #1fa971;   /* verde — sucesso/positivo */
--color-status-inativo:    #7a8699;   /* cinza */
--color-status-perdido:    #e0473f;   /* vermelho — erro/negativo */
--color-status-incompleto: #b1b1b1;   /* cinza claro */
--color-status-warning:    #d97706;   /* âmbar — alerta */
--color-status-orange:     #ea580c;   /* laranja */

--color-data-1:            #2f6fed;   /* série de gráfico 1 */
--color-data-2:            #17233d;   /* série de gráfico 2 */
--color-data-3:            #7ea3ee;   /* série de gráfico 3 */
--color-data-4:            #47597a;   /* série de gráfico 4 */
--color-data-5:            #c7d6f7;   /* série de gráfico 5 */
--color-data-track:        #f1f4f9;   /* trilho de progresso */
--color-data-zero:         #ccd3e0;   /* texto de valor zero */

/* ============ TYPOGRAPHY ============ */
--font-sans: "Geist", sans-serif;      /* via next/font/google */
--font-mono: "Geist Mono", monospace;

--text-hero-kpi:     30px / leading-none / tracking -0.035em / font-bold;
--text-hero-xl:      54px / leading-0.9  / tracking -0.04em  / font-bold;
--text-title-page:   24px (text-2xl) / font-bold;
--text-title-card:   15px / tracking-tight / font-semibold;
--text-title-section: 16px (text-base) / font-bold;
--text-body:         14px (text-sm);
--text-caption:      12.5px;
--text-eyebrow:      11px / uppercase / tracking 0.1em / font-semibold;
--text-micro:        10px;

/* ============ SPACING ============ */
--space-page-gap:    24px (space-y-6);      /* entre blocos de página */
--space-dashboard-gap: 32px (space-y-8);    /* dashboard usa um nível a mais */
--space-card-padding: 24px (p-6);           /* cards de conteúdo */
--space-widget-header: 20px 16px (px-5 py-4); /* header do DashboardCard */
--space-field-padding: 12px 8px (px-3 py-2);  /* inputs */
--space-button-padding: 16px 8px (px-4 py-2); /* botões */
--space-grid-gap:    24px (gap-6);           /* grid do dashboard */

/* ============ BORDER RADIUS ============ */
--radius-sm:    2px;   /* rounded-sm  — swatches de legenda */
--radius-md:    6px;   /* rounded-md  — badges de delta, segmented control */
--radius-lg:    8px;   /* rounded-lg  — botões, inputs, dropdowns */
--radius-xl:    12px;  /* rounded-xl  — cards fora do dashboard, modal */
--radius-2xl:   16px;  /* rounded-2xl — cards do dashboard, KPI tiles */
--radius-full:  9999px; /* rounded-full — badges, avatares, pills */

/* ============ SHADOWS ============ */
--shadow-card-content: 0 1px 2px 0 rgb(0 0 0 / 0.05);                                  /* shadow-sm */
--shadow-dropdown:     0 10px 15px -3px rgb(0 0 0 / 0.1);                              /* shadow-lg */
--shadow-modal:        0 20px 25px -5px rgb(0 0 0 / 0.1);                              /* shadow-xl */
--shadow-dashboard-card: 0 1px 2px rgba(16,26,48,.05), 0 8px 24px -18px rgba(16,26,48,.25);
--shadow-kpi-tile:     0 1px 2px rgba(16,26,48,.05);

/* ============ SIZES ============ */
--size-sidebar-expanded:  256px (w-64);
--size-sidebar-collapsed: 72px (w-[72px]);
--size-icon-btn-sm:       36px (h-9 w-9);
--size-icon-btn-md:       40px (h-10 w-10);
--size-avatar-sm:         32px (h-8 w-8);
--size-avatar-lg:         56px (h-14 w-14);
--size-donut:             148px;
--size-toggle-track:      20px x 36px (h-5 w-9);
--size-toggle-thumb:      16px (h-4 w-4);
--size-chart-height:      260px;

/* ============ BREAKPOINTS ============ */
--breakpoint-sm:  640px;   /* mais usado: forms 1→2/3 col, dashboard 1→2 col */
--breakpoint-md:  768px;   /* raro, uso pontual */
--breakpoint-lg:  1024px;  /* dashboard 2→4 col */
/* xl (1280px) e 2xl (1536px) não são usados no projeto */
/* @container queries: único uso no grid de tamanhos de flexitank */

/* ============ TRANSITIONS ============ */
--transition-colors:  color/background-color/border-color 150ms (Tailwind default), classe `transition-colors`;
--transition-sidebar: width 200ms, classe `transition-[width] duration-200`;
--transition-search:  all 300ms ease-in-out, classe `transition-all duration-300 ease-in-out`;
--transition-donut:   opacity+stroke-width 200ms, classe `transition-[opacity,stroke-width] duration-200`;
--transition-toggle:  transform (Tailwind default), classe `transition-transform`;
```

---

## 20. Inconsistências identificadas

Documentadas conforme encontradas — **nenhuma foi corrigida**, ficam registradas para quem for construir o novo sistema decidir conscientemente o que herdar.

1. **Tokens `navy-*` referenciados mas nunca definidos.** O código usa `navy-50`, `navy-200`, `navy-300`, `navy-400`, `navy-600` em vários lugares (`wizard.tsx`, `sort-menu.tsx`, `badge.tsx` fallback, `detail-field.tsx`, `copy-button.tsx`, tabelas), mas só `navy-100/500/700/800/900/950` existem como CSS custom properties. Essas classes não têm garantia de estilo no build atual.
2. **Componente órfão com paleta paralela.** `src/components/dashboard/status-embarques-card.tsx` não é importado em lugar nenhum, mas contém uma paleta de cores totalmente hardcoded e divergente da paleta de tokens (`#10202f`, `#8b9aa8`, `#199BDC` etc.) — não deve ser tratado como fonte de verdade; o componente vivo equivalente é `status-shipments-panel.tsx`.
3. **Radius e sombra diferentes entre "card de dashboard" e "card de conteúdo".** `DashboardCard` usa `rounded-2xl` + sombra de duas camadas com spread negativo; cards de página (Clientes/Leads/detalhe) usam `rounded-xl` + `shadow-sm` simples. Não há um único "Card" universal no sistema — são duas famílias visuais paralelas.
4. **Hover diferente entre o submenu inline e o flyout colapsado da sidebar**, ambos supostamente o "mesmo" menu: um usa `hover:bg-navy-800`, o outro `hover:bg-navy-700`.
5. **Dois componentes de "toggle" com desenhos diferentes**: o `Switch` de formulário (`src/components/ui/switch.tsx`, dentro de uma caixa com borda e label+descrição) e o toggle inline do Dark Mode no menu do usuário (sem caixa, cores diferentes no estado ligado — `bg-navy-900` vs. `bg-status-lead`). Ambos são "switches", mas não compartilham código.
6. **Ausência de skeleton/loading component.** Não existe um padrão de carregamento assíncrono visual (skeleton, spinner) — todo feedback de carregamento é textual (`"Salvando..."` + `disabled`). Um novo sistema precisará decidir esse padrão do zero.
7. **Ausência de Checkbox/Radio/DatePicker dedicados.** O sistema resolve esses casos com `<input type="date">` nativo e reaproveitando o `Switch` — não há componentes próprios para múltipla escolha ou seleção binária simples fora do contexto de "liga/desliga uma preferência".
8. **`text-[30px]` usado com dois trackings diferentes** para o mesmo papel de "número hero" (`-0.035em` nas KPI tiles/`MetricValue`, `-0.02em` no total do donut) — provavelmente não intencional, mas ambos em uso ativo.
9. **`md:` é usado uma única vez** (`commercial-overview.tsx`) em um projeto que majoritariamente pula de `sm:` para `lg:` — não está claro se é um padrão deliberado de 3 tiers ou um esquecimento.

---

## 21. Regras para o novo sistema

Instruções objetivas para quem for construir uma nova interface usando este documento como referência obrigatória.

1. **Use os tokens de cor exatamente como estão na seção 19** — não crie novos tons de azul/verde/vermelho para os mesmos papéis semânticos (interativo, sucesso, erro, alerta). Se precisar de um tom que não existe (ex. `navy-200`), decida e documente o valor antes de usar — não deixe a classe "flutuando" sem CSS var por trás, como acontece hoje (ver inconsistência #1).
2. **Separe cor de "destaque fixo" de cor de "conteúdo invertível" desde o início.** A cor de marca (`navy-900`) tem dois papéis no sistema atual (fundo de sidebar/botão, sempre escuro, e texto de título, que precisa inverter no dark mode) — se for reconstruir do zero, use tokens semânticos distintos (`--color-brand` vs. `--color-text-heading`) para não repetir a limitação que impediu este projeto de simplesmente inverter uma variável para o dark mode.
3. **Tipografia**: use Geist Sans como fonte padrão. Números/KPIs sempre `font-bold leading-none` com tracking negativo proporcional ao tamanho; eyebrows/labels sempre `uppercase text-[11px] font-semibold tracking-[0.1em]`; corpo de UI em `text-sm`.
4. **Todo card de "widget" (dashboard) usa `rounded-2xl` + a sombra de duas camadas da seção 19; todo card de "conteúdo de página" usa `rounded-xl` + `shadow-sm`.** Mantenha essa distinção de duas famílias de card — não as unifique sem necessidade, mas também não crie uma terceira variante sem justificar.
5. **Um `DashboardCard`/`Card` compartilhado deve sempre usar `h-full flex flex-col` com o corpo em `flex-1`**, para que cards lado a lado no mesmo grid tenham automaticamente a mesma altura — isso já é assim no projeto atual e deve ser preservado.
6. **Botões seguem 4 variantes fixas** (primary/secondary/ghost/danger) com uma única base de classes (radius `rounded-lg`, padding `px-4 py-2`, `text-sm font-medium`). Não crie uma 5ª variante sem uma necessidade de produto clara — o sistema atual resolve praticamente tudo com essas 4.
7. **Inputs, selects e textareas compartilham a mesma "receita" de classes** (borda, radius, padding, foco, disabled) — trate-os como uma única família de "campo de formulário", não como três componentes com estilos independentes.
8. **Badges/status sempre usam a fórmula `bg-{cor}/10 text-{cor}` em formato pill (`rounded-full px-2.5 py-1 text-xs font-semibold`).** Nunca use fundo sólido com texto branco para badges de status (reserve isso para botões `danger`/`primary`).
9. **Gráficos**: altura fixa de 260px para gráficos de barra, `CartesianGrid` só horizontal, sem linha de eixo com tick marks, tooltip com `borderRadius: 10`. Cores de série sempre vêm da escala `data-1..5` na ordem definida — nunca reutilize verde/laranja/vermelho de status como cor de série neutra.
10. **Todo componente que calcula cor via JavaScript (gráficos, SVG customizado) deve receber um par light/dark explícito e ler o tema via hook — nunca hardcode uma cor que dependa do fundo do card**, porque cores escuras "somem" em cards escuros e vice-versa (esse foi um bug real corrigido durante a implementação do dark mode deste projeto).
11. **Dark mode**: implemente por classe (`.dark` no elemento raiz, variante custom no Tailwind), com um script de bloqueio antes da hidratação para evitar flash, e mantenha o React sempre iniciando em `"light"` (igual ao SSR) corrigindo via efeito pós-montagem — não tente "adivinhar" o tema durante a primeira renderização do cliente, isso quebra a hidratação em componentes que calculam cor via JS.
12. **Não invente um novo padrão de skeleton/loading sem decidir isso conscientemente** — o sistema atual não tem um, e isso é uma lacuna real, não uma escolha de design. Se o novo sistema precisar de carregamento assíncrono visível, esse é um padrão a **criar**, não a copiar.
13. **Padrão de página**: toda página de listagem segue `header (h1 + breadcrumb-texto + toolbar) → card de conteúdo (rounded-xl bg-white p-6 shadow-sm) → paginação`; toda página de detalhe segue `breadcrumb-texto → header com avatar+nome+status → pilha de cards de seção → link de voltar`. Mantenha essa previsibilidade estrutural entre páginas do mesmo tipo.
14. **Responsividade**: use `sm:` como o breakpoint de trabalho principal (1→2/3 colunas), `lg:` só quando precisar de 4 colunas (dashboards densos), e prefira `@container` a media queries quando o componente puder aparecer em larguras variáveis independentes da viewport (como aconteceu com o grid de tamanhos de flexitank).
15. **Ícones**: uma única biblioteca (o equivalente a `lucide-react`), tamanho `16` como padrão, `14` para elementos pequenos (chevrons, fechar), sempre herdando a cor do texto do elemento pai — nunca cor fixa própria do ícone.
16. **Ao encontrar um padrão repetido 3+ vezes no código-fonte, trate-o como oficial** (foi o critério usado para escrever este documento) — ao inverso, ao encontrar um valor usado uma única vez e divergente do padrão majoritário (como o `md:` isolado ou os dois trackings de 30px), não o replique automaticamente; decida deliberadamente.
