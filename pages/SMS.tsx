
import React, { useEffect, useState } from 'react';
import { mosApi } from '../services/api';
import { SMSMetrics } from '../types';
import { MessageSquare, AlertCircle, Info } from 'lucide-react';

export const SMSDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SMSMetrics | null>(null);

  useEffect(() => {
    mosApi.getSMSMetrics().then(setMetrics);
  }, []);

  if (!metrics) return <div>Loading SMS Data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">SMS & Cost Dashboard</h1>
          <p className="text-slate-500">Monitor automated system communication efficiency.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-bold border border-blue-100">
          Current Balance: 42,400 Units
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Sent</p>
          <p className="text-3xl font-bold text-slate-800">{metrics.sent.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Success Rate</p>
          <p className="text-3xl font-bold text-emerald-600">{metrics.successRate}%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Cost (MTD)</p>
          <p className="text-3xl font-bold text-slate-800">KES {metrics.totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Cost / Ticket</p>
          <p className="text-3xl font-bold text-blue-600">KES {metrics.costPerTicket}</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 text-amber-800">
        <AlertCircle className="shrink-0" size={20} />
        <div>
          <p className="text-sm font-bold">SMS Quota Warning</p>
          <p className="text-xs opacity-90 mt-0.5">At current usage rates, you will reach your monthly limit in 5 days. Consider topping up.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="font-bold text-slate-800">Delivery Status Breakdown</h3>
            <Info size={14} className="text-slate-400" />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-500">Delivered</span>
                <span className="font-bold text-slate-800">15,280</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[98.5%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-500">Failed (No Signal)</span>
                <span className="font-bold text-slate-800">92</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-[1.5%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-500">Pending</span>
                <span className="font-bold text-slate-800">28</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-300 w-[0.8%]"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">Automated Optimization</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our AI system has identified that sending SMS notifications for short-haul trips (under 5km) currently costs KES 12,000 monthly.
            </p>
          </div>
          <div className="mt-8">
            <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
              Apply Recommended Limits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
