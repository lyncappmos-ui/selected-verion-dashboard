
import React from 'react';
import { coreClient } from '../services/coreClient';
import { useCore } from '../hooks/useCore';
import { RevenueSummary } from '../types';
import { Database, ShieldCheck, Lock, Unlock, TrendingUp, Building2, Activity, AlertCircle } from 'lucide-react';

export const Revenue: React.FC = () => {
  const { data, syncState, isBroken, reset } = useCore<RevenueSummary>(coreClient.getRevenue);

  if (isBroken) {
    return (
      <div className="p-10 text-center bg-white rounded-3xl border border-rose-100">
        <AlertCircle className="mx-auto text-rose-500 mb-4" size={40} />
        <h2 className="text-xl font-bold uppercase tracking-tighter">Ledger Connectivity Failed</h2>
        <p className="text-slate-500 mt-2 text-sm">Financial reconciliation engine is isolated from core nodes.</p>
        <button onClick={reset} className="mt-6 px-10 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest">Restart Ledger Sync</button>
      </div>
    );
  }

  const summary = data || { totalMTD: 0, byBranch: [], bySegment: [], dailyClosureStatus: 'pending' as const };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Revenue Reconciliation</h1>
          <p className="text-slate-500 text-sm">Auditing SACCO income distributions.</p>
        </div>
        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${
          summary.dailyClosureStatus === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-700 border-slate-100'
        }`}>
          {summary.dailyClosureStatus === 'open' ? <Unlock size={14} /> : <Lock size={14} />}
          Session: {summary.dailyClosureStatus}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total MTD Revenue</p>
          <p className="text-4xl font-bold text-slate-800">KES {(summary.totalMTD || 0).toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 font-bold">
            <TrendingUp size={14} /> +14.2% Growth
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Hubs</p>
          <p className="text-4xl font-bold text-slate-800">{summary.byBranch?.length || 0}</p>
          <p className="text-xs text-slate-500 mt-4 flex items-center gap-1 font-medium"><Activity size={12} /> Sync active</p>
        </div>
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl shadow-slate-200 relative overflow-hidden">
          <Database size={80} className="absolute -bottom-4 -right-4 opacity-10" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Cryptographic Hash</p>
          <p className="font-mono text-[10px] text-blue-400 truncate mt-2">{summary.blockchainHash || '---'}</p>
          <button className="mt-6 text-[10px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Verify Ledger</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-8 flex items-center gap-2">
            <Building2 size={16} /> Hub Performance
          </h3>
          <div className="space-y-6">
            {(summary.byBranch || []).map(b => (
              <div key={b.branch} className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-slate-700">
                  <span>{b.branch}</span>
                  <span>KES {b.amount.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${summary.totalMTD > 0 ? (b.amount / summary.totalMTD) * 100 : 0}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-8 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" /> Compliance Scoring
          </h3>
          <div className="p-10 border border-slate-50 rounded-3xl text-center">
            <p className="text-4xl font-black text-slate-800">98.4</p>
            <p className="text-[10px] font-black uppercase text-slate-400 mt-2">Aggregate Fidelity Index</p>
          </div>
        </div>
      </div>
    </div>
  );
};
