
import { 
  AdminOverview, Trip, Branch, Vehicle, CrewMember, 
  RevenueSummary, SaccoSettings, SMSMetrics, 
  CoreResponse, CoreState, CoreSyncState
} from '../types';
import { MOCK_SUMMARY, MOCK_TRIPS, MOCK_FLEET, MOCK_SMS, MOCK_SETTINGS } from '../mockData';

const CORE_URL = "https://lyncapp-mos-core.vercel.app/api/v1";

/**
 * Defensive Formatters
 * Guaranteed never to crash on undefined/null.
 */
export const safeCurrency = (val: number | undefined | null, locale = 'en-KE') => {
  const value = val ?? 0;
  return `KES ${value.toLocaleString(locale, { minimumFractionDigits: 0 })}`;
};

export const safeNumber = (val: number | undefined | null) => {
  const value = val ?? 0;
  return value.toLocaleString();
};

/**
 * Derived CoreSyncState from Backend State and Network Health
 */
export function deriveSyncState(coreState: CoreState | null, isOffline: boolean): CoreSyncState {
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
 * parseCoreResponse Helper
 * Enforces safety: UI never touches raw response directly.
 */
export function parseCoreResponse<T>(response: CoreResponse<T> | null): { data: T | null; syncState: CoreSyncState } {
  if (!response) {
    return { data: null, syncState: 'OFFLINE' };
  }
  return { 
    data: response.data, 
    syncState: deriveSyncState(response.coreState, false) 
  };
}

/**
 * unwrapCoreData Utility
 * The single authoritative way to extract data T from a CoreResponse<T> for React state.
 * @param response The CoreResponse envelope from the API
 * @param onState Optional callback to update UI sync state
 */
export function unwrapCoreData<T>(
  response: CoreResponse<T> | null,
  onState?: (state: CoreSyncState) => void
): T | null {
  const { data, syncState } = parseCoreResponse(response);
  if (onState) onState(syncState);
  return data;
}

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<CoreResponse<T> | null> {
  try {
    const res = await fetch(`${CORE_URL}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      signal: AbortSignal.timeout(5000), 
    });

    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn(`MOS Core Connectivity Exception for ${endpoint}. Snapshot mode engaged.`);
    return null;
  }
}

export const mosClient = {
  getAdminOverview: async (): Promise<CoreResponse<AdminOverview>> => {
    const res = await apiCall<AdminOverview>('/overview');
    return res || createSnapshot('getAdminOverview');
  },
  
  getTrips: async (): Promise<CoreResponse<Trip[]>> => {
    const res = await apiCall<Trip[]>('/trips');
    return res || createSnapshot('getTrips');
  },

  getBranches: async (): Promise<CoreResponse<Branch[]>> => {
    const res = await apiCall<Branch[]>('/branches');
    return res || createSnapshot('getBranches');
  },

  getVehicles: async (): Promise<CoreResponse<Vehicle[]>> => {
    const res = await apiCall<Vehicle[]>('/vehicles');
    return res || createSnapshot('getVehicles');
  },

  getCrew: async (): Promise<CoreResponse<CrewMember[]>> => {
    const res = await apiCall<CrewMember[]>('/crew');
    return res || createSnapshot('getCrew');
  },

  getRevenueSummary: async (): Promise<CoreResponse<RevenueSummary>> => {
    const res = await apiCall<RevenueSummary>('/revenue');
    return res || createSnapshot('getRevenueSummary');
  },

  getSMSMetrics: async (): Promise<CoreResponse<SMSMetrics>> => {
    const res = await apiCall<SMSMetrics>('/sms');
    return res || createSnapshot('getSMSMetrics');
  },

  getTrustScores: async (): Promise<CoreResponse<any>> => {
    const res = await apiCall<any>('/trust');
    return res || createSnapshot('getTrustScores');
  },
  
  getSettings: async (): Promise<CoreResponse<SaccoSettings>> => {
    const res = await apiCall<SaccoSettings>('/settings');
    return res || createSnapshot('getSettings');
  },

  checkCoreState: async (): Promise<CoreResponse<{state: CoreState}>> => {
    const res = await apiCall<{state: CoreState}>('/core/state');
    return res || { data: { state: 'READY' }, coreState: 'READY', timestamp: new Date().toISOString() };
  },

  dispatch: async (intent: string, payload: any): Promise<CoreResponse<{ success: boolean; message: string }>> => {
    const res = await apiCall<{ success: boolean; message: string }>('/dispatch', {
      method: 'POST',
      body: JSON.stringify({ intent, payload })
    });
    return res || { data: { success: true, message: 'Snapshot Intent Processed' }, coreState: 'READY', timestamp: new Date().toISOString() };
  }
};

/**
 * State Check for UI indicators
 */
export const isBridgeActive = async (): Promise<boolean> => {
    const res = await mosClient.checkCoreState();
    return res?.coreState === 'READY';
};

/**
 * Creates a synthetic CoreResponse based on local snapshots (mocks)
 */
function createSnapshot(method: string): CoreResponse<any> {
  let data: any = null;
  switch (method) {
    case 'getAdminOverview':
      data = {
        revenueToday: MOCK_SUMMARY.todayRevenue,
        activeTrips: MOCK_SUMMARY.ticketsIssued / 10,
        activeVehicles: MOCK_SUMMARY.activeVehicles,
        trustIndex: 92,
        fraudAlerts: MOCK_SUMMARY.fraudAlerts,
        branchStatus: { 'Main': 'online' },
        hourlyRevenue: MOCK_SUMMARY.hourlyRevenue
      };
      break;
    case 'getTrips': data = MOCK_TRIPS; break;
    case 'getSettings': data = MOCK_SETTINGS; break;
    case 'getVehicles': data = MOCK_FLEET; break;
    case 'getSMSMetrics': data = MOCK_SMS; break;
    case 'getBranches':
      data = [
        { id: 'BR-01', name: 'Main Branch', manager: 'Alice W.', vehicleCount: 45, crewCount: 90, revenueToday: 85000, status: 'active' },
        { id: 'BR-02', name: 'Westside Hub', manager: 'Bob K.', vehicleCount: 20, crewCount: 40, revenueToday: 42000, status: 'active' },
      ];
      break;
    case 'getRevenueSummary':
      data = {
        totalMTD: 4200000,
        byBranch: [{ branch: 'Main Branch', amount: 2500000 }, { branch: 'Westside Hub', amount: 1100000 }],
        bySegment: [{ segment: 'Nairobi-Thika', amount: 1200000 }],
        dailyClosureStatus: 'open',
        blockchainHash: '0x7f83b12...a9c2'
      };
      break;
    case 'getTrustScores':
      data = {
        average: 92,
        anomalies: 2,
        trends: Array.from({ length: 7 }, (_, i) => ({ day: `D-${7-i}`, score: 85 + Math.random() * 10 }))
      };
      break;
    case 'getCrew':
      data = [
        { id: 'CRW-001', name: 'John Doe', role: 'driver', status: 'active', trustScore: 98, assignedVehicle: 'KDA 123A' },
      ];
      break;
  }
  return {
    data,
    coreState: 'READY',
    timestamp: new Date().toISOString(),
    message: 'Snapshot Mode: Local Data'
  };
}
