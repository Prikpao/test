import React, { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  Plus, 
  Search, 
  Star, 
  Flame, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Trophy, 
  Sparkles, 
  Printer, 
  Filter, 
  User, 
  Trash2,
  BookCheck,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReadingEntry, ReadingBadge } from '../types';
import { READING_BADGES } from '../data/initialData';

interface ReadingScoreTabProps {
  entries: ReadingEntry[];
  onAddEntry: (entry: ReadingEntry) => void;
  onDeleteEntry: (id: string) => void;
  userStudentId: string;
}

export const ReadingScoreTab: React.FC<ReadingScoreTabProps> = ({
  entries,
  onAddEntry,
  onDeleteEntry,
  userStudentId
}) => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<ReadingEntry | null>(null);

  // Form state
  const [studentName, setStudentName] = useState('Julian Sterling');
  const [studentId, setStudentId] = useState(userStudentId || 'OAK-2490');
  const [grade, setGrade] = useState('11th Grade');
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Classic Literature');
  const [totalPages, setTotalPages] = useState<number>(280);
  const [minutesSpent, setMinutesSpent] = useState<number>(360);
  const [rating, setRating] = useState<number>(5);
  const [summary, setSummary] = useState('');
  const [comprehensionScore, setComprehensionScore] = useState<number>(95);
  const [teacher, setTeacher] = useState('Ms. Vance (English Dept)');

  // Calculate stats
  const totalBooks = entries.length;
  const totalPagesSum = entries.reduce((acc, curr) => acc + curr.totalPages, 0);
  const totalPointsSum = entries.reduce((acc, curr) => acc + curr.pointsEarned, 0);
  const avgComprehension = totalBooks > 0 
    ? Math.round(entries.reduce((acc, curr) => acc + curr.comprehensionScore, 0) / totalBooks)
    : 0;

  // Filter entries
  const filteredEntries = entries.filter(e => {
    const matchesSearch = e.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = genreFilter === 'all' || e.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  // Calculate points on the fly for the form
  const calculatePoints = (pages: number, comp: number, stars: number, text: string) => {
    const pagePts = Math.floor(pages * 0.4);
    const compPts = Math.round(comp * 0.8);
    const reviewBonus = text.trim().length > 60 ? 40 : 20;
    const starBonus = stars * 6;
    return pagePts + compPts + reviewBonus + starBonus;
  };

  const currentCalculatedPoints = calculatePoints(totalPages, comprehensionScore, rating, summary);

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim() || !author.trim() || !summary.trim()) {
      setFormError('Please fill in book title, author, and reading reflection.');
      return;
    }
    setFormError(null);

    const newEntry: ReadingEntry = {
      id: `rd-${Date.now().toString().slice(-6)}`,
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      grade,
      bookTitle: bookTitle.trim(),
      author: author.trim(),
      genre,
      totalPages: Number(totalPages) || 100,
      minutesSpent: Number(minutesSpent) || 120,
      dateCompleted: new Date().toISOString().split('T')[0],
      rating,
      summary: summary.trim(),
      comprehensionScore: Number(comprehensionScore) || 90,
      pointsEarned: currentCalculatedPoints,
      verifiedTeacher: teacher
    };

    onAddEntry(newEntry);
    setIsSubmitModalOpen(false);

    // Reset form
    setBookTitle('');
    setAuthor('');
    setSummary('');

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 rounded-3xl p-6 md:p-8 border border-emerald-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 font-semibold flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Academic Reading Challenge
              </span>
              <span className="text-slate-400 text-xs">Official Activity Score Sheet</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Book Score Sheet &amp; Reading Log
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Log literary works, evaluate reading comprehension, submit written reviews, and accrue academic reading points for honors diplomas and scholar badges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-2xl text-sm transition shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Book Score Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Achievement Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Activity Points</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono">{totalPointsSum}</span>
            <span className="text-[11px] text-slate-500 block">Grade Tier: Gold Scholar</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Books Evaluated</span>
            <span className="text-2xl font-extrabold text-white font-mono">{totalBooks}</span>
            <span className="text-[11px] text-emerald-400 block">100% Teacher Verified</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Total Pages Read</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">{totalPagesSum.toLocaleString()}</span>
            <span className="text-[11px] text-slate-500 block">Avg 315 pages / book</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Comprehension Avg</span>
            <span className="text-2xl font-extrabold text-purple-400 font-mono">{avgComprehension}%</span>
            <span className="text-[11px] text-slate-500 block">Standardized Rubric</span>
          </div>
        </div>
      </div>

      {/* Scholar Badges Shelf */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Reading Milestone Badges</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            3 of 5 Unlocked this Term
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {READING_BADGES.map((badge, idx) => {
            const isUnlocked = idx < 4; // demo unlocked state
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between transition ${
                  isUnlocked
                    ? 'bg-slate-800/80 border-amber-500/40 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isUnlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      <Award className="w-4 h-4" />
                    </span>
                    {isUnlocked ? (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/50">
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-600 font-mono">LOCKED</span>
                    )}
                  </div>

                  <h4 className="font-bold text-white mt-2 text-[13px]">{badge.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Genre:
          </span>
          {['all', 'Classic Literature', 'Science Fiction', 'Hard Sci-Fi / Adventure', 'Personal Development'].map(g => (
            <button
              key={g}
              onClick={() => setGenreFilter(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                genreFilter === g
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {g === 'all' ? 'All Genres' : g}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author, reader..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={handlePrintCertificate}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition"
            title="Print Official Reading Score Sheet"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Book Score Sheet Records Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <BookCheck className="w-5 h-5 text-emerald-400" />
            <span>Active Book Score Entries ({filteredEntries.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedEntry(item)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40 uppercase">
                      {item.genre}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                      {item.bookTitle}
                    </h4>
                    <p className="text-xs text-slate-400">By {item.author}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xl font-bold text-amber-400">
                      +{item.pointsEarned}
                    </span>
                    <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Points
                    </span>
                  </div>
                </div>

                {/* Star rating & metrics */}
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-300">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= item.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span>•</span>
                  <span>{item.totalPages} pages</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">
                    {item.comprehensionScore}% score
                  </span>
                </div>

                {/* Review reflection */}
                <p className="text-xs text-slate-300 mt-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 italic leading-relaxed line-clamp-2">
                  "{item.summary}"
                </p>
              </div>

              {/* Card footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>{item.studentName} ({item.studentId})</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {item.verifiedTeacher || 'Verified'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteEntry(item.id);
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Remove Entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit New Book Score Sheet Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-lg text-white">Log Book Score Sheet</h3>
                  <p className="text-xs text-slate-400">Official Reading Challenge &amp; Review Submission</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {formError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs">
                  {formError}
                </div>
              )}
              {/* Student identity */}
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Book Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="e.g. 1984 or The Odyssey"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. George Orwell"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Literary Genre
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Classic Literature">Classic Literature</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="Hard Sci-Fi / Adventure">Hard Sci-Fi / Adventure</option>
                    <option value="Personal Development">Personal Development</option>
                    <option value="AP Prep & STEM">AP Prep &amp; STEM</option>
                    <option value="Historical Fiction">Historical Fiction</option>
                    <option value="Poetry & Drama">Poetry &amp; Drama</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Total Pages Read
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={2500}
                    value={totalPages}
                    onChange={(e) => setTotalPages(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Comprehension Quiz Score & Stars */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Comprehension Quiz Score ({comprehensionScore}%)
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={100}
                    value={comprehensionScore}
                    onChange={(e) => setComprehensionScore(parseInt(e.target.value) || 80)}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Student Book Rating
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-slate-600 hover:text-amber-400 transition"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-slate-400 ml-2 font-mono">
                      {rating} / 5
                    </span>
                  </div>
                </div>
              </div>

              {/* Review summary */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Literary Analysis &amp; Personal Takeaway *
                </label>
                <textarea
                  rows={3}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Summarize the core philosophical dilemma, plot arc, or key concepts learned and how it impacts your perspective..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              {/* Dynamic Points Calculation Preview */}
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-300 block">
                    Calculated Reading Activity Points:
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Based on page count ({totalPages}p) + comprehension ({comprehensionScore}%) + review depth.
                  </span>
                </div>
                <span className="font-mono text-2xl font-black text-amber-400">
                  +{currentCalculatedPoints} pts
                </span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Submit Score Sheet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
