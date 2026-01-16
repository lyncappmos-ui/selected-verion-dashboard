
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, MapPin, Building2, Truck, Users, 
  Banknote, ShieldCheck, Settings, Menu, Bell, User, LogOut, Link2, Link2Off
} from 'lucide-react';
import { isBridgeActive } from '../services/mosClient';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [bridgeStatus, setBridgeStatus] = useState(false);

  useEffect(() => {
    // Check bridge status periodically
    const timer = setInterval(() => {
      setBridgeStatus(isBridgeActive());
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { to: '/trips', icon: <MapPin size={20} />, label: 'Trips' },
    { to: '/branches', icon: <Building2 size={20} />, label: 'Branches' },
    { to: '/vehicles', icon: <Truck size={20} />, label: 'Vehicles' },
    { to: '/crew', icon: <Users size={20} />, label: 'Crew' },
    { to: '/revenue', icon: <Banknote size={20} />, label: 'Revenue' },
    { to: '/trust', icon: <ShieldCheck size={20} />, label: 'Trust' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans antialiased text-slate-900">
      {/* Sidebar */}
      <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 fixed h-full z-40 transition-all duration-300`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold italic">L</span>
          </div>
          {isOpen && <span className="ml-3 font-bold text-lg tracking-tight text-slate-800">LyncApp <span className="text-blue-600">MOS</span></span>}
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                location.pathname === item.to 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              {item.icon}
              {isOpen && <span className="font-medium text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 w-full px-4">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-400 hover:text-rose-600 transition-colors"
          >
            <LogOut size={20} />
            {isOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
              <Menu size={20} />
            </button>
            
            {/* MOS Core Status Badge */}
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${
              bridgeStatus 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              {bridgeStatus ? <Link2 size={12} /> : <Link2Off size={12} />}
              {bridgeStatus ? 'MOS Connected' : 'Bridge Simulated'}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">LyncApp Express</span>
              <span className="text-sm font-bold text-slate-800">Branch Supervisor</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
