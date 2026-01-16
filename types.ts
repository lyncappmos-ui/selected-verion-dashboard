
export type TripStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';
export type VehicleStatus = 'active' | 'maintenance' | 'idle' | 'offline';
export type CrewRole = 'driver' | 'conductor' | 'supervisor';

export interface Branch {
  id: string;
  name: string;
  manager: string;
  vehicleCount: number;
  crewCount: number;
  revenueToday: number;
  status: 'active' | 'closed';
}

export interface CrewMember {
  id: string;
  name: string;
  role: CrewRole;
  status: 'active' | 'on-leave' | 'suspended';
  trustScore: number;
  assignedVehicle?: string;
}

export interface TripSegment {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  revenue: number;
}

export interface Trip {
  id: string;
  route: string;
  vehicle: string;
  branch: string;
  startTime: string;
  status: TripStatus;
  revenue: number;
  segments?: TripSegment[];
}

export interface Vehicle {
  registration: string;
  route: string;
  branch: string;
  status: VehicleStatus;
  lastActive: string;
  driver: string;
  trustScore: number;
}

export interface AdminOverview {
  revenueToday: number;
  activeTrips: number;
  activeVehicles: number;
  trustIndex: number;
  fraudAlerts: number;
  branchStatus: Record<string, 'online' | 'offline'>;
  hourlyRevenue: { hour: string; amount: number }[];
}

export interface RevenueSummary {
  totalMTD: number;
  byBranch: { branch: string; amount: number }[];
  bySegment: { segment: string; amount: number }[];
  dailyClosureStatus: 'open' | 'pending' | 'closed';
  blockchainHash?: string;
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

/**
 * Added DashboardSummary interface to resolve import errors in mockData and api services.
 */
export interface DashboardSummary {
  todayRevenue: number;
  ticketsIssued: number;
  activeVehicles: number;
  smsSuccessRate: number;
  fraudAlerts: number;
  hourlyRevenue: { hour: string; amount: number }[];
  routePerformance: any[];
}

/**
 * Added SMSMetrics interface to resolve import errors in mockData, api, and SMS pages.
 */
export interface SMSMetrics {
  sent: number;
  failed: number;
  costPerTicket: number;
  totalCost: number;
  successRate: number;
}
