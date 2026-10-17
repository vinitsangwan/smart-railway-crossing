import React from 'react';
import StateMachineDiagram from '../components/StateMachineDiagram';
import { GitMerge, Layers, Cpu, Clock, AlertTriangle } from 'lucide-react';
import { STATES } from '../logic/stateMachine';

export default function StateMachinePage({ simState, onStep }) {
  const STATE_DESCRIPTIONS = [
    {
      state: 'IDLE (000)',
      role: 'Quiescent Baseline',
      gate: 'Vertical (90°)',
      warnings: 'Extinguished (All OFF)',
      nextTrigger: 'Approach Sensor A = 1 or Emergency D = 1',
      color: 'border-railway-border text-stone-900 dark:text-stone-100'
    },
    {
      state: 'APPROACHING (001)',
      role: 'Approach Alert & Clearance Warning',
      gate: 'Vertical (90°)',
      warnings: 'Flashing Red Alternating (1Hz) + Audible Buzzer',
      nextTrigger: 'Safety Clearance Delay Timeout (3 clock ticks)',
      color: 'border-amber-500/40 text-amber-700 dark:text-amber-400'
    },
    {
      state: 'CLOSING (010)',
      role: 'Controlled Barrier Descent',
      gate: 'Descent in progress (90° -> 0°)',
      warnings: 'Flashers & Continuous Warning Chime',
      nextTrigger: 'Barrier arm achieves 0° horizontal position',
      color: 'border-amber-600/40 text-amber-800 dark:text-amber-300'
    },
    {
      state: 'CROSSING_OCCUPIED (011)',
      role: 'Full Protection Lockout',
      gate: 'Horizontal (0° locked down)',
      warnings: 'Flashers ON, Buzzer silenced or cadence pulse',
      nextTrigger: 'Train clear sensor C = 1 and Occupancy B = 0',
      color: 'border-red-500/40 text-red-700 dark:text-red-400'
    },
    {
      state: 'CLEARING (100)',
      role: 'Post-Departure Safety Buffer',
      gate: 'Horizontal (0° locked down)',
      warnings: 'Flashers continue as train caboose exits',
      nextTrigger: 'Clearance hold counter expiry (2 clock ticks)',
      color: 'border-railway-border text-stone-800 dark:text-stone-200'
    },
    {
      state: 'OPENING (101)',
      role: 'Barrier Lifting Motion',
      gate: 'Moving from 0° up to 90°',
      warnings: 'Extinguished upon start of upward travel',
      nextTrigger: 'Barrier arm reaches 90° vertical limit switch',
      color: 'border-railway-border text-stone-900 dark:text-stone-100'
    },
    {
      state: 'EMERGENCY (110)',
      role: 'Fail-Safe Hazard Lockout',
      gate: 'Forced Closed (0°)',
      warnings: 'Flashers Active / Continuous Siren',
      nextTrigger: 'Emergency line D released and certified manual recovery sequence',
      color: 'border-red-600/50 text-red-700 dark:text-red-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-railway-border/60">
        <div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-wide font-mono flex items-center space-x-2">
            <GitMerge className="w-6 h-6 text-stone-700 dark:text-stone-300" />
            <span>STATE MACHINE EXPLORER &amp; SEQUENTIAL CONTROLLER</span>
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Mealy/Moore hybrid finite-state machine with clock-synchronized D flip-flop state registers
          </p>
        </div>
      </div>

      {/* Interactive FSM Diagram */}
      <StateMachineDiagram simState={simState} onStep={onStep} />

      {/* 7 States Detailed Breakdown Cards */}
      <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50 uppercase tracking-wider font-mono flex items-center space-x-2">
          <Layers className="w-4 h-4 text-stone-700 dark:text-stone-300" />
          <span>7-State Control Sequence Specification</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {STATE_DESCRIPTIONS.map((s, idx) => (
            <div key={idx} className={`p-3.5 rounded-lg bg-cream-100/60 dark:bg-obsidian-900/60 border ${s.color} space-y-1.5 font-mono text-xs`}>
              <div className="flex items-center justify-between font-bold">
                <span className="text-stone-900 dark:text-white">{s.state}</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">Step {idx + 1}/7</span>
              </div>
              <div className="text-[11px] text-stone-700 dark:text-stone-300">{s.role}</div>
              <div className="pt-1.5 border-t border-railway-border text-[10px] text-stone-600 dark:text-stone-400 space-y-0.5">
                <div>Barrier: <span className="text-stone-900 dark:text-stone-200">{s.gate}</span></div>
                <div>Warnings: <span className="text-stone-900 dark:text-stone-200">{s.warnings}</span></div>
                <div>Transition: <span className="text-stone-900 dark:text-stone-100 font-bold">{s.nextTrigger}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
