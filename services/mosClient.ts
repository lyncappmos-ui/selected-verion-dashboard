
import { 
  AdminOverview, Trip, Branch, Vehicle, CrewMember, 
  RevenueSummary, SaccoSettings, SMSMetrics
} from '../types';
import { MOCK_SUMMARY, MOCK_TRIPS, MOCK_FLEET, MOCK_SMS, MOCK_SETTINGS } from '../mockData';

/**
 * LyncApp MOS Core Client
 * Connects directly to the Vercel-hosted MOS Core API.
 */

const CORE_URL = "https://lyncapp-mos-core.vercel.app/api/v1";
let coreConnected = false;

/**
 * Returns the current connection state to the MOS Core.
 */
export const isBridgeActive = () => coreConnected;

/**
 * Generic Fetch Wrapper with Mock Fallback.
 * Attempts to communicate with the live Core API; falls back to 
 * simulation mode on any network or protocol error.
 */
async function apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
  try {
    const res = await fetch(`${CORE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    
    const data = await res.json();
    coreConnected = true;
    return data;
  } catch (error) {
    // Silently handle connectivity issues and trigger simulation mode
    console.debug(`MOS Core connectivity error for ${endpoint}. Fallback to Simulation.`);
    coreConnected = false;
    return null;
  }
}

export const mosClient = {
  /**
   * Fetches high-level operational metrics from the Core.
   */
  getAdminOverview: async (): Promise<AdminOverview> => {
    const data = await apiCall('/overview');
    return data || getSimulatedResponse('getAdminOverview', []);
  },
  
  /**
   * Retrieves operational trip logs.
   */
  getTrips: async (filters?: any): Promise<Trip[]> => {
    const data = await apiCall('/trips');
    return data || getSimulatedResponse('getTrips', [filters]);
  },
  
  /**
   * Retrieves branch-level resource allocation.
   */
  getBranches: async (): Promise<Branch[]> => {
    const data = await apiCall('/branches');
    return data || getSimulatedResponse('getBranches', []);
  },
  
  /**
   * Monitors real-time fleet status.
   */
  getVehicles: async (): Promise<Vehicle[]> => {
    const data = await apiCall('/vehicles');
    return data || getSimulatedResponse('getVehicles', []);
  },
  
  /**
   * Accesses the personnel and trust registry.
   */
  getCrew: async (): Promise<CrewMember[]> => {
    const data = await apiCall('/crew');
    return data || getSimulatedResponse('getCrew', []);
  },
  
  /**
   * Audits daily revenue and distribution.
   */
  getRevenueSummary: async (): Promise<RevenueSummary> => {
    const data = await apiCall('/revenue');
    return data || getSimulatedResponse('getRevenueSummary', []);
  },
  
  /**
   * Queries behavioral trust indices from the integrity engine.
   */
  getTrustScores: async (): Promise<any> => {
    const data = await apiCall('/trust');
    return data || getSimulatedResponse('getTrustScores', []);
  },
  
  /**
   * Fetches current SACCO operational configurations.
   */
  getSettings: async (): Promise<SaccoSettings> => {
    const data = await apiCall('/settings');
    return data || getSimulatedResponse('getSettings', []);
  },
  
  /**
   * Analyzes communication costs and delivery metrics.
   */
  getSMSMetrics: async (): Promise<SMSMetrics> => {
    const data = await apiCall('/sms');
    return data || getSimulatedResponse('getSMSMetrics', []);
  },
  
  /**
   * Dispatches an operational intent to the Core.
   */
  dispatch: async (intent: string, payload: any): Promise<{ success: boolean; message: string }> => {
    const data = await apiCall('/dispatch', {
      method: 'POST',
      body: JSON.stringify({ intent, payload })
    });
    return data || getSimulatedResponse('dispatch', [intent, payload]);
  },

  /**
   * Checks Core health status as defined in deployment params.
   */
  checkCore: async () => {
    const data = await apiCall('/health');
    return data;
  }
};

/**
 * Standard Simulation Logic.
 * Provides consistent data structures when the Core API is unreachable.
 */
function getSimulatedResponse(method: string, params: any[]) {
  // Ensure the UI knows we are in simulation
  coreConnected = false; 
  
  switch (method) {
    case 'getAdminOverview':
      return {
        revenueToday: MOCK_SUMMARY.todayRevenue,
        activeTrips: MOCK_SUMMARY.ticketsIssued / 100,
        activeVehicles: MOCK_SUMMARY.activeVehicles,
        trustIndex: 92,
        fraudAlerts: MOCK_SUMMARY.fraudAlerts,
        branchStatus: { 'Main': 'online', 'Westside': 'online', 'Coastal': 'online' },
        hourlyRevenue: MOCK_SUMMARY.hourlyRevenue
      };
    case 'getTrips':
      return MOCK_TRIPS;
    case 'getVehicles':
      return MOCK_FLEET;
    case 'getSMSMetrics':
      return MOCK_SMS;
    case 'getSettings':
      return MOCK_SETTINGS;
    case 'getBranches':
      return [
        { id: 'BR-01', name: 'Main Branch', manager: 'Alice W.', vehicleCount: 45, crewCount: 90, revenueToday: 85000, status: 'active' },
        { id: 'BR-02', name: 'Westside Hub', manager: 'Bob K.', vehicleCount: 20, crewCount: 40, revenueToday: 42000, status: 'active' },
        { id: 'BR-03', name: 'Coastal Office', manager: 'Charlie M.', vehicleCount: 15, crewCount: 30, revenueToday: 18200, status: 'active' },
      ];
    case 'getRevenueSummary':
      return {
        totalMTD: 4200000,
        byBranch: [{ branch: 'Main Branch', amount: 2500000 }, { branch: 'Westside Hub', amount: 1100000 }, { branch: 'Coastal Office', amount: 600000 }],
        bySegment: [{ segment: 'Nairobi-Thika', amount: 1200000 }, { segment: 'CBD-Westlands', amount: 800000 }],
        dailyClosureStatus: 'open',
        blockchainHash: '0x7f83b12...a9c2'
      };
    case 'getTrustScores':
      return {
        average: 92,
        anomalies: 2,
        trends: Array.from({ length: 7 }, (_, i) => ({ day: `D-${7-i}`, score: 85 + Math.random() * 10 }))
      };
    case 'getCrew':
      return [
        { id: 'CRW-001', name: 'John Doe', role: 'driver', status: 'active', trustScore: 98, assignedVehicle: 'KDA 123A' },
        { id: 'CRW-002', name: 'Jane Smith', role: 'conductor', status: 'active', trustScore: 94, assignedVehicle: 'KDA 123A' },
      ];
    case 'dispatch':
      return { success: true, message: `[Simulated] Command ${params[0]} executed successfully.` };
    default:
      return null;
  }
}
