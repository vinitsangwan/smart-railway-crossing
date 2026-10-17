import React from 'react';
import { AlertTriangle, RotateCcw, Activity, ShieldCheck, Cpu, Sun, Moon } from 'lucide-react';
import { STATES } from '../logic/stateMachine';

export default function Navbar({ simState, onEmergencyToggle, onReset, activePage, setActivePage, theme, onToggleTheme }) {
  const isEmergency = simState.fsm.currentState === STATES.EMERGENCY || simState.sensors.D === 1;

  const getStateBadgeColor = (state) => {
    switch (state) {
      case STATES.IDLE: return 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30';
      case STATES.APPROACHING: return 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30';
      case STATES.CLOSING: return 'bg-amber-600/15 text-amber-900 dark:text-amber-300 border-amber-600/30';
      case STATES.CROSSING_OCCUPIED: return 'bg-red-500/15 text-red-800 dark:text-red-300 border-red-500/30';
      case STATES.CLEARING: return 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700';
      case STATES.OPENING: return 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30';
      case STATES.EMERGENCY: return 'bg-red-600 text-white border-red-700 animate-pulse';
      default: return 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700';
    }
  };

  return (
    <header className="h-16 bg-railway-card border-b border-railway-border px-4 lg:px-6 flex items-center justify-between sticky top-0 z-50 transition-colors">
      {/* Title & Branding */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-stone-900 text-cream-50 dark:bg-cream-100 dark:text-obsidian-950 flex items-center justify-center font-mono font-bold text-lg shadow-sm">
          SR
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold text-stone-900 dark:text-stone-50 tracking-wide">
              SMART RAILWAY CROSSING
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded bg-railway-panel border border-railway-border text-stone-700 dark:text-stone-300 font-mono font-semibold">
              LOGIC SYSTEM
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
            Digital Logic &amp; Sequential Safety Interlock System
          </p>
        </div>
      </div>

      {/* Live Telemetry Pills */}
      <div className="hidden md:flex items-center space-x-3">
        {/* State Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-railway-panel border border-railway-border">
          <Activity className="w-4 h-4 text-stone-600 dark:text-stone-400 animate-pulse" />
          <span className="text-xs text-stone-500 dark:text-stone-400 uppercase font-mono">FSM State:</span>
          <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold border ${getStateBadgeColor(simState.fsm.currentState)}`}>
            {simState.fsm.currentState}
          </span>
        </div>

        {/* Flip-Flop Register Q2 Q1 Q0 */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-railway-panel border border-railway-border">
          <Cpu className="w-4 h-4 text-stone-600 dark:text-stone-400" />
          <span className="text-xs text-stone-500 dark:text-stone-400 uppercase font-mono">Q2 Q1 Q0:</span>
          <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100 tracking-wider">
            {simState.fsm.flipFlops?.Q2 ?? 0} {simState.fsm.flipFlops?.Q1 ?? 0} {simState.fsm.flipFlops?.Q0 ?? 0}
          </span>
        </div>

        {/* Clock Cycle */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-railway-panel border border-railway-border">
          <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">CLK:</span>
          <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100">#{simState.fsm.clockCycle}</span>
        </div>
      </div>

      {/* Master Control Buttons */}
      <div className="flex items-center space-x-2">
        {/* Theme Switcher: Obsidian Dark vs Cream Zinc Light */}
        <button
          onClick={onToggleTheme}
          title={theme === 'light' ? 'Switch to Obsidian Dark' : 'Switch to Cream Zinc Light'}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold bg-railway-panel hover:bg-stone-200/70 dark:hover:bg-stone-700/60 text-stone-800 dark:text-stone-200 border border-railway-border transition-colors shadow-sm"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-4 h-4 text-stone-700" />
              <span className="hidden sm:inline">Obsidian Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Cream Zinc</span>
            </>
          )}
        </button>

        {/* Emergency Stop / Recovery Toggle */}
        <button
          onClick={onEmergencyToggle}
          title={isEmergency ? "Clear Emergency Fault" : "Trigger Emergency Stop (D=1)"}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm text-white ${
            isEmergency
              ? 'bg-emerald-600 hover:bg-emerald-500 animate-pulse'
              : 'bg-red-600 hover:bg-red-500'
          }`}
        >
          {isEmergency ? (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>RECOVER FAULT</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4" />
              <span>EMERGENCY STOP</span>
            </>
          )}
        </button>

        {/* Global Reset */}
        <button
          onClick={onReset}
          title="Reset Simulation & Controllers to Initial Safe State"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-railway-panel hover:bg-stone-200/70 dark:hover:bg-stone-700/60 text-stone-800 dark:text-stone-200 border border-railway-border transition-colors shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
          <span className="hidden sm:inline">RESET</span>
        </button>
      </div>
    </header>
  );
}
