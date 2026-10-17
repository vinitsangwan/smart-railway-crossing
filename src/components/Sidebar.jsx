import React from 'react';
import { 
  LayoutDashboard, 
  TrainTrack, 
  Cpu, 
  CircuitBoard, 
  Table, 
  Activity, 
  GitMerge, 
  Bug
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: '1. Overview Dashboard', icon: LayoutDashboard },
  { id: 'simulation', label: '2. Live Railway Simulation', icon: TrainTrack },
  { id: 'logic-lab', label: '3. Digital Logic Laboratory', icon: Cpu },
  { id: 'virtual-circuit', label: '4. Hardware Circuit Simulation', icon: CircuitBoard },
  { id: 'truth-table', label: '5. Truth Table & Boolean', icon: Table },
  { id: 'timing', label: '6. Timing & Waveforms', icon: Activity },
  { id: 'state-machine', label: '7. State Machine Explorer', icon: GitMerge },
  { id: 'fault-testing', label: '8. Fault Injection & Testing', icon: Bug }
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-64 bg-railway-card border-r border-railway-border flex flex-col shrink-0">
      <div className="p-3 border-b border-railway-border/60">
        <span className="text-[11px] font-mono uppercase tracking-wider text-railway-muted px-2">
          Control Navigation
        </span>
      </div>

      <nav className="p-2 space-y-1 overflow-y-auto flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                isActive
                  ? 'bg-stone-900 text-stone-50 dark:bg-cream-100 dark:text-obsidian-950 font-bold shadow-sm'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 hover:text-stone-900 dark:hover:text-stone-50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-50 dark:text-obsidian-950 font-bold' : 'text-stone-500 dark:text-stone-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-railway-border/60 bg-cream-100/40 dark:bg-obsidian-900/40">
        <div className="text-[11px] text-stone-600 dark:text-stone-400 font-mono space-y-0.5">
          <div className="text-stone-900 dark:text-stone-100 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Simulation Active</span>
          </div>
          <div>Logic Engine: Online</div>
          <div className="text-stone-500 dark:text-stone-400 text-[10px]">Deterministic Logic &amp; FSM</div>
        </div>
      </div>
    </aside>
  );
}
