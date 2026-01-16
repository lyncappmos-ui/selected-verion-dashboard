
import { DashboardSummary, Trip, Vehicle, SMSMetrics, SaccoSettings } from './types';

export const MOCK_SUMMARY: DashboardSummary = {
  todayRevenue: 145200,
  ticketsIssued: 1240,
  activeVehicles: 85,
  smsSuccessRate: 98.4,
  fraudAlerts: 3,
  hourlyRevenue: [
    { hour: '06:00', amount: 12000 },
    { hour: '08:00', amount: 35000 },
    { hour: '10:00', amount: 22000 },
    { hour: '12:00', amount: 18000 },
    { hour: '14:00', amount: 15000 },
    { hour: '16:00', amount: 28000 },
    { hour: '18:00', amount: 15200 },
  ],
  routePerformance: [
    { route: 'Nairobi-Thika', tickets: 450 },
    { route: 'CBD-Westlands', tickets: 320 },
    { route: 'Nairobi-Nakuru', tickets: 280 },
    { hour: 'Other', tickets: 190 },
  ] as any // Adjusting for charting
};

export const MOCK_TRIPS: Trip[] = [
  { id: 'T-1001', route: 'Nairobi-Thika', vehicle: 'KDA 123A', branch: 'Main', startTime: '2023-10-27 08:30', status: 'completed', revenue: 4500 },
  { id: 'T-1002', route: 'CBD-Westlands', vehicle: 'KDB 456B', branch: 'West', startTime: '2023-10-27 09:15', status: 'active', revenue: 2100 },
  { id: 'T-1003', route: 'Nairobi-Nakuru', vehicle: 'KDC 789C', branch: 'Main', startTime: '2023-10-27 10:00', status: 'scheduled', revenue: 0 },
  { id: 'T-1004', route: 'Nairobi-Thika', vehicle: 'KDD 012D', branch: 'Main', startTime: '2023-10-27 10:45', status: 'active', revenue: 3200 },
  { id: 'T-1005', route: 'CBD-Westlands', vehicle: 'KDE 345E', branch: 'West', startTime: '2023-10-27 11:30', status: 'scheduled', revenue: 0 },
];

export const MOCK_FLEET: Vehicle[] = [
  // Added required trustScore property to satisfy Vehicle interface
  { registration: 'KDA 123A', route: 'Nairobi-Thika', branch: 'Main', status: 'active', lastActive: '2 mins ago', driver: 'John Doe', trustScore: 98 },
  { registration: 'KDB 456B', route: 'CBD-Westlands', branch: 'West', status: 'active', lastActive: 'Now', driver: 'Jane Smith', trustScore: 94 },
  { registration: 'KDC 789C', route: 'Nairobi-Nakuru', branch: 'Main', status: 'idle', lastActive: '1 hr ago', driver: 'Peter Kamau', trustScore: 82 },
  { registration: 'KDD 012D', route: 'Nairobi-Thika', branch: 'Main', status: 'maintenance', lastActive: 'Yesterday', driver: 'N/A', trustScore: 90 },
];

export const MOCK_SMS: SMSMetrics = {
  sent: 15400,
  failed: 120,
  costPerTicket: 0.85,
  totalCost: 13090,
  successRate: 99.2
};

export const MOCK_SETTINGS: SaccoSettings = {
  name: 'LyncApp Express SACCO',
  branches: ['Main Branch', 'Westside Hub', 'Coastal Office'],
  fleetSize: 120,
  smsQuota: 50000,
  notificationThresholds: {
    revenueAnomaly: 15,
    lowQuota: 5000
  }
};
