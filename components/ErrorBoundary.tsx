import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class GlobalErrorBoundary extends React.Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Rendering Exception:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-rose-100 shadow-xl shadow-rose-50 text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Rendering Circuit Breaker</h2>
          <p className="text-slate-500 text-sm mt-2 max-w-md">
            The dashboard encountered an unexpected data structure that tripped the safety circuit. 
            Operational integrity is maintained.
          </p>
          <div className="mt-8 flex gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
            >
              <RefreshCw size={14} /> Restart Interface
            </button>
          </div>
        </div>
      );
    }

    // Fix: Access children from this.props after ensuring inheritance from React.Component is correctly typed
    return this.props.children;
  }
}
