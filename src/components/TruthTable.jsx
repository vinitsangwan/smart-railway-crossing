import React, { useState, useMemo } from 'react';
import { generateTruthTable, exportTruthTableToCSV } from '../logic/truthTableGenerator';
import { Download, Search, Filter, AlertCircle, Info, Sparkles } from 'lucide-react';

export default function TruthTable({ currentInputs, onSelectRow }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL', 'O_1', 'O_0', 'W_1', 'W_0'
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  // Generate 16 minterms
  const fullTable = useMemo(() => generateTruthTable(), []);

  // Filter & Search logic
  const filteredRows = useMemo(() => {
    return fullTable.filter((row) => {
      // Filter dropdown check
      if (filterMode === 'O_1' && row.O !== 1) return false;
      if (filterMode === 'O_0' && row.O !== 0) return false;
      if (filterMode === 'W_1' && row.W !== 1) return false;
      if (filterMode === 'W_0' && row.W !== 0) return false;

      // Search query check
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        row.minterm.toLowerCase().includes(q) ||
        row.binary.includes(q) ||
        row.description.toLowerCase().includes(q)
      );
    });
  }, [fullTable, filterMode, searchQuery]);

  // Find active row matching currently live simulated sensor inputs
  const liveRowIndex = useMemo(() => {
    if (!currentInputs) return -1;
    return fullTable.findIndex(
      (r) =>
        r.A === (currentInputs.A ? 1 : 0) &&
        r.B === (currentInputs.B ? 1 : 0) &&
        r.C === (currentInputs.C ? 1 : 0) &&
        r.D === (currentInputs.D ? 1 : 0)
    );
  }, [currentInputs, fullTable]);

  return (
    <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-sm space-y-4">
      {/* Table Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
        <div>
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-50 flex items-center space-x-2">
            <span>4-VARIABLE COMBINATIONAL TRUTH TABLE</span>
            <span className="text-xs px-2 py-0.5 rounded bg-railway-panel text-stone-900 dark:text-stone-100 font-mono border border-railway-border">
              2⁴ = 16 Minterms
            </span>
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            W = A + B + D &nbsp;|&nbsp; G = A + B + D &nbsp;|&nbsp; O = C · A' · B' · D'
          </p>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search m2, 0010..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-cream-50 dark:bg-obsidian-900 border border-railway-border text-xs text-stone-900 dark:text-stone-100 placeholder-stone-500 font-mono focus:outline-none focus:border-stone-500 w-36 sm:w-44"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center space-x-1 bg-railway-panel px-2 py-1.5 rounded-lg border border-railway-border text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="bg-transparent text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">All Rows (16)</option>
              <option value="O_1" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">Safe to Open (O=1)</option>
              <option value="O_0" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">Not Safe (O=0)</option>
              <option value="W_1" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">Warning Active (W=1)</option>
              <option value="W_0" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">Warning Inactive (W=0)</option>
            </select>
          </div>

          {/* Export to CSV */}
          <button
            onClick={() => exportTruthTableToCSV(fullTable)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-railway-panel hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 border border-railway-border text-xs font-mono transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Interactive Table Container */}
      <div className="overflow-x-auto rounded-lg border border-railway-border">
        <table className="w-full text-xs font-mono text-left">
          <thead className="bg-cream-200/80 dark:bg-obsidian-700 text-stone-800 dark:text-stone-200 uppercase tracking-wider text-[11px] border-b border-railway-border">
            <tr>
              <th className="py-2.5 px-3">Minterm</th>
              <th className="py-2.5 px-2">Binary</th>
              <th className="py-2.5 px-2 text-amber-700 dark:text-amber-400">A (Appr)</th>
              <th className="py-2.5 px-2 text-red-700 dark:text-red-400">B (Occup)</th>
              <th className="py-2.5 px-2 text-emerald-700 dark:text-emerald-400">C (Clear)</th>
              <th className="py-2.5 px-2 text-rose-700 dark:text-rose-400">D (Emerg)</th>
              <th className="py-2.5 px-3 text-red-700 dark:text-red-400 bg-red-500/10">W (Warn)</th>
              <th className="py-2.5 px-3 text-amber-700 dark:text-amber-400 bg-amber-500/10">G (Gate)</th>
              <th className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10">O (Open)</th>
              <th className="py-2.5 px-3">Operational Meaning</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-railway-border text-stone-800 dark:text-stone-200">
            {filteredRows.map((row) => {
              const isLive = liveRowIndex === row.index;
              const isSelected = selectedRowIndex === row.index;

              return (
                <tr
                  key={row.minterm}
                  onClick={() => {
                    setSelectedRowIndex(row.index);
                    onSelectRow?.(row);
                  }}
                  className={`cursor-pointer transition-colors ${
                    isLive
                      ? 'bg-amber-400/20 font-bold border-l-4 border-amber-500 text-stone-900 dark:text-stone-50'
                      : isSelected
                      ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-50'
                      : row.index % 2 === 0
                      ? 'bg-cream-50/50 dark:bg-obsidian-900/40 hover:bg-cream-100 dark:hover:bg-obsidian-700'
                      : 'bg-white dark:bg-obsidian-800 hover:bg-cream-100 dark:hover:bg-obsidian-700'
                  }`}
                >
                  <td className="py-2 px-3 font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-1.5">
                    {isLive && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>}
                    <span>{row.minterm}</span>
                  </td>
                  <td className="py-2 px-2 text-stone-600 dark:text-stone-400">{row.binary}</td>
                  <td className={`py-2 px-2 font-bold ${row.A ? 'text-amber-700 dark:text-amber-400' : 'text-stone-400 dark:text-stone-600'}`}>{row.A}</td>
                  <td className={`py-2 px-2 font-bold ${row.B ? 'text-red-700 dark:text-red-400' : 'text-stone-400 dark:text-stone-600'}`}>{row.B}</td>
                  <td className={`py-2 px-2 font-bold ${row.C ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-600'}`}>{row.C}</td>
                  <td className={`py-2 px-2 font-bold ${row.D ? 'text-rose-700 dark:text-rose-400' : 'text-stone-400 dark:text-stone-600'}`}>{row.D}</td>
                  
                  {/* Outputs */}
                  <td className={`py-2 px-3 font-bold bg-red-500/5 ${row.W ? 'text-red-700 dark:text-red-400' : 'text-stone-400 dark:text-stone-600'}`}>{row.W}</td>
                  <td className={`py-2 px-3 font-bold bg-amber-500/5 ${row.G ? 'text-amber-700 dark:text-amber-400' : 'text-stone-400 dark:text-stone-600'}`}>{row.G}</td>
                  <td className={`py-2 px-3 font-bold bg-emerald-500/5 ${row.O ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-600'}`}>
                    <span className={row.O ? 'px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400' : ''}>
                      {row.O}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-stone-600 dark:text-stone-400 text-[11px] truncate max-w-xs">{row.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Critical Engineering Distinction */}
      <div className="bg-cream-100/60 dark:bg-obsidian-900/60 p-4 rounded-lg border border-railway-border text-xs text-stone-700 dark:text-stone-300 space-y-2">
        <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 font-bold font-mono">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span>KEY SAFETY INTERLOCK DISTINCTION: COMBINATIONAL VS. SEQUENTIAL</span>
        </div>
        <p className="leading-relaxed">
          This truth table evaluates the <em>combinational teaching model</em> based purely on instantaneous sensor values.
          In the actual sequential railway controller, the physical gate position is <strong>not</strong> commanded directly by row evaluation alone.
          Instead, the controller requires valid state machine transitions, flip-flop memory persistence, and time-based safety holds
          to ensure a train has physically cleared the road buffer zone before lifting the barrier.
        </p>
      </div>
    </div>
  );
}
