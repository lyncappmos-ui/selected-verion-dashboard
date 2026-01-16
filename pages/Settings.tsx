
import React, { useEffect, useState } from 'react';
import { mosApi } from '../services/api';
import { SaccoSettings } from '../types';
import { Save, Bell, Shield, Mail, Globe } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SaccoSettings | null>(null);

  useEffect(() => {
    mosApi.getSettings().then(setSettings);
  }, []);

  if (!settings) return <div>Loading System Config...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Settings</h1>
        <p className="text-slate-500">Configure SACCO-wide operational parameters.</p>
      </div>

      <div className="space-y-6">
        {/* Organization Profile */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3 text-slate-700">
            <Globe size={20} />
            <h3 className="font-bold">Organization Profile</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">SACCO Legal Name</label>
              <input type="text" value={settings.name} readOnly className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Primary Contact Hub</label>
              <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20">
                {settings.branches.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Notification Thresholds */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3 text-slate-700">
            <Bell size={20} />
            <h3 className="font-bold">Automated Alerts</h3>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Revenue Anomaly Tolerance (%)</label>
                <input 
                  type="number" 
                  defaultValue={settings.notificationThresholds.revenueAnomaly}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" 
                />
                <p className="text-[10px] text-slate-400">Alert triggers if route revenue deviates by this % from 30-day average.</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">SMS Low Balance Alert</label>
                <input 
                  type="number" 
                  defaultValue={settings.notificationThresholds.lowQuota}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" 
                />
                <p className="text-[10px] text-slate-400">Units remaining when supervisor is notified.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Access */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3 text-slate-700">
            <Shield size={20} />
            <h3 className="font-bold">Security & Compliance</h3>
          </div>
          <div className="p-8">
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="font-bold text-slate-800">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500">Require OTP for all SACCO supervisor logins.</p>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-inner transition-colors">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-4 border-t border-slate-50">
              <div>
                <p className="font-bold text-slate-800">Strict Path Enforcement</p>
                <p className="text-xs text-slate-500">Lock tickets if vehicle deviates more than 500m from route.</p>
              </div>
              <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer shadow-inner transition-colors">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4">
          <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
            Cancel Changes
          </button>
          <button className="px-10 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-[0.98]">
            <Save size={18} /> Save Configurations
          </button>
        </div>
      </div>
    </div>
  );
};
