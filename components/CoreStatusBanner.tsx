
import React from 'react';
import { CoreSyncState } from '../types';
import { Zap, ZapOff, ShieldAlert, Lock, Clock } from 'lucide-react';

interface Props {
  state: CoreSyncState;
  lastSync?: string;
}

export const CoreStatusBanner: React.FC<Props> = ({ state, lastSync }) => {
  const configs = {
    SYNCING: { bg: 'bg-blue-600', text: 'text-white', icon: <Clock size={14} className="animate-spin" />, label: 'Synchronizing with MOS Core...' },
    READY: { bg: 'bg-emerald-500', text: 'text-white', icon: <Zap size={14} fill="white" />, label: 'MOS Core: Operational' },
    DEGRADED: { bg: 'bg-amber-500', text: 'text-white', icon: <ShieldAlert size={14} />, label: 'MOS Core: Degraded Performance' },
    READ_ONLY: { bg: 'bg-slate-800', text: 'text-white', icon: <Lock size={14} />, label: 'MOS Core: Read-Only Mode (Compliance Lock)' },
    OFFLINE: { bg: 'bg-rose-600', text: 'text-white', icon: <ZapOff size={14} />, label: 'MOS Core: Offline - Snapshot Mode' },
  };

  const config = configs[state];

  return (
    <div className={`${config.bg} ${config.text} px-8 py-2 flex items-center justify-between transition-all duration-500`}>
      <div className="flex items-center gap-3">
        {config.icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{config.label}</span>
      </div>
      {lastSync && (
        <div className="text-[10px] font-bold opacity-70">
          Last Check: {new Date(lastSync).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};
