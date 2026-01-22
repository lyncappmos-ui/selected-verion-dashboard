
import React from 'react';
import { coreClient } from '../services/coreClient';
import { useCore } from '../hooks/useCore';
import { ShieldCheck, AlertTriangle, Fingerprint, Search, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

export const Trust: React.FC = () => {
  const { data, syncState, isBroken, reset, retry } = useCore<any>(coreClient.getTrust);

  if (isBroken) {
    return (
      <div className="p-10 text-center bg-white rounded-3xl border border-rose-100">
        <Fingerprint className="mx-auto text-rose-500 mb-4" size={48} />
        <h2 className="text-xl font-bold uppercase tracking-widest">Behavioral Core Locked</h2>
        <p className="text-slate-500 mt-2 text-sm">Trust engine is isolated. Behavioral scoring disabled.</p>
        <button onClick={reset} className="mt-8 px-10 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase">Reset Integrity Engine</button>
      </div>
    );
  }

  const trustData = data || { average: 0, anomalies: 0, trends: [] };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Trust Engine</h1>
          <p className="text-slate-500 text-sm">Compliance and behavioral monitoring.</p>
        </div>
        <button onClick={() => retry()} className="p-2 text-slate-400 hover:text-blue-600">
          <RefreshCw size={20} className={syncState === 'SYNCING' ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full border-[12px] border-emerald-50 flex items-center justify-center mb-6 shadow-inner relative">
            <span className="text-4xl font-black text-emerald-600">{trustData.average}%</span>
            {syncState === 'READY' && <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white animate-pulse"></div>}
          </div>
          <h3 className="text-lg font-bold text-slate-800">Aggregate Integrity Score</h3>
          <p className="text-slate-400 text-xs mt-2 max-w-xs leading-relaxed font-medium">Real-time computation based on route fidelity and financial honesty logs.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
            <Fingerprint size={14} /> 7-Day Fidelity Trend
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trustData.trends || []}>
                <XAxis dataKey="day" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {(trustData.trends || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 90 ? '#10b981' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100 flex gap-4">
          <AlertTriangle className="text-rose-600 shrink-0" size={28} />
          <div>
            <h4 className="font-bold text-rose-900">Active Anomalies: {trustData.anomalies}</h4>
            <p className="text-xs text-rose-700 mt-1 font-medium leading-relaxed">System nodes detected route deviations exceeding authorized variance thresholds.</p>
            <button className="mt-6 px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200">Investigate Now</button>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center">
               <ShieldCheck size={32} />
             </div>
             <div>
               <h3 className="font-bold text-slate-800">Audit Readiness Registry</h3>
               <p className="text-slate-400 text-xs font-medium mt-1">All operational logs are cryptographically prepared for external filing.</p>
             </div>
           </div>
           <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">Export Ledger</button>
        </div>
      </div>
    </div>
  );
};
