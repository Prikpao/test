import React from 'react';
import { 
  Calendar, 
  UtensilsCrossed, 
  BookOpen, 
  UserCheck, 
  Library, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Bell, 
  Flame, 
  Leaf, 
  Music, 
  GraduationCap, 
  FileSpreadsheet,
  Award
} from 'lucide-react';
import { MenuItem, RoomBooking, ReadingEntry, AnnouncementItem } from '../types';
import { INITIAL_ROOMS, ANNOUNCEMENTS } from '../data/initialData';

interface OverviewTabProps {
  onNavigate: (tab: 'booking' | 'menu' | 'reading' | 'portals') => void;
  onOpenSMS: () => void;
  onOpenLibrary: () => void;
  menuItems: MenuItem[];
  bookings: RoomBooking[];
  readingEntries: ReadingEntry[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onNavigate,
  onOpenSMS,
  onOpenLibrary,
  menuItems,
  bookings,
  readingEntries
}) => {
  const todayDayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  
  // Find today's menu item or default to first
  const todayMenu = menuItems.find(
    m => m.day.toLowerCase() === todayDayName.toLowerCase()
  ) || menuItems[0];

  const totalPoints = readingEntries.reduce((sum, item) => sum + item.pointsEarned, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 border border-indigo-800/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-full border border-indigo-500/30 font-semibold flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Oakridge Collegiate Hub
              </span>
              <span className="text-slate-400 text-xs">Fall 2026 Academic Term</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, Julian Sterling
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Your centralized station for reserving soundproof music &amp; study rooms, viewing today's kitchen spreadsheet menu, logging book score sheets, and opening SMS records.
            </p>
          </div>

          {/* Quick Action Pill Grid */}
          <div className="grid grid-cols-2 gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('booking')}
              className="p-3.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-2xl text-xs font-semibold transition flex items-center gap-2.5 shadow-lg shadow-indigo-600/20 border border-indigo-400/30 text-left"
            >
              <Calendar className="w-4 h-4 text-indigo-200" />
              <div>
                <span>Reserve Room</span>
                <span className="block text-[10px] text-indigo-200 font-normal">Piano &amp; Study</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('menu')}
              className="p-3.5 bg-amber-600/80 hover:bg-amber-600 text-white rounded-2xl text-xs font-semibold transition flex items-center gap-2.5 shadow-lg shadow-amber-600/20 border border-amber-400/30 text-left"
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-200" />
              <div>
                <span>Today's Lunch</span>
                <span className="block text-[10px] text-amber-200 font-normal">Spreadsheet Live</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('reading')}
              className="p-3.5 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-2xl text-xs font-semibold transition flex items-center gap-2.5 shadow-lg shadow-emerald-600/20 border border-emerald-400/30 text-left"
            >
              <BookOpen className="w-4 h-4 text-emerald-200" />
              <div>
                <span>Book Score Sheet</span>
                <span className="block text-[10px] text-emerald-200 font-normal">Reading Challenge</span>
              </div>
            </button>

            <button
              onClick={onOpenSMS}
              className="p-3.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-2xl text-xs font-semibold transition flex items-center gap-2.5 shadow-lg shadow-blue-600/20 border border-blue-400/30 text-left"
            >
              <UserCheck className="w-4 h-4 text-blue-200" />
              <div>
                <span>Launch SMS</span>
                <span className="block text-[10px] text-blue-200 font-normal">GPA 3.94 / Grades</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: At-A-Glance Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Today's Lunch & Active Bookings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Today's Dining Spotlight (Spreadsheet Driven) */}
          {todayMenu && (
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span>Today's Lunch Menu ({todayMenu.day})</span>
                      <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.2 rounded font-mono">
                        Spreadsheet Sync
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">Farm-to-school fresh daily nutrition</p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('menu')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  <span>Full Week</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    Hot Entrée
                  </span>
                  <p className="font-semibold text-white text-sm leading-snug">
                    {todayMenu.main}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{todayMenu.calories || 580} kcal</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-1">
                    <Leaf className="w-3 h-3 text-emerald-400" /> Vegetarian Alternative
                  </span>
                  <p className="font-medium text-emerald-300 text-sm leading-snug">
                    {todayMenu.vegetarian}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Sides: {todayMenu.side}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-slate-300">Allergen Safety:</span>
                  {todayMenu.allergens.map((alg, i) => (
                    <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                      {alg}
                    </span>
                  ))}
                </div>
                {todayMenu.dessert && (
                  <span className="italic text-slate-300">
                    Dessert: {todayMenu.dessert}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Active Facility Reservations Preview */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Your Active Room Reservations</h3>
                  <p className="text-xs text-slate-400">Study, Piano, &amp; Media Labs</p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('booking')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <span>Book Another</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {bookings.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  onClick={() => onNavigate('booking')}
                  className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-indigo-500/40 transition flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {b.category === 'music' ? <Music className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-xs group-hover:text-indigo-300 transition-colors">
                        {b.roomName}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {b.date} • <strong className="text-emerald-400 font-mono">{b.timeSlot}</strong>
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded uppercase">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Reading Score & Campus Announcements (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Reading Activity & Score Sheet Summary Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Book Score Sheet</h3>
                  <p className="text-xs text-slate-400">Reading Challenge Portfolio</p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('reading')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <span>View Sheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-300 font-medium block">
                  Cumulative Activity Points
                </span>
                <span className="font-mono text-2xl font-black text-amber-400">
                  {totalPoints} pts
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {readingEntries.length} evaluated titles on record
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                Top 8%
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Recent Book Review
              </span>
              {readingEntries[0] && (
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <div className="flex justify-between font-semibold text-white">
                    <span>{readingEntries[0].bookTitle}</span>
                    <span className="text-amber-400 font-mono">+{readingEntries[0].pointsEarned} pts</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 italic line-clamp-2">
                    "{readingEntries[0].summary}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Campus Notices & Announcements */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Campus Notices</h3>
                <p className="text-xs text-slate-400">Official Administration Bulletins</p>
              </div>
            </div>

            <div className="space-y-3">
              {ANNOUNCEMENTS.map((ann) => (
                <div key={ann.id} className="p-3 bg-slate-800/30 rounded-xl border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{ann.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{ann.date}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
