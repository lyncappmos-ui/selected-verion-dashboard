import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';

export const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
            <span className="text-white text-3xl font-bold italic">L</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">LyncApp <span className="text-blue-600">MOS</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Enterprise Administration Portal</p>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-xl shadow-slate-200/60 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Administrator ID</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  defaultValue="admin@lyncexpress.ai"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700" 
                  placeholder="Enter your ID"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Token</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="password" 
                  defaultValue="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700" 
                  placeholder="Enter your token"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-xs text-slate-500 group-hover:text-slate-700 font-medium">Remember session</span>
              </label>
              <a href="#" className="text-xs text-blue-600 font-bold hover:underline">Revoke Token?</a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-300 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Authenticate <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 grayscale opacity-40">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <Shield size={14} /> MOS Core v2.4
          </div>
          <div className="w-px h-3 bg-slate-300"></div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Auth Authority: SACCO-LYNC-001
          </div>
        </div>
      </div>
    </div>
  );
};