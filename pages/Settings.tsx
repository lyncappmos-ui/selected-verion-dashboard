
import React, { useEffect, useState, useCallback } from 'react';
import { mosClient, unwrapCoreData } from '../services/mosClient';
import { SaccoSettings, CoreSyncState } from '../types';
import { Save, Bell, Shield, Globe, Lock, Activity, Clock } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SaccoSettings | null>(null);
  const [syncState, setSyncState] = useState<CoreSyncState>('SYNCING');
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    const response = await mosClient.getSettings();
    const data = unwrapCoreData(response, setSyncState);
    if (data) setSettings(data);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    if (!settings || syncState === 'READ_ONLY') return;
    setSaving(true);
    try {
      const res = await mosClient.dispatch('updateSettings', settings);
      const data = unwrapCoreData(res);
      if (data?.success) {
        // Success feedback logic
        console.log('Settings persistent in MOS Core.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (syncState === 'SYNCING' && !settings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <Clock className="animate-spin mb-4" size={32} />
        <p className="text-sm font-bold uppercase tracking-widest text-center">Initialising Operational Config...</p>
      </div>
    );
  }

  // Prevent UI interaction if settings failed to load entirely
  if (!settings) return <div className="p-20 text-center text-slate-400">Settings unavailable in current core state.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System Configuration</h1>
          <p className="text-slate-500 text-sm">Fine-tuning the LyncApp MOS Core engine parameters for your SACCO.</p>
        </div>
        {syncState === 'READ_ONLY' && (
          <div className="bg-slate-800 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Lock size={14} /> Compliance Lock Active
          </div>
        )}
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
                disabled={syncState === 'READ_ONLY'}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all disabled:bg-slate-50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route Deviation Limit (m)</label>
              <input 
                type="number" 
                defaultValue={200} 
                disabled={syncState === 'READ_ONLY'}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all disabled:bg-slate-50" 
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 font-bold text-sm">Discard</button>
          <button 
            onClick={handleSave}
            disabled={saving || syncState === 'READ_ONLY'}
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
