import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  UtensilsCrossed, 
  BookOpen, 
  ExternalLink, 
  LayoutDashboard, 
  Sparkles,
  ChevronRight,
  Bell
} from 'lucide-react';
import { BELL_SCHEDULE } from '../data/initialData';

interface HeaderProps {
  activeTab: 'overview' | 'booking' | 'menu' | 'reading' | 'portals';
  setActiveTab: (tab: 'overview' | 'booking' | 'menu' | 'reading' | 'portals') => void;
  bookingCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, bookingCount }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentPeriod, setCurrentPeriod] = useState<string>('Active Campus Hours');
  const [periodTimeLeft, setPeriodTimeLeft] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now);

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentMinOfDay = hours * 60 + minutes;

      let found = false;
      for (const item of BELL_SCHEDULE) {
        const [sH, sM] = item.start.split(':').map(Number);
        const [eH, eM] = item.end.split(':').map(Number);
        const startMin = sH * 60 + sM;
        const endMin = eH * 60 + eM;

        if (currentMinOfDay >= startMin && currentMinOfDay <= endMin) {
          const diff = endMin - currentMinOfDay;
          setCurrentPeriod(item.name);
          setPeriodTimeLeft(`${diff}m left`);
          found = true;
          break;
        }
      }

      if (!found) {
        if (currentMinOfDay < 8 * 60 + 15) {
          setCurrentPeriod('Pre-Class Campus Open');
          setPeriodTimeLeft('Starts 08:15');
        } else {
          setCurrentPeriod('After-School Activities & Evening Booking');
          setPeriodTimeLeft('Until 17:30');
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  interface NavItem {
    id: 'overview' | 'booking' | 'menu' | 'reading' | 'portals';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    subBadge?: string;
    highlight?: boolean;
  }

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Campus Hub', icon: LayoutDashboard },
    { id: 'booking', label: 'Room Booking', icon: Calendar, badge: bookingCount > 0 ? bookingCount : undefined },
    { id: 'menu', label: 'Cafeteria Menu', icon: UtensilsCrossed, subBadge: 'Spreadsheet' },
    { id: 'reading', label: 'Book Score Sheet', icon: BookOpen, highlight: true },
    { id: 'portals', label: 'SMS & Library Portals', icon: ExternalLink }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xl backdrop-blur-md bg-opacity-95">
      {/* Top micro-bar: Live status, bell schedule & academy notice */}
      <div className="bg-slate-950/80 px-4 py-1.5 border-b border-slate-800/80 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Campus System
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Current Bell:</span>
              <strong className="text-slate-200">{currentPeriod}</strong>
              <span className="text-indigo-400 font-mono text-[11px] bg-indigo-950 px-1.5 py-0.2 rounded border border-indigo-800/50">
                {periodTimeLeft}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-slate-400 font-mono text-[11px]">
              {formattedDate} • {formattedTime}
            </span>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1 text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40 text-[11px]">
              <Bell className="w-3 h-3 text-amber-400 animate-bounce" />
              <span>Term 1 Midterms Ongoing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand crest & school name */}
        <div 
          onClick={() => setActiveTab('overview')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-indigo-400 group-hover:text-cyan-300 transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                Oakridge Academy
              </h1>
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded border border-indigo-500/30 uppercase">
                Student Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span>Rooms, Menus, Reading Scores &amp; SMS</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </p>
          </div>
        </div>

        {/* Tab navigation pills */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap relative ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>

                {item.badge !== undefined && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}

                {item.subBadge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                  }`}>
                    {item.subBadge}
                  </span>
                )}

                {item.highlight && !isActive && (
                  <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
