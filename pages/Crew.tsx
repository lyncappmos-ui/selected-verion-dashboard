
import React from 'react';
import { coreClient } from '../services/coreClient';
import { useCore } from '../hooks/useCore';
import { CrewMember } from '../types';
import { User, Briefcase, Star, Clock, AlertCircle } from 'lucide-react';

export const Crew: React.FC = () => {
  const { data: crew, syncState, isBroken, reset } = useCore<CrewMember[]>(coreClient.getCrew);

  if (isBroken) {
    return (
      <div className="p-10 text-center bg-white rounded-3xl border border-rose-100">
        <AlertCircle size={40} className="mx-auto text-rose-500 mb-4" />
        <h2 className="text-xl font-bold">Personnel Context Missing</h2>
        <p className="text-slate-500 mt-2">Core node heartbeat lost. Compliance auditing suspended.</p>
        <button onClick={reset} className="mt-6 px-10 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase">Force Reconnect</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Personnel Directory</h1>
          <p className="text-slate-500 text-sm">Managing authorized system crew.</p>
        </div>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-200">Onboard Crew</button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-8 py-5">Personnel</th>
              <th className="px-8 py-5">Role</th>
              <th className="px-8 py-5 text-center">Trust Index</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-medium">
            {(crew || []).map(member => (
              <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shadow-inner">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{member.name}</p>
                      <p className="text-[10px] font-mono text-blue-500">{member.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-slate-500 flex items-center gap-2">
                  <Briefcase size={14} /> {member.role}
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-emerald-600 font-bold mb-1">
                      <Star size={14} fill="currentColor" /> {member.trustScore}%
                    </div>
                    <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${member.trustScore}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    {member.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="text-xs font-bold text-slate-400 hover:text-blue-600">Audit Log</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
