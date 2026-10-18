import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { RoomBookingTab } from './components/RoomBookingTab';
import { MenuTab } from './components/MenuTab';
import { ReadingScoreTab } from './components/ReadingScoreTab';
import { PortalsTab } from './components/PortalsTab';
import { SMSPreviewModal } from './components/SMSPreviewModal';
import { LibraryModal } from './components/LibraryModal';
import { safeStorage } from './utils/storage';
import { 
  INITIAL_BOOKINGS, 
  INITIAL_MENU_ITEMS, 
  INITIAL_READING_ENTRIES 
} from './data/initialData';
import { RoomBooking, MenuItem, ReadingEntry } from './types';
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  UtensilsCrossed, 
  BookOpen, 
  UserCheck 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'booking' | 'menu' | 'reading' | 'portals'>('overview');
  
  // Modals
  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);

  // User State
  const userStudentId = 'OAK-2490';

  // Room Bookings State
  const [bookings, setBookings] = useState<RoomBooking[]>(() => {
    const saved = safeStorage.getItem('oakridge_room_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_BOOKINGS;
      }
    }
    return INITIAL_BOOKINGS;
  });

  // Cafeteria Menu State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = safeStorage.getItem('oakridge_saved_menu_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MENU_ITEMS;
      }
    }
    return INITIAL_MENU_ITEMS;
  });

  // Reading Score Sheet State
  const [readingEntries, setReadingEntries] = useState<ReadingEntry[]>(() => {
    const saved = safeStorage.getItem('oakridge_reading_entries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_READING_ENTRIES;
      }
    }
    return INITIAL_READING_ENTRIES;
  });

  // Persist bookings
  useEffect(() => {
    safeStorage.setItem('oakridge_room_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Persist reading entries
  useEffect(() => {
    safeStorage.setItem('oakridge_reading_entries', JSON.stringify(readingEntries));
  }, [readingEntries]);

  // Persist menu items
  useEffect(() => {
    safeStorage.setItem('oakridge_saved_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  const handleAddBooking = (newBooking: RoomBooking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const handleAddReadingEntry = (newEntry: ReadingEntry) => {
    setReadingEntries(prev => [newEntry, ...prev]);
  };

  const handleDeleteReadingEntry = (id: string) => {
    setReadingEntries(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Fixed Header with dynamic bell schedule */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookingCount={bookings.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenSMS={() => setIsSMSModalOpen(true)}
            onOpenLibrary={() => setIsLibraryModalOpen(true)}
            menuItems={menuItems}
            bookings={bookings}
            readingEntries={readingEntries}
          />
        )}

        {activeTab === 'booking' && (
          <RoomBookingTab
            bookings={bookings}
            onAddBooking={handleAddBooking}
            onCancelBooking={handleCancelBooking}
            userStudentId={userStudentId}
          />
        )}

        {activeTab === 'menu' && (
          <MenuTab
            menuItems={menuItems}
            setMenuItems={setMenuItems}
          />
        )}

        {activeTab === 'reading' && (
          <ReadingScoreTab
            entries={readingEntries}
            onAddEntry={handleAddReadingEntry}
            onDeleteEntry={handleDeleteReadingEntry}
            userStudentId={userStudentId}
          />
        )}

        {activeTab === 'portals' && (
          <PortalsTab
            onOpenSMS={() => setIsSMSModalOpen(true)}
            onOpenLibrary={() => setIsLibraryModalOpen(true)}
            onOpenReadingScore={() => setActiveTab('reading')}
          />
        )}
      </main>

      {/* Interactive SMS Preview Modal */}
      <SMSPreviewModal
        isOpen={isSMSModalOpen}
        onClose={() => setIsSMSModalOpen(false)}
      />

      {/* Interactive Library Catalog Modal */}
      <LibraryModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        onOpenReadingScore={() => setActiveTab('reading')}
      />

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 border-t border-slate-800 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* School Crest & Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-bold text-base">Oakridge Academy</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Empowering students with state-of-the-art campus learning facilities, acoustic music studios, fresh farm-to-table dining, and literary excellence.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>NEASC &amp; Blue Ribbon Accredited</span>
              </div>
            </div>

            {/* Quick Navigation */}
            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
                Campus Services
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setActiveTab('booking')} className="hover:text-indigo-400 transition flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-indigo-400" /> Study &amp; Piano Room Booking
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('menu')} className="hover:text-amber-400 transition flex items-center gap-1.5">
                    <UtensilsCrossed className="w-3 h-3 text-amber-400" /> Spreadsheet Lunch Menu
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('reading')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-emerald-400" /> Book Score Sheet &amp; Badges
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsSMSModalOpen(true)} className="hover:text-blue-400 transition flex items-center gap-1.5">
                    <UserCheck className="w-3 h-3 text-blue-400" /> School Management System (SMS)
                  </button>
                </li>
              </ul>
            </div>

            {/* Hours & Schedule */}
            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
                Operating Hours
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><strong className="text-slate-200">Main Campus:</strong> 07:30 AM – 06:00 PM</li>
                <li><strong className="text-slate-200">Library &amp; Study Rooms:</strong> 08:00 AM – 07:30 PM</li>
                <li><strong className="text-slate-200">Fine Arts Pavilion:</strong> 08:00 AM – 06:30 PM</li>
                <li><strong className="text-slate-200">Dining Hall Lunch:</strong> 12:30 PM – 01:20 PM</li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
                Campus Directory
              </h4>
              <div className="space-y-2 text-xs">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>450 Academy Way, Oakridge Campus</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Admin Office: (555) 840-2200</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>support@oakridge.edu</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Oakridge Academy. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="hover:text-slate-300 cursor-pointer">Student Code of Conduct</span>
              <span className="hover:text-slate-300 cursor-pointer">Dietary &amp; Food Allergens</span>
              <span className="hover:text-slate-300 cursor-pointer">Facility Reservation Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
