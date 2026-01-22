
import React, { useEffect, useState, useCallback } from 'react';
import { mosClient, unwrapCoreData } from '../services/mosClient';
import { SMSMetrics, CoreSyncState } from '../types';
import { MessageSquare, AlertCircle, Info, Clock } from 'lucide-react';

export const SMSDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SMSMetrics | null>(null);
  const [syncState, setSyncState] = useState<CoreSyncState>('SYNCING');

  const fetchSMS = useCallback(async () => {
    const response = await mosClient.getSMSMetrics();
    const data = unwrapCoreData(response, setSyncState);
    if (data) setMetrics(data);
  }, []);

  useEffect(() => {
    fetchSMS();
  }, [fetchSMS]);

  if (syncState === 'SYNCING' && !metrics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <Clock className="animate-spin mb-4" size={32} />
        <p className="text-sm font-bold uppercase tracking-widest text-center">Querying Communication Ledger...</p>
      </div>
    );
  }

  // Safe fallback if metrics are null after sync
  const safeMetrics = metrics || { sent: 0, successRate: 0, totalCost: 0, costPerTicket: 0, failed: 0 };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">SMS & Cost Analysis</h1>
          <p className="text-slate-500 text-sm">Monitor automated system communication efficiency and budgets.</p>
        </div>
        <div className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200">
          Quota Status: {syncState === 'OFFLINE' ? 'SNAPSHOT' : 'LIVE'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Sent</p>
          <p className="text-3xl font-bold text-slate-800 tracking-tighter">{safeMetrics.sent.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Delivery Success</p>
          <p className="text-3xl font-bold text-emerald-600 tracking-tighter">{safeMetrics.successRate}%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Cost (MTD)</p>
          <p className="text-3xl font-bold text-slate-800 tracking-tighter">KES {safeMetrics.totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-b-4 border-b-blue-600">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Avg Cost / Unit</p>
          <p className="text-3xl font-bold text-blue-600 tracking-tighter">KES {safeMetrics.costPerTicket}</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4 text-amber-800 shadow-sm">
        <div className="w-10 h-10 bg-amber-200/50 rounded-xl flex items-center justify-center shrink-0">
          <AlertCircle size={20} className="text-amber-700" />
        </div>
        <div>
          <p className="text-sm font-bold">Low Quota Warning</p>
          <p className="text-xs opacity-90 mt-1 font-medium leading-relaxed">At current consumption rates for the morning peak, you will reach your monthly limit in approx. 4.2 days. MOS Core recommends top-up intent.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Infrastructure Breakdown</h3>
            <Info size={14} className="text-slate-300" />
          </div>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                <span>Successful Handover</span>
                <span className="text-emerald-600">{safeMetrics.successRate}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${safeMetrics.successRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl flex flex-col justify-between border border-slate-800 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-10">
            <MessageSquare size={200} />
          </div>
          <div className="relative">
            <h3 className="text-xl font-bold mb-3 tracking-tight">Cost Optimisation Identified</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              MOS Core Analytics suggests disabling automated SMS alerts for trips &lt; 2km. This will reduce monthly overhead by approx. <span className="text-emerald-400 font-bold">KES 18,500</span> without affecting trust scores.
            </p>
          </div>
          <div className="mt-12 relative">
            <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all shadow-xl shadow-black/20 active:scale-95">
              Execute Optimisation Intent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
