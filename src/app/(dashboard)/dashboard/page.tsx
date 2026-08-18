import { Building2, Package, Ship, UserPlus } from "lucide-react";
import Link from "next/link";

import { parseDashboardFilters } from "@/server/modules/dashboard/dashboard-filter.dto";
import * as dashboardService from "@/server/modules/dashboard/dashboard.service";
import * as dashboardLayoutService from "@/server/modules/dashboard-layout/dashboard-layout.service";

import { AnnualShipmentsChart } from "./_components/annual-shipments-chart";
import { CargoProfileChart } from "./_components/cargo-profile-chart";
import { CommercialOverview } from "./_components/commercial-overview";
import {
  DashboardCustomizeToggle,
  DashboardCustomizerProvider,
  DashboardWidgetGrid,
  type DashboardWidget,
} from "./_components/dashboard-customizer";
import { FlexitankAvailabilityGrid } from "./_components/flexitank-availability-grid";
import { GlobalFilterButton } from "./_components/global-filter-button";
import { KpiTile } from "./_components/kpi-strip";
import { PeriodCards } from "./_components/period-cards";
import { StatusShipmentsPanel } from "./_components/status-shipments-panel";

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const rawParams = await searchParams;
  const filters = parseDashboardFilters(rawParams.filters);

  const [
    customerNew,
    customerTotal,
    shipmentsSummary,
    containerSummary,
    annualShipments,
    shipmentType,
    statusShipments,
    flexitank,
    layout,
  ] = await Promise.all([
    dashboardService.getCustomerNew(),
    dashboardService.getCustomerTotal(filters),
    dashboardService.getShipmentsSummary(filters),
    dashboardService.getContainerSummary(filters),
    dashboardService.getAnnualShipments(filters),
    dashboardService.getShipmentTypeBreakdown(filters),
    dashboardService.getStatusShipments(filters),
    dashboardService.getFlexitankAvailability(),
    dashboardLayoutService.getResolvedLayout(),
  ]);

  const activeSizes = flexitank.sizes.filter(
    (size) => flexitank.available[size] > 0 || flexitank.expected[size] > 0
  );

  // Com filtro ativo, cards/gráficos sem nenhum resultado para os critérios somem;
  // sem filtro, tudo volta a aparecer normalmente (mesmo com valores reais em 0).
  const isFilterActive = filters.conditions.length > 0;

  const showBookingsKpi = !isFilterActive || shipmentsSummary.currentMonth > 0;
  const showContainersKpi = !isFilterActive || containerSummary.currentMonth > 0;
  const showActiveCustomersKpi = !isFilterActive || customerTotal.currentMonth > 0;

  const showPeriodCards =
    !isFilterActive ||
    [
      shipmentsSummary.lastMonth,
      shipmentsSummary.currentMonth,
      shipmentsSummary.nextMonth,
      containerSummary.lastMonth,
      containerSummary.currentMonth,
      containerSummary.nextMonth,
    ].some((value) => value > 0);

  const showAnnualShipments =
    !isFilterActive ||
    annualShipments.some((point) => point.bookings > 0 || point.containers > 0 || point.customers > 0);

  const showCargoProfile =
    !isFilterActive ||
    shipmentType.some(
      (point) =>
        point.flexitankFullService > 0 ||
        point.flexitankSupplyFit > 0 ||
        point.flexitankSupplyOnly > 0 ||
        point.isotankFullService > 0 ||
        point.isotankRentalOnly > 0 ||
        point.generalCargo > 0
    );

  const showStatusShipments =
    !isFilterActive ||
    statusShipments.some(
      (row) =>
        row.bookingsCurrentMonth > 0 ||
        row.containersCurrentMonth > 0 ||
        row.bookingsNextMonth > 0 ||
        row.containersNextMonth > 0
    );

  const widgets: DashboardWidget[] = [
    {
      id: "kpi-bookings",
      filterVisible: showBookingsKpi,
      node: (
        <KpiTile
          icon={Package}
          value={shipmentsSummary.currentMonth}
          delta={shipmentsSummary.percCurrent}
          label="Bookings no mês"
        />
      ),
    },
    {
      id: "kpi-containers",
      filterVisible: showContainersKpi,
      node: (
        <KpiTile
          icon={Ship}
          value={containerSummary.currentMonth}
          delta={containerSummary.percCurrent}
          label="Containers no mês"
        />
      ),
    },
    {
      id: "kpi-active-customers",
      filterVisible: showActiveCustomersKpi,
      node: <KpiTile icon={Building2} value={customerTotal.currentMonth} label="Clientes ativos" />,
    },
    {
      id: "kpi-new-customers",
      filterVisible: true,
      node: <KpiTile icon={UserPlus} value={customerNew.new} label="Novos clientes" />,
    },
    {
      id: "commercial-overview",
      filterVisible: true,
      node: <CommercialOverview acquisition={customerNew} customerTotal={customerTotal} />,
    },
    {
      id: "period-cards",
      filterVisible: showPeriodCards,
      node: <PeriodCards shipmentsSummary={shipmentsSummary} containerSummary={containerSummary} />,
    },
    {
      id: "annual-shipments",
      filterVisible: showAnnualShipments,
      node: <AnnualShipmentsChart data={annualShipments} />,
    },
    {
      id: "cargo-profile",
      filterVisible: showCargoProfile,
      node: <CargoProfileChart data={shipmentType} />,
    },
    {
      id: "status-shipments",
      filterVisible: showStatusShipments,
      node: <StatusShipmentsPanel rows={statusShipments} />,
    },
    {
      id: "flexitank-availability",
      filterVisible: true,
      node: (
        <FlexitankAvailabilityGrid
          sizes={activeSizes}
          available={flexitank.available}
          expected={flexitank.expected}
        />
      ),
    },
  ];

  return (
    <DashboardCustomizerProvider initialLayout={layout}>
      <div className="space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-navy-100">
              Dashboard
            </h1>
            <p className="text-sm text-navy-500 dark:text-navy-100/70">
              <Link href="/dashboard" className="hover:underline">
                Home
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <DashboardCustomizeToggle />
            <GlobalFilterButton />
          </div>
        </div>

        <DashboardWidgetGrid widgets={widgets} />
      </div>
    </DashboardCustomizerProvider>
  );
}
