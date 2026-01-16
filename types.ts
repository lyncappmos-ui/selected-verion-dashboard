
export type TripStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';
export type VehicleStatus = 'active' | 'maintenance' | 'idle' | 'offline';

export interface Trip {
  id: string;
  route: string;
  vehicle: string;
  branch: string;
  startTime: string;
  status: TripStatus;
  revenue: number;
}

export interface Vehicle {
  registration: string;
  route: string;
  branch: string;
  status: VehicleStatus;
  lastActive: string;
  driver: string;
}

export interface RevenueMetric {
  label: string;
  value: number;
}

export interface SMSMetrics {
  sent: number;
  failed: number;
  costPerTicket: number;
  totalCost: number;
  successRate: number;
}

export interface SaccoSettings {
  name: string;
  branches: string[];
  fleetSize: number;
  smsQuota: number;
  notificationThresholds: {
    revenueAnomaly: number;
    lowQuota: number;
  };
}

export interface DashboardSummary {
  todayRevenue: number;
  ticketsIssued: number;
  activeVehicles: number;
  smsSuccessRate: number;
  fraudAlerts: number;
  hourlyRevenue: { hour: string; amount: number }[];
  routePerformance: { route: string; tickets: number }[];
}
