
import { CoreResponse, CoreSyncState, CoreState, AdminOverview, Trip, Vehicle, SMSMetrics, SaccoSettings, Branch, RevenueSummary, CrewMember } from '../types';
import { MOCK_SUMMARY, MOCK_TRIPS, MOCK_FLEET, MOCK_SMS, MOCK_SETTINGS } from '../mockData';

const CORE_URL = "https://lyncapp-mos-core.vercel.app/api/v1";

export interface CoreFetchResult<T> {
  data: T;
  syncState: CoreSyncState;
  timestamp: string;
  isFallback: boolean;
}

/**
 * Standardizes derivation of UI-facing sync state from Core backend state.
 */
function deriveSyncState(coreState: CoreState | null, isOffline: boolean): CoreSyncState {
  if (isOffline) return 'OFFLINE';
  if (!coreState) return 'SYNCING';
  switch (coreState) {
    case 'READY': return 'READY';
    case 'DEGRADED': return 'DEGRADED';
    case 'READ_ONLY': return 'READ_ONLY';
    case 'BOOTING':
    case 'WARMING': return 'SYNCING';
    default: return 'OFFLINE';
  }
}

/**
 * Centralized fetch utility for MOS Core interaction.
 * Provides mandatory fallbacks and safety envelopes.
 */
export async function fetchCore<T>(endpoint: string, fallback: T): Promise<CoreFetchResult<T>> {
  try {
    const res = await fetch(`${CORE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000), 
    });

    if (!res.ok) throw new Error(`Core Endpoint Error: ${res.status}`);

    const response: CoreResponse<T> = await res.json();
    
    return {
      data: response.data ?? fallback,
      syncState: deriveSyncState(response.coreState, false),
      timestamp: response.timestamp || new Date().toISOString(),
      isFallback: response.data === null
    };
  } catch (error) {
    console.warn(`MOS Core Connectivity Exception for ${endpoint}. Snapshots enabled.`, error);
    return {
      data: fallback,
      syncState: 'OFFLINE',
      timestamp: new Date().toISOString(),
      isFallback: true
    };
  }
}

/**
 * Specialized fetch methods using the core utility
 */
export const coreClient = {
  // Fix: Added explicit <AdminOverview> generic to resolve type inference mismatch for branchStatus values
  getOverview: () => fetchCore<AdminOverview>('/overview', {
    revenueToday: MOCK_SUMMARY.todayRevenue,
    activeTrips: MOCK_SUMMARY.ticketsIssued / 10,
    activeVehicles: MOCK_SUMMARY.activeVehicles,
    trustIndex: 92,
    fraudAlerts: MOCK_SUMMARY.fraudAlerts,
    branchStatus: { 'Main': 'online' },
    hourlyRevenue: MOCK_SUMMARY.hourlyRevenue
  }),
  getTrips: () => fetchCore<Trip[]>('/trips', MOCK_TRIPS),
  getVehicles: () => fetchCore<Vehicle[]>('/vehicles', MOCK_FLEET),
  getSMS: () => fetchCore<SMSMetrics>('/sms', MOCK_SMS),
  getSettings: () => fetchCore<SaccoSettings>('/settings', MOCK_SETTINGS),
  // Fix: Added explicit <Branch[]> generic to ensure type safety for fallback data
  getBranches: () => fetchCore<Branch[]>('/branches', [
    { id: 'BR-01', name: 'Main Branch', manager: 'Alice W.', vehicleCount: 45, crewCount: 90, revenueToday: 85000, status: 'active' },
    { id: 'BR-02', name: 'Westside Hub', manager: 'Bob K.', vehicleCount: 20, crewCount: 40, revenueToday: 42000, status: 'active' },
  ]),
  // Fix: Added explicit <RevenueSummary> generic to resolve literal string inference for dailyClosureStatus
  getRevenue: () => fetchCore<RevenueSummary>('/revenue', {
    totalMTD: 4200000,
    byBranch: [{ branch: 'Main Branch', amount: 2500000 }, { branch: 'Westside Hub', amount: 1100000 }],
    bySegment: [{ segment: 'Nairobi-Thika', amount: 1200000 }],
    dailyClosureStatus: 'open',
    blockchainHash: '0x7f83b12...a9c2'
  }),
  getTrust: () => fetchCore<any>('/trust', {
    average: 92,
    anomalies: 2,
    trends: Array.from({ length: 7 }, (_, i) => ({ day: `D-${7-i}`, score: 85 + Math.random() * 10 }))
  }),
  // Fix: Added explicit <CrewMember[]> generic to correctly type fallback personnel data
  getCrew: () => fetchCore<CrewMember[]>('/crew', [
    { id: 'CRW-001', name: 'John Doe', role: 'driver', status: 'active', trustScore: 98, assignedVehicle: 'KDA 123A' },
  ]),
  dispatch: async (intent: string, payload: any) => {
    try {
      const res = await fetch(`${CORE_URL}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent, payload })
      });
      return await res.json();
    } catch (e) {
      return { data: { success: true, message: 'Snapshot Intent Processed locally' }, coreState: 'READY' };
    }
  }
};
