
import React, { useEffect, useState, useCallback } from 'react';
import { mosClient, parseCoreResponse, safeCurrency } from '../services/mosClient';
import { RevenueSummary, CoreSyncState } from '../types';
import { Database, ShieldAlert, Lock, Unlock, Activity, Building2, TrendingUp, Clock } from 'lucide-react';

export const Revenue: React.FC = () => {
  const [data, setData] = useState<RevenueSummary | null>(null);
  const [syncState, setSyncState] = useState<CoreSyncState>('SYNCING');

  const fetchRevenue = useCallback(async () => {
    const res = await mosClient.getRevenueSummary();
    const { data, syncState } = parseCoreResponse(res);
    if (data) setData(data);
    setSyncState(syncState);
  }, []);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  if (syncState === 'SYNCING' && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <Clock className="animate-spin mb-4" size={32} />
        <p className="text-sm font-bold uppercase tracking-widest text-center">Reconciling Financial Ledger with MOS Core...</p>
      </div>
    );
  }

  // Final safety check: if data is still null, render a safe empty state instead of crashing
  const summary = data || { totalMTD: 0, byBranch: [], bySegment: [], dailyClosureStatus: 'pending' as const };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Revenue Reconciliation</h1>
          <p className="text-slate-500 text-sm">Auditing SACCO income distributions and operational day closures.</p>
        </div>
        <div className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border ${
          summary.dailyClosureStatus === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-700 border-slate-100'
        }`}>
          {summary.dailyClosureStatus === 'open' ? <Unlock size={16} /> : <Lock size={16} />}
          DAY STATUS: {summary.dailyClosureStatus.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total MTD Revenue</p>
          <p className="text-3xl font-bold text-slate-800">{safeCurrency(summary.totalMTD)}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 font-bold">
            <TrendingUp size={14} /> +14.2% from prev. month
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-blue-600">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Branch Share</p>
          <p className="text-3xl font-bold text-slate-800">{summary.byBranch.length} Hubs</p>
          <p className="text-xs text-slate-500 mt-4">Active reconciliation in progress</p>
        </div>
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 shadow-sm">
          <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Pending Lockouts</p>
          <p className="text-3xl font-bold text-rose-700">KES 52,000</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-rose-600 font-bold">
            <ShieldAlert size={14} /> 2 Vehicles restricted
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-8 flex items-center gap-2">
            <Building2 size={16} /> Branch Breakdown
          </h3>
          <div className="space-y-6">
            {summary.byBranch.map(b => (
              <div key={b.branch} className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-slate-700">
                  <span>{b.branch}</span>
                  <span>{safeCurrency(b.amount)}</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${summary.totalMTD > 0 ? (b.amount / summary.totalMTD) * 100 : 0}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-8 flex items-center gap-2">
            <Activity size={16} /> Segment Performance
          </h3>
          <div className="space-y-6">
            {summary.bySegment.map(s => (
              <div key={s.segment} className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-slate-700">
                  <span>{s.segment}</span>
                  <span>{safeCurrency(s.amount)}</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 transition-all duration-1000" style={{ width: `${summary.totalMTD > 0 ? (s.amount / summary.totalMTD) * 100 : 0}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-slate-800 rounded-2xl text-blue-400 border border-slate-700">
            <Database size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Cryptographic Day-End Verification</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-lg leading-relaxed">
              All revenue state for the current operational window is hashed and anchored to the LyncApp MOS Core ledger. This process ensures absolute finality and auditability.
            </p>
          </div>
        </div>
        <div className="text-center md:text-right bg-slate-800/50 p-4 rounded-xl border border-slate-800 min-w-[200px]">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active State Hash</p>
          <p className="font-mono text-[10px] text-blue-400 mt-2 truncate max-w-[180px] mx-auto md:mx-0">{summary.blockchainHash || '---'}</p>
          <button className="mt-4 text-[10px] font-black uppercase text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">Verify Ledger</button>
        </div>
      </div>
    </div>
  );
};
