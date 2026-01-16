
import React from 'react';
import { DollarSign, FileText, Download, TrendingUp } from 'lucide-react';

export const Revenue: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Revenue & Reconciliation</h1>
          <p className="text-slate-500">Financial auditing and income distribution reporting.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold flex items-center gap-2 text-slate-600 hover:bg-slate-50 transition-colors">
            <FileText size={18} /> Daily Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-2 w-fit bg-emerald-50 text-emerald-600 rounded-lg mb-4">
            <DollarSign size={24} />
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Net Revenue (MTD)</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1">KES 4.2M</p>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[75%]"></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">75% of monthly target achieved</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-2 w-fit bg-blue-50 text-blue-600 rounded-lg mb-4">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Avg. Revenue per Trip</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1">KES 2,450</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600">
            <span>+4.2%</span>
            <span className="text-slate-400 font-normal">from last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-rose-500">
          <h3 className="text-slate-500 text-sm font-medium">Unreconciled Alerts</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1">12 Anomalies</p>
          <button className="mt-4 text-xs font-bold text-blue-600 uppercase tracking-wider hover:underline">
            Resolve all now &rarr;
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Route-wise Performance Breakdown</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {[
              { route: 'Nairobi - Thika', revenue: 1250000, color: 'bg-blue-500' },
              { route: 'CBD - Westlands', revenue: 840000, color: 'bg-purple-500' },
              { route: 'Nairobi - Nakuru', revenue: 620000, color: 'bg-amber-500' },
              { route: 'Thika - Garissa', revenue: 320000, color: 'bg-slate-500' },
            ].map(item => (
              <div key={item.route} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-700">{item.route}</span>
                  <span className="text-slate-900 font-bold">KES {item.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${(item.revenue / 1250000) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
