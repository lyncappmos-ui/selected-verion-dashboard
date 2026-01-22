
import React from 'react';
import { coreClient } from '../services/coreClient';
import { useCore } from '../hooks/useCore';
import { SMSMetrics } from '../types';
import { MessageSquare, AlertCircle, Info, Zap } from 'lucide-react';

export const SMSDashboard: React.FC = () => {
  const { data: metrics, syncState, isBroken, reset } = useCore<SMSMetrics>(coreClient.getSMS);

  if (isBroken) {
    return (
      <div className="p-10 text-center bg-white rounded-3xl border border-rose-100">
        <AlertCircle size={40} className="mx-auto text-rose-500 mb-4" />
        <h2 className="text-xl font-bold">Comms Core Failure</h2>
        <p className="text-slate-500 mt-2">Unable to retrieve telemetry for automated messaging.</p>
        <button onClick={reset} className="mt-6 px-8 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase">Restart Comms Sync</button>
      </div>
    );
  }

  const m = metrics || { sent: 0, successRate: 0, totalCost: 0, costPerTicket: 0, failed: 0 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Comms Analytics</h1>
          <p className="text-slate-500 text-sm">Monitoring system-automated notifications.</p>
        </div>
        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-100`}>
          <Zap size={14} className={syncState === 'READY' ? 'animate-pulse' : ''} />
          Channel: {syncState}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Dispatched</p>
          <p className="text-3xl font-bold text-slate-800">{m.sent.toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Fidelity</p>
          <p className="text-3xl font-bold text-emerald-600">{m.successRate}%</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Budget</p>
          <p className="text-3xl font-bold text-slate-800">KES {m.totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avg / Unit</p>
          <p className="text-3xl font-bold text-blue-600">KES {m.costPerTicket}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-xs font-black uppercase text-slate-400">Infrastructure Health</h3>
            <Info size={14} className="text-slate-300" />
          </div>
          <div className="p-10 border border-slate-50 rounded-3xl text-center bg-slate-50/50">
             <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-xs text-slate-500 font-medium">No handover anomalies detected in core routing.</p>
          </div>
        </div>
        <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-xl flex flex-col justify-between border border-slate-800">
          <div>
            <h3 className="text-xl font-bold mb-3 tracking-tighter">Cost Optimisation Identified</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              MOS Core suggests shifting non-critical trip updates to push notifications. Estimated savings: <span className="text-emerald-400 font-bold">KES 12,500/mo</span>.
            </p>
          </div>
          <button className="mt-10 py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all active:scale-95">
            Execute Optimisation Intent
          </button>
        </div>
      </div>
    </div>
  );
};
