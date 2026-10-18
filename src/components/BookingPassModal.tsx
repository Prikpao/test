import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Download, 
  Printer, 
  CheckCircle, 
  QrCode,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { RoomBooking, Room } from '../types';

interface BookingPassModalProps {
  booking: RoomBooking | null;
  room?: Room;
  isOpen: boolean;
  onClose: () => void;
  onCancelBooking: (id: string) => void;
}

export const BookingPassModal: React.FC<BookingPassModalProps> = ({
  booking,
  room,
  isOpen,
  onClose,
  onCancelBooking
}) => {
  if (!isOpen || !booking) return null;

  // Generate .ics calendar file content
  const handleDownloadCalendar = () => {
    const [startH, startM] = booking.timeSlot.split(' - ')[0].split(':');
    const [endH, endM] = booking.timeSlot.split(' - ')[1].split(':');
    const dateFormatted = booking.date.replace(/-/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Oakridge Academy//Room Booking//EN',
      'BEGIN:VEVENT',
      `UID:${booking.id}@oakridge.edu`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${dateFormatted}T${startH}${startM}00`,
      `DTEND:${dateFormatted}T${endH}${endM}00`,
      `SUMMARY:Room Reservation: ${booking.roomName}`,
      `DESCRIPTION:Reserved by ${booking.studentName} (${booking.studentId}) for ${booking.purpose}.`,
      `LOCATION:${room ? `${room.building}, ${room.floor}` : 'Oakridge Academy Campus'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Oakridge-${booking.roomName.replace(/\s+/g, '_')}-${booking.date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in print:bg-white print:p-0">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100 print:border-none print:shadow-none print:text-black print:bg-white">
        
        {/* Pass Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-200">
                Official Campus Digital Pass
              </span>
              <h3 className="text-xl font-bold">Facility Reservation Confirmed</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition print:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Body (Simulated boarding pass styling) */}
        <div className="p-6 space-y-6">
          {/* Room Banner */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-indigo-400 font-semibold block">
                Reserved Facility
              </span>
              <h4 className="text-lg font-bold text-white mt-0.5">{booking.roomName}</h4>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{room ? `${room.building} • ${room.floor}` : 'Campus Facility'}</span>
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/30 uppercase">
              {booking.category}
            </span>
          </div>

          {/* Time & Date Matrix */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 text-xs flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Date
              </span>
              <p className="text-sm font-semibold text-white mt-1">{booking.date}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 text-xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Time Window
              </span>
              <p className="text-sm font-semibold text-emerald-400 mt-1 font-mono">{booking.timeSlot}</p>
            </div>
          </div>

          {/* Student Info & Purpose */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Student Name:</span>
              <span className="font-semibold text-white">{booking.studentName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Student ID / Badge:</span>
              <span className="font-mono text-indigo-300 font-bold">{booking.studentId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Cohort / Grade:</span>
              <span className="text-slate-200">{booking.grade} (Group of {booking.groupSize})</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Stated Purpose:</span>
              <span className="text-slate-300 max-w-xs text-right italic font-medium">{booking.purpose}</span>
            </div>
          </div>

          {/* Simulated QR Code check-in badge */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white p-1 rounded-lg flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-mono">
                  PASS CODE
                </span>
                <span className="font-mono text-sm font-bold text-slate-200">
                  {booking.id.toUpperCase()}-OAK
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Scan at facility lock or front desk reader
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                <Sparkles className="w-3 h-3" /> Auto-Authorized
              </span>
            </div>
          </div>

          {/* Facility guidelines reminder */}
          {room && room.rules.length > 0 && (
            <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl text-[11px] text-amber-300/90 flex gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Facility Rules:</strong> {room.rules.join(' • ')}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <button
            onClick={() => {
              if (window.confirm("Cancel this reservation? The slot will become available for others.")) {
                onCancelBooking(booking.id);
                onClose();
              }
            }}
            className="text-rose-400 hover:text-rose-300 font-medium transition"
          >
            Cancel Reservation
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCalendar}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Add to Calendar (.ics)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
