import React from 'react';
import { 
  Activity, 
  Cpu, 
  CircuitBoard, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  TrainTrack,
  BookOpen
} from 'lucide-react';
import RailwayScene from '../components/RailwayScene';
import { STATES } from '../logic/stateMachine';

export default function Dashboard({
  simState,
  onStart,
  onPause,
  onStep,
  onReset,
  onToggleMode,
  onSetSpeed,
  onToggleSensor,
  onSetScenario,
  onEmergencyToggle,
  onClearFault,
  setActivePage
}) {
  const { fsm, combinational, sensors } = simState;

  const STATS_CARDS = [
    {
      title: 'Active Controller State',
      value: fsm.currentState,
      subtitle: `3-Bit Register: Q2=${fsm.flipFlops?.Q2} Q1=${fsm.flipFlops?.Q1} Q0=${fsm.flipFlops?.Q0}`,
      icon: Activity,
      color: 'text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/60'
    },
    {
      title: 'Warning Output W',
      value: combinational.W ? 'ACTIVE (1)' : 'CLEAR (0)',
      subtitle: 'Logic: W = A + B + D',
      icon: AlertTriangle,
      color: combinational.W ? 'text-red-700 dark:text-red-400 border-red-500/40 bg-red-500/10' : 'text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40'
    },
    {
      title: 'Gate Close Output G',
      value: combinational.G ? 'COMMANDED (1)' : 'IDLE (0)',
      subtitle: 'Barrier Servo: ' + fsm.gateAngle + '° (' + fsm.gatePosition + ')',
      icon: CircuitBoard,
      color: combinational.G ? 'text-amber-700 dark:text-amber-400 border-amber-500/40 bg-amber-500/10' : 'text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40'
    },
    {
      title: 'Safe-to-Open Output O',
      value: combinational.O ? 'GRANTED (1)' : 'DENIED (0)',
      subtitle: "Logic: O = C · A' · B' · D'",
      icon: ShieldCheck,
      color: combinational.O ? 'text-emerald-700 dark:text-emerald-400 border-emerald-500/40 bg-emerald-500/10' : 'text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Control Room Banner */}
      <div className="bg-railway-card border border-railway-border rounded-xl p-6 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 border border-stone-700 dark:border-stone-300">
              SAFETY LOGIC CONTROLLER SYSTEM
            </span>
            <span className="text-xs text-stone-600 dark:text-stone-400 font-mono">TINKERCAD &amp; WOKWI COMPLIANT</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight">
            Smart Railway Crossing Warning System Using Digital Logic
          </h1>
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            An interactive engineering control simulation demonstrating Boolean algebra, combinational gate reduction, 
            3-bit D flip-flop state registers, clocked finite-state machines, and microcontroller firmware.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mt-5 flex flex-wrap gap-2.5">
          <button
            onClick={() => setActivePage('simulation')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-50 dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 text-xs font-mono font-bold transition-all shadow-sm"
          >
            <TrainTrack className="w-4 h-4" />
            <span>OPEN LIVE SIMULATION</span>
          </button>
          <button
            onClick={() => setActivePage('logic-lab')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-railway-panel hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 border border-railway-border text-xs font-mono transition-colors"
          >
            <Cpu className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span>DIGITAL LOGIC LAB</span>
          </button>
          <button
            onClick={() => setActivePage('virtual-circuit')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-railway-panel hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 border border-railway-border text-xs font-mono transition-colors"
          >
            <CircuitBoard className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>HARDWARE CIRCUIT SIM</span>
          </button>
        </div>
      </div>

      {/* 4 Telemetry Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`p-4 rounded-xl border ${card.color} shadow-sm transition-transform hover:-translate-y-0.5`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-stone-500 dark:text-stone-400">{card.title}</span>
                <Icon className="w-4 h-4" />
              </div>
              <div className="mt-2 text-xl font-bold font-mono text-stone-900 dark:text-stone-50 tracking-wide">{card.value}</div>
              <div className="mt-1 text-[11px] font-mono text-stone-600 dark:text-stone-400">{card.subtitle}</div>
            </div>
          );
        })}
      </div>

      {/* Live Railway Scene Preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider font-mono flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real-Time Animated Railway Scene</span>
          </h2>
          <button
            onClick={() => setActivePage('simulation')}
            className="text-xs text-stone-800 dark:text-stone-200 hover:underline font-mono flex items-center space-x-1"
          >
            <span>Full Screen &amp; Controls</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <RailwayScene
          simState={simState}
          onStart={onStart}
          onPause={onPause}
          onStep={onStep}
          onReset={onReset}
          onToggleMode={onToggleMode}
          onSetSpeed={onSetSpeed}
          onToggleSensor={onToggleSensor}
          onSetScenario={onSetScenario}
          onEmergencyToggle={onEmergencyToggle}
          onClearFault={onClearFault}
        />
      </div>

      {/* Logic Architecture Verification Checklist */}
      <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider font-mono flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>System Logic &amp; Functional Architecture Audit</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono text-stone-700 dark:text-stone-300">
          <div className="p-3 rounded bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-start space-x-2">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0">✓</span>
            <div>
              <strong className="text-stone-900 dark:text-white block font-semibold">Boolean Algebra Engine</strong>
              <span>W = A + B + D &amp; O = C · A' · B' · D' evaluated dynamically</span>
            </div>
          </div>
          <div className="p-3 rounded bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-start space-x-2">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0">✓</span>
            <div>
              <strong className="text-stone-900 dark:text-white block font-semibold">16-Row Truth Table</strong>
              <span>All 2⁴ minterms mapped with CSV export and real-time active row highlight</span>
            </div>
          </div>
          <div className="p-3 rounded bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-start space-x-2">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0">✓</span>
            <div>
              <strong className="text-stone-900 dark:text-white block font-semibold">Boolean Algebraic Reduction</strong>
              <span>Pure algebraic postulates, distributive factoring, and De Morgan proofs</span>
            </div>
          </div>
          <div className="p-3 rounded bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-start space-x-2">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0">✓</span>
            <div>
              <strong className="text-stone-900 dark:text-white block font-semibold">7-State Clocked FSM</strong>
              <span>3-bit D flip-flop state register encoding (Q2 Q1 Q0) with edge clocking</span>
            </div>
          </div>
          <div className="p-3 rounded bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-start space-x-2">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0">✓</span>
            <div>
              <strong className="text-stone-900 dark:text-white block font-semibold">Virtual Circuit &amp; Wokwi</strong>
              <span>Microcontroller C++ firmware with non-blocking millis() and JSON circuit</span>
            </div>
          </div>
          <div className="p-3 rounded bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-start space-x-2">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0">✓</span>
            <div>
              <strong className="text-stone-900 dark:text-white block font-semibold">Automated Fault Testing</strong>
              <span>10 test suites evaluating stuck sensors, conflicts, and emergency recovery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
