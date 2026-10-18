import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  BookOpen, 
  Calendar, 
  Award, 
  Clock, 
  Mail, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface SMSPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SMSPreviewModal: React.FC<SMSPreviewModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'grades' | 'timetable' | 'attendance' | 'messages'>('grades');

  if (!isOpen) return null;

  const courses = [
    { code: 'AP-CALC-BC', title: 'AP Calculus BC', teacher: 'Dr. Thorne', period: 'P1 (08:40)', room: 'Room 302', grade: '96%', letter: 'A', status: 'Honors' },
    { code: 'AP-ENG-LIT', title: 'AP English Literature', teacher: 'Ms. Vance', period: 'P2 (09:35)', room: 'West Hall 114', grade: '94%', letter: 'A', status: 'Required' },
    { code: 'AP-CHEM', title: 'AP Chemistry & Lab', teacher: 'Mr. Henderson', period: 'P3 (10:45)', room: 'Science Lab 4', grade: '98%', letter: 'A+', status: 'Honors' },
    { code: 'SPAN-IV', title: 'Advanced Spanish IV', teacher: 'Sra. Alvarez', period: 'P4 (11:40)', room: 'Language Wing 203', grade: '91%', letter: 'A-', status: 'Elective' },
    { code: 'ORCH-SYM', title: 'Symphonic Orchestra (Piano/Violin)', teacher: 'Maestro Lindqvist', period: 'P5 (13:25)', room: 'Fine Arts Pavilion', grade: '99%', letter: 'A+', status: 'Arts' },
    { code: 'AP-US-GOV', title: 'AP US Government & Politics', teacher: 'Mrs. Gallagher', period: 'P6 (14:20)', room: 'Social Studies 210', grade: '93%', letter: 'A', status: 'Required' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">School Management System (SMS)</h3>
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded font-mono">
                  v4.8 Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Student Information Portal • Julian Sterling (ID: OAK-2490) • Grade 11
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Snapshot Bar */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">Cumulative GPA</span>
            <span className="font-bold text-emerald-400 text-base font-mono">3.94 / 4.0</span>
            <span className="text-[10px] text-slate-500 block">Weighted: 4.38</span>
          </div>
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">Attendance Record</span>
            <span className="font-bold text-blue-400 text-base font-mono">98.8%</span>
            <span className="text-[10px] text-emerald-400 block">0 Unexcused Absences</span>
          </div>
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">Class Standing</span>
            <span className="font-bold text-amber-400 text-base font-mono">Top 5%</span>
            <span className="text-[10px] text-slate-500 block">Rank 12 of 240</span>
          </div>
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">Graduation Credits</span>
            <span className="font-bold text-indigo-400 text-base font-mono">22.5 / 24</span>
            <span className="text-[10px] text-emerald-400 block">On Track for Honors</span>
          </div>
        </div>

        {/* Modal Navigation tabs */}
        <div className="px-6 py-2 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between overflow-x-auto gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('grades')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'grades' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Course Grades &amp; Midterms
            </button>
            <button
              onClick={() => setActiveTab('timetable')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'timetable' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Daily Schedule &amp; Rooms
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'attendance' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Attendance Log
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'messages' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Faculty Messages (2)
            </button>
          </div>

          <a 
            href="https://sms.oakridge.edu" 
            target="_blank" 
            rel="noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium whitespace-nowrap"
          >
            <span>Open in Full Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'grades' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Fall 2026 Academic Term</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All Midterm Marks Verified
                </span>
              </div>
              
              <div className="space-y-2">
                {courses.map((c) => (
                  <div key={c.code} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{c.title}</span>
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                          {c.code}
                        </span>
                        <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-800/40">
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Instructor: <strong className="text-slate-300">{c.teacher}</strong> • {c.period} ({c.room})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-bold font-mono text-emerald-400">{c.grade}</span>
                      <span className="ml-2 font-bold text-slate-300 text-sm">{c.letter}</span>
                      <span className="block text-[10px] text-slate-500">Updated yesterday</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timetable' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">Regular Bell Schedule: Monday through Friday</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {courses.map((c) => (
                  <div key={c.code} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                      {c.period.split(' ')[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white text-sm">{c.title}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">{c.period.split(' ')[1] || ''}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Room: <span className="text-indigo-300 font-medium">{c.room}</span></p>
                      <p className="text-xs text-slate-400">Teacher: {c.teacher}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white text-sm">Attendance Summary: Fall 2026</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Total Instructional Days: 48 Days</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div><span className="text-slate-400">Present:</span> <strong className="text-emerald-400">47</strong></div>
                  <div><span className="text-slate-400">Excused:</span> <strong className="text-amber-400">1</strong></div>
                  <div><span className="text-slate-400">Tardy:</span> <strong className="text-slate-300">0</strong></div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-800/20 rounded-lg flex items-center justify-between border border-slate-800">
                  <span className="text-slate-300">Oct 09, 2026 • Excused Absence</span>
                  <span className="text-amber-400 font-medium">State Orchestra Regional Audition</span>
                </div>
                <div className="p-3 bg-slate-800/20 rounded-lg flex items-center justify-between border border-slate-800">
                  <span className="text-slate-300">All other school days in Term 1</span>
                  <span className="text-emerald-400 font-medium">100% On-Time Attendance</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold text-sm text-white">Dr. Thorne (AP Calculus BC)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Oct 16, 3:45 PM</span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  "Julian, great work on the Series Convergence assessment! You scored the highest in section B. Don't forget that Study Room A is reserved if you want to run the peer review session on Thursday."
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold text-sm text-white">Ms. Vance (English Literature)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Oct 15, 11:20 AM</span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  "Your book review reflection for the reading challenge has been scored and approved with 245 points added to your score sheet portfolio!"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Protected by Oakridge SIS Encryption • Session Active
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => alert("Official Transcript PDF generated and queued for download.")}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Unofficial Transcript</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
