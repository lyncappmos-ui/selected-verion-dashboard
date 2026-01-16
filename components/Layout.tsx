
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Truck, 
  Banknote, 
  MessageSquare, 
  ShieldCheck, 
  Settings,
  Bell,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-blue-600'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`}>
      {icon}
    </span>
    <span className="font-medium">{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const menuItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/trips', icon: <MapPin size={20} />, label: 'Trips' },
    { to: '/fleet', icon: <Truck size={20} />, label: 'Fleet' },
    { to: '/revenue', icon: <Banknote size={20} />, label: 'Revenue' },
    { to: '/sms', icon: <MessageSquare size={20} />, label: 'SMS & Cost' },
    { to: '/trust', icon: <ShieldCheck size={20} />, label: 'Trust' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 fixed h-full z-30 transition-all duration-300 overflow-hidden hidden md:block`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold italic">L</span>
          </div>
          {isSidebarOpen && <span className="font-bold text-xl text-slate-800 tracking-tight">LyncApp MOS</span>}
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={isSidebarOpen ? item.label : ''}
              active={location.pathname === item.to}
            />
          ))}
        </nav>

        <div className="absolute bottom-8 w-full px-4">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-red-600 transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hidden md:block"
            >
              <Menu size={20} />
            </button>
            <div className="block md:hidden w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold italic">L</span>
            </div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              {location.pathname === '/' ? 'Overview' : location.pathname.substring(1).replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800">LyncApp Express</span>
              <span className="text-xs text-slate-400">Supervisor Admin</span>
            </div>
            <div className="relative p-2 text-slate-400 hover:text-blue-600 cursor-pointer">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border border-blue-200">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
