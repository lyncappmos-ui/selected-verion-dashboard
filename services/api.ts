
import { MOCK_SUMMARY, MOCK_TRIPS, MOCK_FLEET, MOCK_SMS, MOCK_SETTINGS } from '../mockData';
import { DashboardSummary, Trip, Vehicle, SMSMetrics, SaccoSettings } from '../types';

// Simulation of network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mosApi = {
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    await delay(800);
    return MOCK_SUMMARY;
  },
  
  getTrips: async (): Promise<Trip[]> => {
    await delay(600);
    return MOCK_TRIPS;
  },
  
  getFleet: async (): Promise<Vehicle[]> => {
    await delay(700);
    return MOCK_FLEET;
  },
  
  assignRoute: async (registration: string, route: string): Promise<boolean> => {
    await delay(1000);
    console.log(`API Command: Assigned ${registration} to ${route}`);
    return true;
  },
  
  getSMSMetrics: async (): Promise<SMSMetrics> => {
    await delay(500);
    return MOCK_SMS;
  },
  
  getSettings: async (): Promise<SaccoSettings> => {
    await delay(400);
    return MOCK_SETTINGS;
  },
  
  updateSettings: async (settings: Partial<SaccoSettings>): Promise<boolean> => {
    await delay(1200);
    console.log('API Command: Updated Settings', settings);
    return true;
  },
  
  getTrustSummary: async () => {
    await delay(600);
    return {
      averageTrustScore: 88,
      anomalies: 4,
      deviations: 12
    };
  }
};
