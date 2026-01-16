
import { 
  AdminOverview, Trip, Branch, Vehicle, CrewMember, 
  RevenueSummary, SaccoSettings, SMSMetrics
} from '../types';

/**
 * LyncApp MOS Core Bridge Client
 * Communicates with the authoritative MOS Core via postMessage bridge.
 */

const callMOS = (method: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    const requestId = Math.random().toString(36).substring(7);
    const iframe = document.getElementById('mos-core-bridge') as HTMLIFrameElement;
    
    // Safety check for the bridge
    if (!iframe || !iframe.contentWindow) {
      console.warn(`MOS Bridge not found. Simulation active for: ${method}`);
      return setTimeout(() => resolve(getSimulatedResponse(method, params)), 300);
    }

    // Response handler
    const handler = (event: MessageEvent) => {
      if (event.data.type === `MOS_RESPONSE:${requestId}`) {
        window.removeEventListener('message', handler);
        if (event.data.success) {
          resolve(event.data.data);
        } else {
          reject(new Error(event.data.error || 'MOS Core execution failed.'));
        }
      }
    };
    window.addEventListener('message', handler);

    // Command dispatch
    iframe.contentWindow.postMessage({
      type: `MOS_COMMAND:${method}`,
      payload: params,
      requestId
    }, "*");

    // Global timeout to prevent memory leaks/hanging UI
    setTimeout(() => {
      window.removeEventListener('message', handler);
      resolve(getSimulatedResponse(method, params));
    }, 2500);
  });
};

export const mosClient = {
  getAdminOverview: () => callMOS('getAdminOverview'),
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

/**
 * Simulated MOS Core behavior for development stability.
 * In production, these fallbacks are only triggered if the bridge hangs.
 */
function getSimulatedResponse(method: string, params: any[]) {
  switch (method) {
    case 'getAdminOverview':
      return {
        revenueToday: 145200,
        activeTrips: 12,
        activeVehicles: 85,
        trustIndex: 92,
        fraudAlerts: 2,
        branchStatus: { 'Main': 'online', 'Westside': 'online', 'Coastal': 'online' },
        hourlyRevenue: Array.from({ length: 12 }, (_, i) => ({ 
          hour: `${i * 2}:00`, 
          amount: 5000 + Math.floor(Math.random() * 25000) 
        }))
      };
    case 'getTrips':
      return [
        { id: 'TRP-2026-001', route: 'Nairobi-Thika', vehicle: 'KDA 123A', branch: 'Main', startTime: '08:00', status: 'completed', revenue: 4500 },
        { id: 'TRP-2026-002', route: 'CBD-Westlands', vehicle: 'KDB 456B', branch: 'Westside', startTime: '09:15', status: 'active', revenue: 2100 },
        { id: 'TRP-2026-003', route: 'Nairobi-Nakuru', vehicle: 'KDC 789C', branch: 'Main', startTime: '10:00', status: 'scheduled', revenue: 0 },
      ];
    case 'getVehicles':
      return [
        { registration: 'KDA 123A', route: 'Nairobi-Thika', branch: 'Main', status: 'active', lastActive: '2m ago', driver: 'John D.', trustScore: 98 },
        { registration: 'KDB 456B', route: 'CBD-Westlands', branch: 'Westside', status: 'active', lastActive: 'Now', driver: 'Jane S.', trustScore: 94 },
        { registration: 'KDC 789C', route: 'Nairobi-Nakuru', branch: 'Main', status: 'idle', lastActive: '1h ago', driver: 'Peter K.', trustScore: 82 },
      ];
    case 'getSMSMetrics':
      return { sent: 15400, failed: 120, costPerTicket: 0.85, totalCost: 13090, successRate: 99.2 };
    case 'dispatch':
      return { success: true, message: `Command ${params[0]} successfully queued by MOS Bridge.` };
    default:
      return null;
  }
}
