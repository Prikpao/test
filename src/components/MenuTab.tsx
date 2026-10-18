import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, 
  FileSpreadsheet, 
  RefreshCw, 
  Download, 
  Upload, 
  Link as LinkIcon, 
  Check, 
  AlertCircle, 
  Star, 
  Flame, 
  Leaf, 
  ShieldCheck, 
  Filter, 
  Table, 
  LayoutGrid, 
  Sparkles,
  Info
} from 'lucide-react';
import { MenuItem } from '../types';
import { parseCSV, csvRowsToMenuItems, generateSampleMenuCSV } from '../utils/csvParser';
import { INITIAL_MENU_ITEMS } from '../data/initialData';

interface MenuTabProps {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

export const MenuTab: React.FC<MenuTabProps> = ({ menuItems, setMenuItems }) => {
  const [viewMode, setViewMode] = useState<'cards' | 'spreadsheet'>('cards');
  const [sheetUrl, setSheetUrl] = useState<string>(() => {
    return localStorage.getItem('oakridge_menu_sheet_url') || '';
  });
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(() => {
    return localStorage.getItem('oakridge_menu_last_sync') || 'Just now';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  
  // Sheet config dialog
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [rawCsvInput, setRawCsvInput] = useState('');
  const [activeConfigTab, setActiveConfigTab] = useState<'url' | 'paste' | 'upload'>('url');
  
  // Filter by diet
  const [dietFilter, setDietFilter] = useState<string>('all');
  
  // Active selected day highlight
  const todayDayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  const [selectedDay, setSelectedDay] = useState<string>(
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(todayDayName) ? todayDayName : 'Monday'
  );

  // Sync from URL
  const fetchMenuFromSpreadsheetUrl = async (urlToFetch: string) => {
    if (!urlToFetch.trim()) {
      setSyncStatus({ type: 'error', message: 'Please enter a valid Google Sheets published CSV URL.' });
      return;
    }

    setIsLoading(true);
    setSyncStatus({ type: 'info', message: 'Fetching spreadsheet data...' });

    try {
      const response = await fetch(urlToFetch.trim());
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const csvText = await response.text();
      const rows = parseCSV(csvText);
      const parsedItems = csvRowsToMenuItems(rows);

      if (parsedItems.length === 0) {
        throw new Error('No valid menu rows found in the spreadsheet.');
      }

      setMenuItems(parsedItems);
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncedTime(nowStr);
      localStorage.setItem('oakridge_menu_sheet_url', urlToFetch.trim());
      localStorage.setItem('oakridge_menu_last_sync', nowStr);
      localStorage.setItem('oakridge_saved_menu_items', JSON.stringify(parsedItems));

      setSyncStatus({
        type: 'success',
        message: `Successfully extracted ${parsedItems.length} days of cafeteria menus from your spreadsheet!`
      });
      setIsConfigModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setSyncStatus({
        type: 'error',
        message: `Could not load spreadsheet: ${err.message || 'CORS or Network issue'}. Tip: Make sure "Publish to web" is set to "CSV".`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Download Sample CSV
  const handleDownloadSampleCSV = () => {
    const csvContent = generateSampleMenuCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'Oakridge_Cafeteria_Menu_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle direct CSV file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        try {
          const rows = parseCSV(content);
          const parsed = csvRowsToMenuItems(rows);
          if (parsed.length > 0) {
            setMenuItems(parsed);
            setSyncStatus({ type: 'success', message: `Imported ${parsed.length} days from ${file.name}` });
            setIsConfigModalOpen(false);
          } else {
            setSyncStatus({ type: 'error', message: 'No valid menu items could be parsed from this CSV.' });
          }
        } catch {
          setSyncStatus({ type: 'error', message: 'Failed to parse CSV file format.' });
        }
      }
    };
    reader.readAsText(file);
  };

  // Handle direct CSV text paste
  const handlePasteSubmit = () => {
    if (!rawCsvInput.trim()) return;
    try {
      const rows = parseCSV(rawCsvInput);
      const parsed = csvRowsToMenuItems(rows);
      if (parsed.length > 0) {
        setMenuItems(parsed);
        setSyncStatus({ type: 'success', message: `Parsed ${parsed.length} days from raw CSV input.` });
        setIsConfigModalOpen(false);
      } else {
        setSyncStatus({ type: 'error', message: 'Could not detect menu rows in pasted CSV.' });
      }
    } catch {
      setSyncStatus({ type: 'error', message: 'Invalid CSV formatting.' });
    }
  };

  // Student dish rating
  const handleRateDish = (day: string, starRating: number) => {
    setMenuItems(prev => prev.map(item => {
      if (item.day === day) {
        const currentRatings = item.ratings || [5];
        return {
          ...item,
          ratings: [...currentRatings, starRating]
        };
      }
      return item;
    }));
  };

  // Filtered menu items
  const filteredMenuItems = menuItems.filter(item => {
    if (dietFilter === 'all') return true;
    if (dietFilter === 'vegetarian') return item.vegetarian && item.vegetarian.length > 0;
    if (dietFilter === 'nut-free') return item.allergens.some(a => a.toLowerCase().includes('nut-free'));
    if (dietFilter === 'gf') return item.allergens.some(a => a.toLowerCase().includes('gluten'));
    if (dietFilter === 'halal') return item.allergens.some(a => a.toLowerCase().includes('halal'));
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 rounded-3xl p-6 md:p-8 border border-amber-900/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-full border border-amber-500/30 font-semibold flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Spreadsheet-Linked Dining
              </span>
              <span className="text-slate-400 text-xs">Farm-To-School Kitchen</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Weekly Cafeteria Lunch Menu
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Dynamically extracted from our campus nutrition spreadsheet file. Updates automatically whenever culinary staff modify the Google Sheet or CSV source.
            </p>
          </div>

          {/* Sync actions */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            <div className="text-xs text-slate-400">
              <span className="block font-medium text-slate-300">Spreadsheet Status</span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <Check className="w-3 h-3" /> Synced: {lastSyncedTime}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {sheetUrl && (
                <button
                  onClick={() => fetchMenuFromSpreadsheetUrl(sheetUrl)}
                  disabled={isLoading}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition flex items-center gap-1.5 border border-slate-700"
                  title="Re-fetch latest CSV from published URL"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              )}

              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-amber-600/20 flex items-center gap-1.5 whitespace-nowrap"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Spreadsheet Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Notification Banner */}
      {syncStatus && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
          syncStatus.type === 'success'
            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
            : syncStatus.type === 'error'
            ? 'bg-rose-950/60 border-rose-800 text-rose-200'
            : 'bg-blue-950/60 border-blue-800 text-blue-200'
        }`}>
          <div className="flex items-center gap-2">
            {syncStatus.type === 'success' && <Check className="w-4 h-4 text-emerald-400" />}
            {syncStatus.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {syncStatus.type === 'info' && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
            <span>{syncStatus.message}</span>
          </div>
          <button 
            onClick={() => setSyncStatus(null)}
            className="text-slate-400 hover:text-white text-xs ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Diet Filters & View Toggle Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Diet pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Diet:
          </span>
          {[
            { id: 'all', label: 'All Dishes' },
            { id: 'vegetarian', label: 'Vegetarian / Plant-Based' },
            { id: 'nut-free', label: 'Nut-Free' },
            { id: 'gf', label: 'Gluten-Free Friendly' },
            { id: 'halal', label: 'Halal-Certified' }
          ].map(d => (
            <button
              key={d.id}
              onClick={() => setDietFilter(d.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                dietFilter === d.id
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                viewMode === 'cards' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Daily Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('spreadsheet')}
              className={`p-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                viewMode === 'spreadsheet' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Raw Spreadsheet Table"
            >
              <Table className="w-3.5 h-3.5" />
              <span>Spreadsheet Grid</span>
            </button>
          </div>

          <button
            onClick={handleDownloadSampleCSV}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs flex items-center gap-1 transition"
            title="Download CSV spreadsheet template"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Download CSV Template</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'cards' ? (
        <div className="space-y-6">
          {/* Daily Menu Cards Grid (Monday - Friday) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {filteredMenuItems.map((item) => {
              const isToday = item.day.toLowerCase() === todayDayName.toLowerCase();
              const ratings = item.ratings || [5];
              const avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);

              return (
                <div
                  key={item.day}
                  className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                    isToday
                      ? 'bg-gradient-to-b from-slate-900 to-indigo-950/40 border-indigo-500/60 shadow-xl ring-2 ring-indigo-500/20'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Card Header with Day & Tags */}
                  <div className="p-4 border-b border-slate-800/80 bg-slate-950/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{item.day}</span>
                        {isToday && (
                          <span className="bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                            Today
                          </span>
                        )}
                      </div>
                      
                      {item.chefPick && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Chef Pick
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <strong className="text-slate-300">{item.calories || 620}</strong> kcal
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-300">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <strong className="text-white">{avgRating}</strong> ({ratings.length})
                      </span>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="p-4 space-y-3.5 flex-1 text-xs">
                    {/* Main Course */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                        Hot Entrée (Main)
                      </span>
                      <p className="font-semibold text-white leading-snug text-[13px]">
                        {item.main}
                      </p>
                    </div>

                    {/* Vegetarian */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-0.5">
                        <Leaf className="w-3 h-3 text-emerald-400" /> Plant-Based / Vegetarian
                      </span>
                      <p className="font-medium text-emerald-300/90 leading-snug">
                        {item.vegetarian}
                      </p>
                    </div>

                    {/* Sides */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Market Sides &amp; Soup
                      </span>
                      <p className="text-slate-300 leading-snug">
                        {item.side}
                      </p>
                      {item.soup && (
                        <p className="text-slate-400 text-[11px] mt-0.5 italic">
                          Soup: {item.soup}
                        </p>
                      )}
                    </div>

                    {/* Dessert */}
                    {item.dessert && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          Dessert / Fresh Fruit
                        </span>
                        <p className="text-slate-300 leading-snug">
                          {item.dessert}
                        </p>
                      </div>
                    )}

                    {/* Allergen Tags */}
                    <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1">
                      {item.allergens.map((alg, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60"
                        >
                          {alg}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Student Interactive Dish Rating */}
                  <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Rate lunch:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRateDish(item.day, star)}
                          className="text-slate-600 hover:text-amber-400 transition"
                          title={`Vote ${star} stars`}
                        >
                          <Star className="w-3.5 h-3.5 hover:fill-amber-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMenuItems.length === 0 && (
            <div className="text-center py-12 text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
              No menu items match the selected dietary filter "{dietFilter}". Try selecting "All Dishes".
            </div>
          )}
        </div>
      ) : (
        /* Raw Spreadsheet Table Mode */
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-sm text-white">Parsed Spreadsheet Matrix ({menuItems.length} rows)</h4>
            </div>
            <span className="text-xs text-slate-400">Live view of extracted CSV columns</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[11px] font-mono text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Day</th>
                  <th className="px-4 py-3">Main Dish</th>
                  <th className="px-4 py-3">Vegetarian Alternative</th>
                  <th className="px-4 py-3">Sides &amp; Soup</th>
                  <th className="px-4 py-3">Dessert</th>
                  <th className="px-4 py-3">Calories</th>
                  <th className="px-4 py-3">Allergens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {menuItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-850 transition">
                    <td className="px-4 py-3 font-bold text-white whitespace-nowrap">{item.day}</td>
                    <td className="px-4 py-3 font-semibold text-slate-200">{item.main}</td>
                    <td className="px-4 py-3 text-emerald-400">{item.vegetarian}</td>
                    <td className="px-4 py-3 text-slate-300">{item.side} {item.soup ? `(${item.soup})` : ''}</td>
                    <td className="px-4 py-3 text-slate-400">{item.dessert}</td>
                    <td className="px-4 py-3 font-mono text-amber-300">{item.calories || 620} kcal</td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                        {item.allergens.join(', ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Spreadsheet Configuration Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg text-white">Connect Menu Spreadsheet</h3>
              </div>
              <button 
                onClick={() => setIsConfigModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Config Tabs */}
            <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 flex gap-2">
              <button
                onClick={() => setActiveConfigTab('url')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeConfigTab === 'url' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Google Sheets Live Link (CSV)
              </button>
              <button
                onClick={() => setActiveConfigTab('paste')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeConfigTab === 'paste' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Paste CSV Text
              </button>
              <button
                onClick={() => setActiveConfigTab('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeConfigTab === 'upload' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Upload CSV File
              </button>
            </div>

            <div className="p-6 space-y-4">
              {activeConfigTab === 'url' && (
                <div className="space-y-4">
                  {/* How to publish Google Sheet guide */}
                  <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs space-y-2">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <Info className="w-4 h-4" /> How to connect your Google Sheet:
                    </span>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-relaxed">
                      <li>In Google Sheets, prepare columns: <strong className="text-white">Day, Main Dish, Vegetarian Option, Sides, Soup, Dessert, Calories, Allergens</strong>.</li>
                      <li>Click <strong className="text-white">File &rarr; Share &rarr; Publish to web</strong>.</li>
                      <li>In the dialog, choose <strong className="text-white">Comma-separated values (.csv)</strong> and click <strong className="text-white">Publish</strong>.</li>
                      <li>Paste the published URL below:</li>
                    </ol>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Published Google Sheets CSV URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={sheetUrl}
                        onChange={(e) => setSheetUrl(e.target.value)}
                        placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                      <button
                        onClick={() => fetchMenuFromSpreadsheetUrl(sheetUrl)}
                        disabled={isLoading || !sheetUrl.trim()}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Extract Menu</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Don't have a URL yet?</span>
                    <button
                      onClick={() => {
                        setMenuItems(INITIAL_MENU_ITEMS);
                        setIsConfigModalOpen(false);
                      }}
                      className="text-amber-400 hover:underline"
                    >
                      Load Sample Fall Term Menu
                    </button>
                  </div>
                </div>
              )}

              {activeConfigTab === 'paste' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Direct CSV Raw Input
                    </label>
                    <textarea
                      rows={7}
                      value={rawCsvInput}
                      onChange={(e) => setRawCsvInput(e.target.value)}
                      placeholder={`Day,Main Dish,Vegetarian Option,Sides,Soup,Dessert,Calories,Allergens\nMonday,"Teriyaki Chicken","Tofu Stir Fry","Edamame","Miso","Apples",580,"Nut-Free"`}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setRawCsvInput(generateSampleMenuCSV())}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                    >
                      Insert Sample CSV
                    </button>
                    <button
                      onClick={handlePasteSubmit}
                      className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
                    >
                      Parse &amp; Apply
                    </button>
                  </div>
                </div>
              )}

              {activeConfigTab === 'upload' && (
                <div className="space-y-4 text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-white text-sm">Upload .CSV Spreadsheet File</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Export your menu schedule from Microsoft Excel, Apple Numbers, or Google Sheets as CSV.
                  </p>
                  
                  <div className="mt-4">
                    <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition shadow">
                      <Upload className="w-4 h-4" />
                      <span>Choose .CSV File</span>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs">
              <button
                onClick={handleDownloadSampleCSV}
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample .CSV Template</span>
              </button>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
