
import React, { useState } from 'react';
import { coreClient } from '../services/coreClient';
import { useCore } from '../hooks/useCore';
import { SaccoSettings } from '../types';
import { Save, Bell, Globe, Lock, Activity, ShieldCheck, AlertCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { data: settings, syncState, isBroken, reset } = useCore<SaccoSettings>(coreClient.getSettings);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!settings || syncState === 'READ_ONLY') return;
    setSaving(true);
    try {
      await coreClient.dispatch('updateSettings', settings);
      // feedback handled via toast/local state in production
    } finally {
      setTimeout(() => setSaving(false), 800);
    }
  };

  if (isBroken) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-rose-100 flex flex-col items-center">
        <ShieldCheck className="text-rose-400 mb-4" size={48} />
        <h2 className="text-xl font-bold uppercase tracking-widest">Configuration Lock Triggered</h2>
        <p className="text-slate-500 mt-2 text-sm max-w-sm">System configuration cannot be retrieved from MOS Core. State is read-only snapshots.</p>
        <button onClick={reset} className="mt-8 px-10 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest">Restart Config Sync</button>
      </div>
    );
  }

  const s = settings || { name: '', branches: [], fleetSize: 0, smsQuota: 0, notificationThresholds: { revenueAnomaly: 0, lowQuota: 0 } };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Operational Config</h1>
          <p className="text-slate-500 text-sm">Parameters for LyncApp MOS Core engine.</p>
        </div>
        {syncState === 'READ_ONLY' && (
          <div className="bg-slate-800 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Lock size={14} /> Compliance Lock
          </div>
        )}
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <Globe size={18} className="text-blue-600" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700">SACCO Identity</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trading Entity</label>
              <input type="text" value={s.name} readOnly className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 font-bold outline-none cursor-not-allowed" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cycle Threshold</label>
              <div className="px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 font-bold text-sm">24H Operational window</div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <Bell size={18} className="text-amber-500" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700">Anomaly Logic</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Lockout (%)</label>
              <input type="number" defaultValue={s.notificationThresholds.revenueAnomaly} disabled={syncState === 'READ_ONLY'} className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-6">
          <button 
            onClick={handleSave}
            disabled={saving || syncState === 'READ_ONLY'}
            className="px-12 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {saving ? <Activity className="animate-spin" size={16} /> : <Save size={16} />}
            Commit Core Changes
          </button>
        </div>
      </div>
    </div>
  );
};
