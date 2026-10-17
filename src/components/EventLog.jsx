import React, { useState } from 'react';
import { Terminal, Trash2, Filter } from 'lucide-react';

export default function EventLog({ logs = [], onClearLogs }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    if (filterSeverity === 'ALL') return true;
    return log.severity === filterSeverity;
  });

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/40 font-bold';
      case 'high':
      case 'warning':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/40';
      case 'info':
      default:
        return 'bg-railway-panel text-stone-800 dark:text-stone-200 border-railway-border';
    }
  };

  return (
    <div className="bg-railway-card border border-railway-border rounded-xl p-4 shadow-sm flex flex-col space-y-3 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-railway-border/60">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-stone-700 dark:text-stone-300" />
          <span className="font-bold text-stone-900 dark:text-stone-50 uppercase text-[11px] tracking-wider">
            CONTROLLER EVENT &amp; TELEMETRY LOG ({logs.length})
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Severity filter */}
          <div className="flex items-center space-x-1 bg-railway-panel px-2 py-1 rounded border border-railway-border text-[11px]">
            <Filter className="w-3 h-3 text-stone-500" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-transparent text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">All Events</option>
              <option value="critical" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">Critical / Faults</option>
              <option value="warning" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">Warnings</option>
              <option value="info" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">State Transitions</option>
            </select>
          </div>

          <button
            onClick={onClearLogs}
            title="Clear Event Log"
            className="p-1 rounded bg-railway-panel hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
        {filteredLogs.length === 0 ? (
          <div className="py-6 text-center text-stone-500 text-[11px]">
            No logged events yet. Start the simulation or step the clock.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-2 rounded bg-cream-100/60 dark:bg-obsidian-900/60 border border-railway-border flex items-start space-x-2 text-[11px] transition-colors"
            >
              <span className="text-stone-500 shrink-0">[{log.time}]</span>
              <span className="text-stone-900 dark:text-stone-100 font-bold shrink-0">T{log.cycle}</span>
              <span className={`px-1.5 py-0.2 rounded border text-[9px] uppercase ${getSeverityBadge(log.severity)}`}>
                {log.type}
              </span>
              <span className="text-stone-800 dark:text-stone-200 flex-1 break-words">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
