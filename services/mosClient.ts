
import { 
  AdminOverview, Trip, Branch, Vehicle, CrewMember, 
  RevenueSummary, SaccoSettings, SMSMetrics
} from '../types';
import { MOCK_SUMMARY, MOCK_TRIPS, MOCK_FLEET, MOCK_SMS, MOCK_SETTINGS } from '../mockData';

/**
 * LyncApp MOS Core Bridge Client
 * Communicates with the authoritative MOS Core via postMessage bridge.
 * Includes automatic fallback to simulation if the bridge is unreachable.
 */

const BRIDGE_ID = 'mos-core-bridge';
const BRIDGE_URL = 'https://api.lyncapp.ai/bridge';

let bridgeActive = false;
let bridgeInitialized = false;

export const isBridgeActive = () => bridgeActive;

/**
 * Ensures the bridge iframe exists in the document.
 * Returns the contentWindow of the iframe if successful.
 */
const getBridgeWindow = (): Window | null => {
  let iframe = document.getElementById(BRIDGE_ID) as HTMLIFrameElement;
  
  if (!iframe && !bridgeInitialized) {
    bridgeInitialized = true;
    iframe = document.createElement('iframe');
    iframe.id = BRIDGE_ID;
    iframe.src = BRIDGE_URL;
    iframe.style.display = 'none';
    iframe.title = 'MOS Core Bridge';
    iframe.onerror = () => {
      console.warn('MOS Bridge failed to load. Staying in Simulation Mode.');
      bridgeActive = false;
    };
    document.body.appendChild(iframe);
  }

  return iframe?.contentWindow || null;
};

const callMOS = (method: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve) => {
    const requestId = Math.random().toString(36).substring(7);
    const bridgeWindow = getBridgeWindow();
    
    if (!bridgeWindow) {
      return resolve(getSimulatedResponse(method, params));
    }

    const handler = (event: MessageEvent) => {
      if (event.data.type === `MOS_RESPONSE:${requestId}`) {
        window.removeEventListener('message', handler);
        if (event.data.success) {
          bridgeActive = true;
          resolve(event.data.data);
        } else {
          resolve(getSimulatedResponse(method, params));
        }
      }
    };
    window.addEventListener('message', handler);

    try {
      bridgeWindow.postMessage({
        type: `MOS_COMMAND:${method}`,
        payload: params,
        requestId
      }, "*");
    } catch (e) {
      window.removeEventListener('message', handler);
      resolve(getSimulatedResponse(method, params));
    }

    // Short timeout for response
    setTimeout(() => {
      window.removeEventListener('message', handler);
      resolve(getSimulatedResponse(method, params));
    }, 400);
  });
};

export const mosClient = {
  getAdminOverview: async (): Promise<AdminOverview> => {
    return await callMOS('getAdminOverview');
  },
  getTrips: (filters?: any) => callMOS('getTrips', [filters]),
  getBranches: () => callMOS('getBranches'),
  getVehicles: () => callMOS('getVehicles'),
  getCrew: () => callMOS('getCrew'),
  getRevenueSummary: () => callMOS('getRevenueSummary'),
  getTrustScores: () => callMOS('getTrustScores'),
  getSettings: () => callMOS('getSettings'),
  getSMSMetrics: () => callMOS('getSMSMetrics'),
  
  dispatch: async (intent: string, payload: any): Promise<{ success: boolean; message: string }> => {
    return callMOS('dispatch', [intent, payload]);
  }
};

function getSimulatedResponse(method: string, params: any[]) {
  bridgeActive = false;
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
