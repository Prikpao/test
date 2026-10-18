import React, { useState } from 'react';
import { 
  X, 
  Library, 
  Search, 
  BookMarked, 
  Check, 
  Clock, 
  ExternalLink,
  BookOpen,
  Filter
} from 'lucide-react';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReadingScore: () => void;
}

interface LibraryBook {
  id: string;
  title: string;
  author: string;
  callNumber: string;
  genre: string;
  pages: number;
  availableCopies: number;
  totalCopies: number;
  coverImage: string;
  isReserved?: boolean;
}

const SAMPLE_BOOKS: LibraryBook[] = [
  {
    id: 'bk-01',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    callNumber: 'FIC LEE-01',
    genre: 'Classic Literature',
    pages: 323,
    availableCopies: 2,
    totalCopies: 4,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'bk-02',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    callNumber: 'FIC ISH-04',
    genre: 'Science Fiction',
    pages: 303,
    availableCopies: 1,
    totalCopies: 3,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'bk-03',
    title: 'The Princeton Review: AP Calculus BC (2026 Edition)',
    author: 'Princeton Review Editorial',
    callNumber: 'REF 515.076 PR',
    genre: 'AP Prep & STEM',
    pages: 640,
    availableCopies: 4,
    totalCopies: 5,
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'bk-04',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    callNumber: 'FIC FITZ-02',
    genre: 'Classic Literature',
    pages: 180,
    availableCopies: 0,
    totalCopies: 6,
    coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'bk-05',
    title: 'Atomic Habits',
    author: 'James Clear',
    callNumber: '158.1 CLE',
    genre: 'Non-Fiction',
    pages: 270,
    availableCopies: 3,
    totalCopies: 4,
    coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'bk-06',
    title: 'Cosmos',
    author: 'Carl Sagan',
    callNumber: '520.1 SAG',
    genre: 'AP Prep & STEM',
    pages: 384,
    availableCopies: 2,
    totalCopies: 2,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80'
  }
];

export const LibraryModal: React.FC<LibraryModalProps> = ({ isOpen, onClose, onOpenReadingScore }) => {
  const [books, setBooks] = useState<LibraryBook[]>(SAMPLE_BOOKS);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [reservedMessage, setReservedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const genres = ['All', 'Classic Literature', 'Science Fiction', 'AP Prep & STEM', 'Non-Fiction'];

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                          b.author.toLowerCase().includes(search.toLowerCase()) ||
                          b.callNumber.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || b.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleReserve = (bookId: string, title: string) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          isReserved: true,
          availableCopies: Math.max(0, b.availableCopies - 1)
        };
      }
      return b;
    }));

    setReservedMessage(`Hold placed for "${title}"! Pick it up at the West Wing circulation desk within 48 hours.`);
    setTimeout(() => {
      setReservedMessage(null);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Oakridge Library Catalog &amp; Media Center</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded font-mono">
                  OPAC Online
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Search physical reserve stacks, borrow Libby e-books, or place holds on study prep guides.
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

        {/* Search & Filter Toolbar */}
        <div className="px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, or call number..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Genre selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {genres.map(g => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedGenre === g
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Hold Alert Notification */}
        {reservedMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{reservedMessage}</span>
            </div>
          </div>
        )}

        {/* Book List Grid */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map((b) => {
              const isAvailable = b.availableCopies > 0;
              return (
                <div 
                  key={b.id} 
                  className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition flex gap-3.5 items-start"
                >
                  <img
                    src={b.coverImage}
                    alt={b.title}
                    className="w-16 h-22 object-cover rounded-lg border border-slate-700 shadow-md shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-semibold text-white text-sm leading-snug line-clamp-2">
                        {b.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">By {b.author}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
                      <span className="font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                        {b.callNumber}
                      </span>
                      <span className="text-slate-400">{b.pages} pages</span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800">
                      <div>
                        {b.isReserved ? (
                          <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Hold Placed
                          </span>
                        ) : isAvailable ? (
                          <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {b.availableCopies} available on shelf
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-rose-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> All copies out (Due Oct 24)
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleReserve(b.id, b.title)}
                        disabled={b.isReserved || !isAvailable}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                          b.isReserved
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : isAvailable
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        <BookMarked className="w-3 h-3" />
                        <span>{b.isReserved ? 'Reserved' : isAvailable ? 'Place Hold' : 'Waitlist'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              No titles found matching "{search}". Try searching for another keyword or author.
            </div>
          )}
        </div>

        {/* Footer info & cross-link to reading score sheet */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Finished reading a book?</span>
            <button
              onClick={() => {
                onClose();
                onOpenReadingScore();
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold underline flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Log it on your Book Score Sheet &rarr;</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Close Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
