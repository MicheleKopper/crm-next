export const SHIPMENT_STATUS_COLORS: Record<string, string> = {
  Arrived: "#0BA6DF",
  Booked: "#005999",
  Cancelled: "#C40C0C",
  "In Operation": "#E67E22",
  Pending: "#DC3C22",
  Shipped: "#347433",
  "Waiting Departure": "#F1C40F",
};

export type PeriodSummary = {
  lastMonth: number;
  currentMonth: number;
  nextMonth: number;
  percCurrent: number;
  percNext: number;
};

export type AnnualShipmentPoint = {
  month: string;
  bookings: number;
  customers: number;
  containers: number;
};

export type ShipmentTypePoint = {
  month: string;
  flexitankFullService: number;
  flexitankSupplyFit: number;
  flexitankSupplyOnly: number;
  isotankFullService: number;
  isotankRentalOnly: number;
  generalCargo: number;
};

export type StatusShipmentRow = {
  status: string;
  colorCode: string;
  bookingsCurrentMonth: number;
  containersCurrentMonth: number;
  bookingsNextMonth: number;
  containersNextMonth: number;
};

export type CustomerNewSummary = {
  leads: number;
  potential: number;
  new: number;
};

export type CustomerTotalSummary = {
  prevMonth: number;
  currentMonth: number;
  nextMonth: number;
};

export type FlexitankAvailabilitySummary = {
  sizes: string[];
  available: Record<string, number>;
  expected: Record<string, number>;
};
