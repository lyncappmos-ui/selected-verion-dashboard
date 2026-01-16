
import React, { useEffect, useState } from 'react';
import { mosApi } from '../services/api';
import { Shield, ShieldAlert, Zap, Search } from 'lucide-react';

export const Trust: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    mosApi.getTrustSummary().then(setSummary);
  }, []);

  if (!summary) return <div>Analyzing Compliance...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Trust & Compliance</h1>
        <p className="text-slate-500">Integrity scores and behavior analysis for operational safety.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full border-8 border-emerald-100 flex items-center justify-center mb-4 relative">
            <span className="text-3xl font-black text-emerald-600">{summary.averageTrustScore}</span>
            <div className="absolute -bottom-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Excellent
            </div>
          </div>
          <h3 className="font-bold text-slate-800">System Trust Index</h3>
          <p className="text-slate-400 text-xs mt-1">Based on 1,240 completed trips today</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Zap size={20} /></div>
            <h3 className="font-bold text-slate-800">Deviations</h3>
          </div>
          <p className="text-4xl font-bold text-slate-800">{summary.deviations}</p>
          <p className="text-sm text-slate-500 mt-2">Route timing & path variances</p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-rose-500 font-bold">+12% increase</span>
            <span className="text-slate-400">vs yesterday</span>
          </div>
        </div>

        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg"><ShieldAlert size={20} /></div>
            <h3 className="font-bold text-rose-900">Fraud Alerts</h3>
          </div>
          <p className="text-4xl font-bold text-rose-700">{summary.anomalies}</p>
          <p className="text-sm text-rose-600 mt-2">Active investigations required</p>
          <button className="mt-6 w-full py-2 bg-rose-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-rose-700">
            View Fraud Queue
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Vehicle Integrity Scores</h3>
          <div className="flex gap-2">
            <button className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">By Conductor</button>
            <button className="text-xs font-bold text-slate-400 px-3 py-1.5 rounded-lg">By Vehicle</button>
          </div>
        </div>
        <div className="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                <th className="px-8 py-3">Vehicle</th>
                <th className="px-8 py-3">Assigned Crew</th>
                <th className="px-8 py-3 text-center">Trust Score</th>
                <th className="px-8 py-3">Last Violation</th>
                <th className="px-8 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {[
                { v: 'KDA 123A', c: 'David M.', s: 98, l: 'None' },
                { v: 'KDB 456B', c: 'Sarah O.', s: 94, l: '10 min idle' },
                { v: 'KDC 789C', c: 'James K.', s: 82, l: 'Route Deviation' },
                { v: 'KDD 012D', c: 'Felix W.', s: 89, l: 'Late Start' },
              ].map(row => (
                <tr key={row.v} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4 font-bold text-slate-700">{row.v}</td>
                  <td className="px-8 py-4 text-slate-600">{row.c}</td>
                  <td className="px-8 py-4">
                    <div className="flex justify-center">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.s > 90 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {row.s}%
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-slate-400 italic">{row.l}</td>
                  <td className="px-8 py-4">
                    <button className="text-blue-600 font-bold text-xs hover:underline">Monitor Live</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
