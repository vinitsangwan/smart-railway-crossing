import React from 'react';
import { GitMerge, SkipForward, Cpu, Clock, Info } from 'lucide-react';
import { STATES, STATE_ENCODING } from '../logic/stateMachine';

export default function StateMachineDiagram({ simState, onStep }) {
  const { fsm, sensors } = simState;
  const current = fsm.currentState;

  // Node coordinates in SVG space
  const NODES = {
    IDLE: { x: 120, y: 100, label: 'IDLE (000)', color: '#10b981' },
    APPROACHING: { x: 340, y: 100, label: 'APPROACHING (001)', color: '#f59e0b' },
    CLOSING: { x: 580, y: 100, label: 'CLOSING (010)', color: '#d97706' },
    CROSSING_OCCUPIED: { x: 740, y: 220, label: 'OCCUPIED (011)', color: '#ef4444' },
    CLEARING: { x: 580, y: 340, label: 'CLEARING (100)', color: '#71717a' },
    OPENING: { x: 340, y: 340, label: 'OPENING (101)', color: '#10b981' },
    EMERGENCY: { x: 440, y: 220, label: 'EMERGENCY (110)', color: '#dc2626' }
  };

  return (
    <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-md flex flex-col space-y-4">
      {/* Header and Step Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
            <GitMerge className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            <span>FINITE-STATE MACHINE (FSM) &amp; D FLIP-FLOP REGISTERS</span>
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Clock-synchronized state transitions with 3-bit binary hardware register encoding (Q2 Q1 Q0)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300 animate-spin" />
            <span className="text-zinc-600 dark:text-zinc-400">CLOCK PULSE:</span>
            <span className="text-zinc-900 dark:text-white font-bold">CYCLE #{fsm.clockCycle}</span>
          </div>

          <button
            onClick={onStep}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 text-xs font-mono transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>STEP CLOCK (RISING EDGE)</span>
          </button>
        </div>
      </div>

      {/* SVG State Transition Diagram */}
      <div className="bg-railway-darker rounded-xl p-4 border border-railway-border overflow-x-auto">
        <svg viewBox="0 0 860 420" className="w-full min-w-[760px] h-[380px] select-none font-mono">
          <defs>
            {/* Arrowhead marker */}
            <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
            <marker id="arrowActive" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
            </marker>
            <filter id="fsmGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid Background */}
          <rect width="860" height="420" fill="#131315" />

          {/* TRANSITION ARROWS */}
          {/* IDLE -> APPROACHING */}
          <line x1={NODES.IDLE.x} y1={NODES.IDLE.y} x2={NODES.APPROACHING.x} y2={NODES.APPROACHING.y} stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="230" y="85" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle">A = 1 (Approach)</text>

          {/* APPROACHING -> CLOSING */}
          <line x1={NODES.APPROACHING.x} y1={NODES.APPROACHING.y} x2={NODES.CLOSING.x} y2={NODES.CLOSING.y} stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="460" y="85" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle">Tick count &gt;= 3</text>

          {/* CLOSING -> CROSSING_OCCUPIED */}
          <path d={`M ${NODES.CLOSING.x} ${NODES.CLOSING.y} Q 700 120 ${NODES.CROSSING_OCCUPIED.x} ${NODES.CROSSING_OCCUPIED.y}`} fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="705" y="150" fill="#ef4444" fontSize="9" fontWeight="bold">B = 1 (Occupied)</text>

          {/* CROSSING_OCCUPIED -> CLEARING */}
          <path d={`M ${NODES.CROSSING_OCCUPIED.x} ${NODES.CROSSING_OCCUPIED.y} Q 700 320 ${NODES.CLEARING.x} ${NODES.CLEARING.y}`} fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="705" y="300" fill="#71717a" fontSize="9" fontWeight="bold">B=0 &amp; C=1</text>

          {/* CLEARING -> OPENING */}
          <line x1={NODES.CLEARING.x} y1={NODES.CLEARING.y} x2={NODES.OPENING.x} y2={NODES.OPENING.y} stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="460" y="360" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">O = 1 &amp; Buffer Valid</text>

          {/* OPENING -> IDLE */}
          <path d={`M ${NODES.OPENING.x} ${NODES.OPENING.y} Q 180 320 ${NODES.IDLE.x} ${NODES.IDLE.y}`} fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="175" y="240" fill="#10b981" fontSize="9" fontWeight="bold">Gate = 90°</text>

          {/* Any -> EMERGENCY Arrows */}
          <line x1={NODES.APPROACHING.x} y1={NODES.APPROACHING.y} x2={NODES.EMERGENCY.x} y2={NODES.EMERGENCY.y} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow)" />
          <line x1={NODES.CLOSING.x} y1={NODES.CLOSING.y} x2={NODES.EMERGENCY.x} y2={NODES.EMERGENCY.y} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow)" />
          <line x1={NODES.CLEARING.x} y1={NODES.CLEARING.y} x2={NODES.EMERGENCY.x} y2={NODES.EMERGENCY.y} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow)" />
          <text x="470" y="195" fill="#f43f5e" fontSize="9" fontWeight="bold">D = 1 (Emergency)</text>

          {/* EMERGENCY -> OPENING Recovery */}
          <path d={`M ${NODES.EMERGENCY.x} ${NODES.EMERGENCY.y} Q 380 270 ${NODES.OPENING.x} ${NODES.OPENING.y}`} fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#arrow)" />
          <text x="350" y="275" fill="#10b981" fontSize="8">D=0 &amp; Reset</text>

          {/* STATE NODES */}
          {Object.entries(NODES).map(([key, node]) => {
            const isActive = current === key;
            const enc = STATE_ENCODING[key];

            return (
              <g key={key} transform={`translate(${node.x}, ${node.y})`}>
                {/* Active Outer Pulse Ring */}
                {isActive && (
                  <circle cx="0" cy="0" r="48" fill="none" stroke={node.color} strokeWidth="3" opacity="0.6" filter="url(#fsmGlow)" className="animate-pulse" />
                )}

                {/* State Node Circle */}
                <circle
                  cx="0"
                  cy="0"
                  r="40"
                  fill={isActive ? node.color : '#1e293b'}
                  stroke={isActive ? '#ffffff' : node.color}
                  strokeWidth={isActive ? 3 : 2}
                  className="transition-all duration-300"
                />

                {/* State Label & Binary Register */}
                <text x="0" y="-8" fill={isActive ? '#000000' : '#ffffff'} fontSize="9" fontWeight="bold" textAnchor="middle">
                  {key}
                </text>
                <text x="0" y="12" fill={isActive ? '#000000' : node.color} fontSize="11" fontWeight="bold" textAnchor="middle">
                  Q: {enc.code}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 3-Bit D Flip-Flop Register Live State Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Present State Bits */}
        <div className="bg-cream-100/60 dark:bg-obsidian-900/60 p-4 rounded-lg border border-railway-border flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 font-mono text-xs font-bold mb-2">
            <Cpu className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span>CURRENT STATE REGISTER (Q2 Q1 Q0)</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded bg-white dark:bg-obsidian-800 border border-railway-border">
              <span className="text-[10px] text-stone-600 dark:text-stone-400 block">FF2 (Q2)</span>
              <span className="text-lg font-bold text-stone-900 dark:text-stone-100">{fsm.flipFlops?.Q2 ?? 0}</span>
            </div>
            <div className="p-2 rounded bg-white dark:bg-obsidian-800 border border-railway-border">
              <span className="text-[10px] text-stone-600 dark:text-stone-400 block">FF1 (Q1)</span>
              <span className="text-lg font-bold text-stone-900 dark:text-stone-100">{fsm.flipFlops?.Q1 ?? 0}</span>
            </div>
            <div className="p-2 rounded bg-white dark:bg-obsidian-800 border border-railway-border">
              <span className="text-[10px] text-stone-600 dark:text-stone-400 block">FF0 (Q0)</span>
              <span className="text-lg font-bold text-stone-900 dark:text-stone-100">{fsm.flipFlops?.Q0 ?? 0}</span>
            </div>
          </div>
          <span className="text-[11px] text-stone-600 dark:text-stone-400 mt-2 font-mono">
            State: <strong className="text-stone-900 dark:text-white">{current}</strong> (Dec: {STATE_ENCODING[current]?.decimal})
          </span>
        </div>

        {/* Next State Excitation Inputs */}
        <div className="bg-cream-100/60 dark:bg-obsidian-900/60 p-4 rounded-lg border border-railway-border flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 font-mono text-xs font-bold mb-2">
            <Cpu className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span>D FLIP-FLOP INPUTS (D2 D1 D0)</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded bg-white dark:bg-obsidian-800 border border-railway-border">
              <span className="text-[10px] text-stone-600 dark:text-stone-400 block">D2 = Q2+</span>
              <span className="text-lg font-bold text-amber-700 dark:text-amber-400">{fsm.flipFlops?.D2 ?? 0}</span>
            </div>
            <div className="p-2 rounded bg-white dark:bg-obsidian-800 border border-railway-border">
              <span className="text-[10px] text-stone-600 dark:text-stone-400 block">D1 = Q1+</span>
              <span className="text-lg font-bold text-amber-700 dark:text-amber-400">{fsm.flipFlops?.D1 ?? 0}</span>
            </div>
            <div className="p-2 rounded bg-white dark:bg-obsidian-800 border border-railway-border">
              <span className="text-[10px] text-stone-600 dark:text-stone-400 block">D0 = Q0+</span>
              <span className="text-lg font-bold text-amber-700 dark:text-amber-400">{fsm.flipFlops?.D0 ?? 0}</span>
            </div>
          </div>
          <span className="text-[11px] text-stone-600 dark:text-stone-400 mt-2 font-mono">
            Prepared for next rising clock edge (↑ CLK)
          </span>
        </div>

        {/* Transition Rationale */}
        <div className="bg-cream-100/60 dark:bg-obsidian-900/60 p-4 rounded-lg border border-railway-border flex flex-col justify-between text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-stone-900 dark:text-stone-100 font-bold mb-1">
            <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>TRANSITION CONDITION:</span>
          </div>
          <p className="text-stone-800 dark:text-stone-200 bg-white dark:bg-obsidian-800 p-2.5 rounded border border-railway-border text-[11px] leading-relaxed">
            {fsm.transitionReason || 'System waiting in steady state. Monitoring sensor trip lines.'}
          </p>
          <span className="text-[10px] text-stone-500 mt-1">
            Synchronous sequential controller model
          </span>
        </div>
      </div>
    </div>
  );
}
