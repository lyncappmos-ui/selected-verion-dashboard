
import React, { useEffect, useState } from 'react';
import { mosClient } from '../services/mosClient';
import { SaccoSettings } from '../types';
// Added Activity to imports from lucide-react
import { Save, Bell, Shield, Globe, Lock, Activity } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SaccoSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    mosClient.getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await mosClient.dispatch('updateSettings', settings);
      // Feedback toast logic here
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div className="p-12 text-center text-slate-400 animate-pulse font-bold">Initialising Operational Config...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Configuration</h1>
        <p className="text-slate-500 text-sm">Fine-tuning the LyncApp MOS Core engine parameters for your SACCO.</p>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <Globe size={18} className="text-blue-600" />
            <h3 className="font-bold text-sm text-slate-700">SACCO Identity</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legal Trading Name</label>
              <input type="text" value={settings.name} readOnly className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed font-medium outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Day Cycle</label>
              <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-bold text-sm">04:00 AM - 11:59 PM</div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <Bell size={18} className="text-amber-500" />
            <h3 className="font-bold text-sm text-slate-700">Anomaly Detection</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Variance Lock (%)</label>
              <input 
                type="number" 
                defaultValue={settings.notificationThresholds.revenueAnomaly}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route Deviation Limit (m)</label>
              <div className="flex items-center gap-3">
                <input type="number" defaultValue={200} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <Lock size={18} className="text-rose-500" />
            <h3 className="font-bold text-sm text-slate-700">Hard Compliance</h3>
          </div>
          <div className="p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-sm">Auto-Lock Revenue Alerts</p>
                <p className="text-xs text-slate-400">Lock vehicle operations if un-reconciled revenue exceeds KES 50k.</p>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-50 pt-4">
              <div>
                <p className="font-bold text-slate-800 text-sm">Strict Crew Multi-Assignment</p>
                <p className="text-xs text-slate-400">Prevent crew members from being assigned to multiple active vehicles.</p>
              </div>
              <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 font-bold text-sm">Discard</button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-10 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? <Activity className="animate-spin" size={18} /> : <Save size={18} />}
            Commit Config Changes
          </button>
        </div>
      </div>
    </div>
  );
};
