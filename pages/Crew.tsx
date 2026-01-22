
import React, { useEffect, useState, useCallback } from 'react';
import { mosClient, unwrapCoreData } from '../services/mosClient';
import { CrewMember, CoreSyncState } from '../types';
import { User, Briefcase, Star, Clock } from 'lucide-react';

export const Crew: React.FC = () => {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [syncState, setSyncState] = useState<CoreSyncState>('SYNCING');

  const fetchCrew = useCallback(async () => {
    const response = await mosClient.getCrew();
    const data = unwrapCoreData(response, setSyncState);
    if (data) setCrew(data);
  }, []);

  useEffect(() => {
    fetchCrew();
  }, [fetchCrew]);

  if (syncState === 'SYNCING' && crew.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <Clock className="animate-spin mb-4" size={32} />
        <p className="text-sm font-bold uppercase tracking-widest text-center">Consulting Personnel Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Crew Directory</h1>
          <p className="text-slate-500 text-sm">System personnel lifecycle and integrity monitoring.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700">
          Onboard Crew
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 border-b border-slate-100 tracking-widest">
                <th className="px-8 py-5">Personnel</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Assigned Vehicle</th>
                <th className="px-8 py-5 text-center">Trust Index</th>
                <th className="px-8 py-5">Current Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {crew.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400">No active personnel in local sync.</td>
                </tr>
              ) : crew.map(member => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{member.name}</p>
                        <p className="text-[10px] font-mono text-blue-500">{member.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-500 font-medium capitalize">
                      <Briefcase size={14} /> {member.role}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-mono font-bold text-slate-700 uppercase">{member.assignedVehicle || '---'}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1 text-emerald-600 font-bold">
                        <Star size={14} fill="currentColor" /> {member.trustScore}%
                      </div>
                      <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${member.trustScore}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase">
                      {member.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
                      View Dossier
                    </button>
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
