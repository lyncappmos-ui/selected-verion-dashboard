
import React, { useEffect, useState, useCallback } from 'react';
import { mosClient, unwrapCoreData } from '../services/mosClient';
import { CoreSyncState } from '../types';
import { ShieldCheck, AlertTriangle, Search, Fingerprint, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

export const Trust: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [syncState, setSyncState] = useState<CoreSyncState>('SYNCING');

  const fetchTrust = useCallback(async () => {
    const response = await mosClient.getTrustScores();
    const unwrapped = unwrapCoreData(response, setSyncState);
    if (unwrapped) setData(unwrapped);
  }, []);

  useEffect(() => {
    fetchTrust();
  }, [fetchTrust]);

  if (syncState === 'SYNCING' && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <Clock className="animate-spin mb-4" size={32} />
        <p className="text-sm font-bold uppercase tracking-widest text-center">Consulting Integrity Engine...</p>
      </div>
    );
  }

  // Safe fallback if data is null
  const trustData = data || { average: 0, anomalies: 0, trends: [] };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Trust & Integrity Engine</h1>
          <p className="text-slate-500 text-sm">Behavioral scoring and compliance monitoring for operational safety.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2">
            <Search size={16} /> Audit Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-28 h-28 rounded-full border-[10px] border-emerald-50 flex items-center justify-center mb-6 relative">
            <span className="text-4xl font-black text-emerald-600">{trustData.average}%</span>
            <div className="absolute -bottom-2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
              {trustData.average > 90 ? 'NOMINAL' : 'MONITOR'}
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Aggregate SACCO Trust Index</h3>
          <p className="text-slate-400 text-xs mt-2 max-w-xs leading-relaxed">
            Computed by MOS Core based on route fidelity, timing adherence, and financial honesty.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">7-Day Integrity Trend</h3>
            <Fingerprint size={16} className="text-slate-200" />
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trustData.trends || []}>
                <XAxis dataKey="day" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}
                />
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
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 flex gap-4">
          <AlertTriangle className="text-rose-600 shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-rose-900">Active Compliance Flags: {trustData.anomalies}</h4>
            <p className="text-xs text-rose-700 mt-1">MOS Core detected {trustData.anomalies} route deviations exceeding the variance threshold today.</p>
            <button className="mt-4 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-[10px] font-bold shadow-md hover:bg-rose-700 transition-all uppercase tracking-widest">Investigate Now</button>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Audit Readiness Indicators</h3>
             <ShieldCheck size={16} className="text-emerald-500" />
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
             <div className="p-4 bg-slate-50 rounded-xl">
               <p className="text-[10px] font-bold text-slate-400 uppercase">Fidelity</p>
               <p className="text-xl font-bold text-slate-800">98.4%</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-xl">
               <p className="text-[10px] font-bold text-slate-400 uppercase">Filing</p>
               <p className="text-xl font-bold text-slate-800">100%</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-xl">
               <p className="text-[10px] font-bold text-slate-400 uppercase">Integrity</p>
               <p className="text-xl font-bold text-slate-800">92.1%</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
