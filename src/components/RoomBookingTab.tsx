import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  MapPin, 
  Check, 
  Plus, 
  Search, 
  Music, 
  BookOpen, 
  Radio, 
  Cpu, 
  Sparkles,
  QrCode,
  Trash2,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Room, RoomBooking, RoomCategory } from '../types';
import { INITIAL_ROOMS, TIME_SLOTS } from '../data/initialData';
import { BookingPassModal } from './BookingPassModal';

interface RoomBookingTabProps {
  bookings: RoomBooking[];
  onAddBooking: (booking: RoomBooking) => void;
  onCancelBooking: (id: string) => void;
  userStudentId: string;
}

export const RoomBookingTab: React.FC<RoomBookingTabProps> = ({
  bookings,
  onAddBooking,
  onCancelBooking,
  userStudentId
}) => {
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory>('all');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('music-1');
  
  // Booking modal form state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [formRoomId, setFormRoomId] = useState<string>('music-1');
  const [formSlot, setFormSlot] = useState<string>('11:00 - 12:00');
  const [studentName, setStudentName] = useState('Julian Sterling');
  const [studentId, setStudentId] = useState(userStudentId || 'OAK-2490');
  const [grade, setGrade] = useState('11th Grade');
  const [groupSize, setGroupSize] = useState<number>(1);
  const [purpose, setPurpose] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Digital pass modal state
  const [activePassBooking, setActivePassBooking] = useState<RoomBooking | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // Filter rooms
  const filteredRooms = INITIAL_ROOMS.filter(r => {
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.amenities.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const selectedRoom = INITIAL_ROOMS.find(r => r.id === selectedRoomId) || INITIAL_ROOMS[0];

  // Helper to check if a specific room + date + slot is occupied
  const getSlotBooking = (roomId: string, date: string, slot: string) => {
    return bookings.find(b => b.roomId === roomId && b.date === date && b.timeSlot === slot);
  };

  const handleOpenBooking = (roomId: string, slot?: string) => {
    setFormRoomId(roomId);
    if (slot) setFormSlot(slot);
    setFormError(null);
    setIsBookingModalOpen(true);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim() || !studentId.trim() || !purpose.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    // Double check conflict
    const conflict = bookings.find(
      b => b.roomId === formRoomId && b.date === selectedDate && b.timeSlot === formSlot
    );

    if (conflict) {
      setFormError(`Conflict: This slot was just reserved by ${conflict.studentName}. Please choose another slot.`);
      return;
    }

    const targetRoom = INITIAL_ROOMS.find(r => r.id === formRoomId);
    if (!targetRoom) return;

    const newBooking: RoomBooking = {
      id: `bk-${Date.now().toString().slice(-6)}`,
      roomId: targetRoom.id,
      roomName: targetRoom.name,
      category: targetRoom.category,
      date: selectedDate,
      timeSlot: formSlot,
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      grade,
      groupSize,
      purpose: purpose.trim(),
      createdAt: new Date().toISOString()
    };

    onAddBooking(newBooking);
    setIsBookingModalOpen(false);
    setPurpose('');
    setFormError(null);

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    // Open digital pass right away
    setActivePassBooking(newBooking);
    setIsPassModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Date Selector */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 rounded-3xl p-6 md:p-8 border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-full border border-indigo-500/30 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Self-Service Campus Facilities
              </span>
              <span className="text-slate-400 text-xs">Real-Time Slot Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Study &amp; Music Room Reservations
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Book soundproof piano suites, ensemble band rehearsal rooms, silent study booths, podcast studios, and maker labs with instant digital check-in passes.
            </p>
          </div>

          {/* Quick Date Navigator */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Select Reservation Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => handleOpenBooking(selectedRoomId)}
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>New Reservation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Facilities', icon: CalendarIcon },
            { id: 'study', label: 'Study Rooms', icon: BookOpen },
            { id: 'music', label: 'Music Rooms (Piano & Band)', icon: Music },
            { id: 'lab', label: 'Podcast & Media Lab', icon: Radio },
            { id: 'creative', label: 'STEM & Maker Space', icon: Cpu }
          ].map(cat => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as RoomCategory)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search piano, podcast, whiteboard..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Main Grid: Facility Cards on Left, Interactive Time Slot Matrix on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Room Selector Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <span>Campus Facilities</span>
              <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                {filteredRooms.length} available
              </span>
            </h3>
          </div>

          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredRooms.map((room) => {
              const isSelected = room.id === selectedRoomId;
              const roomBookingsToday = bookings.filter(
                b => b.roomId === room.id && b.date === selectedDate
              );

              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex gap-4">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-24 h-24 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-white text-sm line-clamp-1">
                          {room.name}
                        </h4>
                        <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/40 uppercase shrink-0">
                          {room.category}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{room.building} • {room.floor}</span>
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Users className="w-3.5 h-3.5 text-slate-500" /> Max {room.capacity}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className={`text-[11px] font-medium ${
                          roomBookingsToday.length >= TIME_SLOTS.length
                            ? 'text-rose-400'
                            : 'text-emerald-400'
                        }`}>
                          {TIME_SLOTS.length - roomBookingsToday.length} slots free today
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {room.amenities.slice(0, 2).map((a, i) => (
                          <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                            {a}
                          </span>
                        ))}
                        {room.amenities.length > 2 && (
                          <span className="text-[10px] text-slate-500">
                            +{room.amenities.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Room Details & Interactive Slot Matrix (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedRoom && (
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
              
              {/* Facility Header & Specs */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs uppercase font-semibold tracking-wider text-indigo-400 font-mono">
                      {selectedRoom.building} • {selectedRoom.floor}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{selectedRoom.name}</h3>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(selectedRoom.id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs transition flex items-center gap-2 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Reserve This Room</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {selectedRoom.description}
                </p>

                {/* Amenities pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedRoom.amenities.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-800/80 border border-slate-700/80 text-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Daily Slot Availability Matrix */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <h4 className="font-bold text-sm text-white">
                      Time Slot Availability for {selectedDate}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-slate-600" /> Reserved
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {TIME_SLOTS.map((slot) => {
                    const existing = getSlotBooking(selectedRoom.id, selectedDate, slot);
                    const isMyBooking = existing && existing.studentId === studentId;

                    if (existing) {
                      return (
                        <div
                          key={slot}
                          onClick={() => {
                            setActivePassBooking(existing);
                            setIsPassModalOpen(true);
                          }}
                          className={`p-3 rounded-xl border text-xs flex flex-col justify-between transition cursor-pointer ${
                            isMyBooking
                              ? 'bg-indigo-950/40 border-indigo-500/50 hover:bg-indigo-950/70'
                              : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-medium text-slate-300">{slot}</span>
                            {isMyBooking ? (
                              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 font-bold px-1.5 py-0.5 rounded">
                                YOU
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono">BOOKED</span>
                            )}
                          </div>
                          
                          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                            <span className="text-slate-400 truncate max-w-[120px]">
                              {existing.studentName}
                            </span>
                            <span className="text-indigo-400 text-[10px] hover:underline flex items-center gap-0.5">
                              <QrCode className="w-3 h-3" /> Pass
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={slot}
                        onClick={() => handleOpenBooking(selectedRoom.id, slot)}
                        className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-xs flex items-center justify-between transition cursor-pointer group"
                      >
                        <div>
                          <span className="font-mono font-medium text-white group-hover:text-emerald-300 transition">
                            {slot}
                          </span>
                          <span className="block text-[10px] text-emerald-400 mt-0.5">
                            Open for Reservation
                          </span>
                        </div>
                        <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition p-1 bg-emerald-500/10 rounded-lg">
                          <Plus className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Room Rules & Guidelines */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1.5">
                <span className="font-semibold text-slate-300 block">
                  Campus Facilities Policy:
                </span>
                <p>• Reservations hold for up to 15 minutes past the start time before being released to walk-ins.</p>
                <p>• Please clean boards, return music cables to stands, and keep noise inside the acoustic isolation threshold.</p>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Active Campus Reservations Section */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-400" />
              <span>Active Campus Reservations ({bookings.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Current student reservations across all study and music rooms. Click any pass to print or export.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Your Student ID:</span>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 w-32"
            />
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No active reservations on file. Select a room and time slot above to reserve a space!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bookings.map((b) => {
              const isMine = b.studentId.toLowerCase() === studentId.toLowerCase();
              return (
                <div
                  key={b.id}
                  className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                    isMine
                      ? 'bg-indigo-950/30 border-indigo-500/40'
                      : 'bg-slate-800/40 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-white text-sm line-clamp-1">{b.roomName}</h4>
                      <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded uppercase">
                        {b.category}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-xs">
                      <p className="text-slate-300 flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{b.date} • <strong className="text-emerald-400 font-mono">{b.timeSlot}</strong></span>
                      </p>
                      <p className="text-slate-400">
                        Reserved by: <strong className="text-slate-200">{b.studentName}</strong> ({b.studentId})
                      </p>
                      <p className="text-slate-400 italic line-clamp-1">
                        "{b.purpose}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setActivePassBooking(b);
                        setIsPassModalOpen(true);
                      }}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Pass / Slip</span>
                    </button>

                    <button
                      onClick={() => onCancelBooking(b.id)}
                      className="text-slate-400 hover:text-rose-400 p-1 rounded transition"
                      title="Cancel Booking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Form Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CalendarIcon className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-lg text-white">Reserve Campus Facility</h3>
              </div>
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Selected Facility
                </label>
                <select
                  value={formRoomId}
                  onChange={(e) => setFormRoomId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {INITIAL_ROOMS.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.category.toUpperCase()} • Cap {r.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={formSlot}
                    onChange={(e) => setFormSlot(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  >
                    {TIME_SLOTS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Julian Sterling"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. OAK-2490"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Grade / Cohort
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="9th Grade">9th Grade (Freshman)</option>
                    <option value="10th Grade">10th Grade (Sophomore)</option>
                    <option value="11th Grade">11th Grade (Junior)</option>
                    <option value="12th Grade">12th Grade (Senior)</option>
                    <option value="Faculty / Staff">Faculty / Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Group Size
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={groupSize}
                    onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Purpose / Rehearsal Focus *
                </label>
                <textarea
                  rows={2}
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g., Practicing Rachmaninoff for winter showcase, or AP Chem study group..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Reservation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Pass Modal */}
      <BookingPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        booking={activePassBooking}
        room={INITIAL_ROOMS.find(r => r.id === activePassBooking?.roomId)}
        onCancelBooking={onCancelBooking}
      />
    </div>
  );
};
