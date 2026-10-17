import React, { useState } from 'react';
import { evaluateExpressions } from '../logic/booleanFunctions';
import { SlidersHorizontal, Info, CheckCircle2 } from 'lucide-react';

export default function CircuitDiagram() {
  const [A, setA] = useState(1);
  const [B, setB] = useState(0);
  const [C, setC] = useState(0);
  const [D, setD] = useState(0);

  // Compute actual mathematical values
  const result = evaluateExpressions(A, B, C, D);
  const { W, G, O } = result.outputs;
  const { notA, notB, notD } = result.intermediates;

  // Intermediate OR gate: A OR B
  const orAB = A || B;

  // Dynamic wire styling helper
  const wireColor = (val) => (val ? '#f59e0b' : '#334155');
  const wireGlow = (val) => (val ? 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.7))' : 'none');

  return (
    <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-2xl flex flex-col space-y-4">
      {/* Header and Input Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
        <div>
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-50 flex items-center space-x-2">
            <span>74-SERIES DISCRETE IC COMBINATIONAL CIRCUIT SCHEMATIC</span>
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Evaluates W = A + B + D &amp; O = C · A' · B' · D' using standard 74HC04, 74HC32, and 74HC08 DIP ICs
          </p>
        </div>

        {/* Input Toggle Switches */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="text-stone-600 dark:text-stone-400 hidden sm:inline">SW:</span>
          <button
            onClick={() => setA(A ? 0 : 1)}
            className={`px-3 py-1.5 rounded font-bold border transition-all ${
              A ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm' : 'bg-railway-panel text-stone-700 dark:text-stone-300 border-railway-border'
            }`}
          >
            A: {A}
          </button>
          <button
            onClick={() => setB(B ? 0 : 1)}
            className={`px-3 py-1.5 rounded font-bold border transition-all ${
              B ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm' : 'bg-railway-panel text-stone-700 dark:text-stone-300 border-railway-border'
            }`}
          >
            B: {B}
          </button>
          <button
            onClick={() => setC(setC ? (C ? 0 : 1) : 0)}
            className={`px-3 py-1.5 rounded font-bold border transition-all ${
              C ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' : 'bg-railway-panel text-stone-700 dark:text-stone-300 border-railway-border'
            }`}
          >
            C: {C}
          </button>
          <button
            onClick={() => setD(D ? 0 : 1)}
            className={`px-3 py-1.5 rounded font-bold border transition-all ${
              D ? 'bg-red-600 text-white border-red-500 shadow-sm animate-pulse' : 'bg-railway-panel text-stone-700 dark:text-stone-300 border-railway-border'
            }`}
          >
            D: {D}
          </button>
        </div>
      </div>

      {/* SVG Circuit Schematic */}
      <div className="bg-railway-darker rounded-xl p-4 border border-railway-border overflow-x-auto">
        <svg viewBox="0 0 860 480" className="w-full min-w-[760px] h-[440px] select-none font-mono">
          <defs>
            <filter id="glowSchematic" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Grid */}
          <pattern id="schematicGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          </pattern>
          <rect width="860" height="480" fill="url(#schematicGrid)" />

          {/* INPUT RAILS (A, B, C, D) ON LEFT */}
          {/* Signal A */}
          <g transform="translate(40, 60)">
            <rect x="0" y="0" width="36" height="24" rx="4" fill="#1e293b" stroke={wireColor(A)} strokeWidth="2" />
            <text x="18" y="16" fill={wireColor(A)} fontSize="12" fontWeight="bold" textAnchor="middle">A={A}</text>
            <circle cx="36" cy="12" r="4" fill={wireColor(A)} />
          </g>

          {/* Signal B */}
          <g transform="translate(40, 130)">
            <rect x="0" y="0" width="36" height="24" rx="4" fill="#1e293b" stroke={wireColor(B)} strokeWidth="2" />
            <text x="18" y="16" fill={wireColor(B)} fontSize="12" fontWeight="bold" textAnchor="middle">B={B}</text>
            <circle cx="36" cy="12" r="4" fill={wireColor(B)} />
          </g>

          {/* Signal C */}
          <g transform="translate(40, 290)">
            <rect x="0" y="0" width="36" height="24" rx="4" fill="#1e293b" stroke={wireColor(C)} strokeWidth="2" />
            <text x="18" y="16" fill={wireColor(C)} fontSize="12" fontWeight="bold" textAnchor="middle">C={C}</text>
            <circle cx="36" cy="12" r="4" fill={wireColor(C)} />
          </g>

          {/* Signal D */}
          <g transform="translate(40, 200)">
            <rect x="0" y="0" width="36" height="24" rx="4" fill="#1e293b" stroke={wireColor(D)} strokeWidth="2" />
            <text x="18" y="16" fill={wireColor(D)} fontSize="12" fontWeight="bold" textAnchor="middle">D={D}</text>
            <circle cx="36" cy="12" r="4" fill={wireColor(D)} />
          </g>

          {/* ---------------- SECTION 1: WARNING LOGIC W = A + B + D ---------------- */}
          {/* OR Gate 1 (74HC32 Gate 1): A OR B */}
          {/* Wire from A to OR1 Pin 1 */}
          <path d="M 76 72 L 180 72 L 180 85 L 210 85" fill="none" stroke={wireColor(A)} strokeWidth="3" style={{ filter: wireGlow(A) }} />
          {/* Wire from B to OR1 Pin 2 */}
          <path d="M 76 142 L 180 142 L 180 105 L 210 105" fill="none" stroke={wireColor(B)} strokeWidth="3" style={{ filter: wireGlow(B) }} />

          {/* OR Gate 1 Symbol at (210, 70) */}
          <g transform="translate(210, 65)">
            <path d="M 0 0 Q 20 30 0 60 Q 40 60 70 30 Q 40 0 0 0 Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="24" y="34" fill="#94a3b8" fontSize="10" fontWeight="bold">7432</text>
            <text x="4" y="14" fill="#64748b" fontSize="8">p1</text>
            <text x="4" y="52" fill="#64748b" fontSize="8">p2</text>
            <text x="56" y="34" fill="#64748b" fontSize="8">p3</text>
          </g>

          {/* Wire from OR1 Out to OR2 Pin 4 */}
          <line x1="280" y1="95" x2="350" y2="95" stroke={wireColor(orAB)} strokeWidth="3" style={{ filter: wireGlow(orAB) }} />

          {/* Wire from D to OR2 Pin 5 */}
          <path d="M 76 212 L 310 212 L 310 120 L 350 120" fill="none" stroke={wireColor(D)} strokeWidth="3" style={{ filter: wireGlow(D) }} />

          {/* OR Gate 2 (74HC32 Gate 2): (A + B) OR D = W */}
          <g transform="translate(350, 80)">
            <path d="M 0 0 Q 20 30 0 60 Q 40 60 70 30 Q 40 0 0 0 Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="24" y="34" fill="#94a3b8" fontSize="10" fontWeight="bold">7432</text>
            <text x="4" y="14" fill="#64748b" fontSize="8">p4</text>
            <text x="4" y="52" fill="#64748b" fontSize="8">p5</text>
            <text x="56" y="34" fill="#64748b" fontSize="8">p6</text>
          </g>

          {/* Output W Wire */}
          <line x1="420" y1="110" x2="560" y2="110" stroke={wireColor(W)} strokeWidth="3.5" style={{ filter: wireGlow(W) }} />

          {/* Warning Output Block W */}
          <g transform="translate(560, 92)">
            <rect x="0" y="0" width="160" height="36" rx="6" fill="#1e293b" stroke={W ? '#ef4444' : '#475569'} strokeWidth="2" />
            <circle cx="20" cy="18" r="8" fill={W ? '#ef4444' : '#334155'} filter={W ? 'url(#glowSchematic)' : ''} />
            <text x="36" y="22" fill={W ? '#ffffff' : '#94a3b8'} fontSize="11" fontWeight="bold">
              W = {W} (WARNING)
            </text>
          </g>

          {/* Output G Wire (Branching from W) */}
          <path d="M 460 110 L 460 155 L 560 155" fill="none" stroke={wireColor(G)} strokeWidth="3" style={{ filter: wireGlow(G) }} />
          <circle cx="460" cy="110" r="4" fill={wireColor(G)} />

          {/* Gate-Close Output Block G */}
          <g transform="translate(560, 137)">
            <rect x="0" y="0" width="160" height="36" rx="6" fill="#1e293b" stroke={G ? '#f59e0b' : '#475569'} strokeWidth="2" />
            <circle cx="20" cy="18" r="8" fill={G ? '#f59e0b' : '#334155'} filter={G ? 'url(#glowSchematic)' : ''} />
            <text x="36" y="22" fill={G ? '#ffffff' : '#94a3b8'} fontSize="11" fontWeight="bold">
              G = {G} (GATE CLOSE)
            </text>
          </g>

          {/* ---------------- SECTION 2: SAFE-TO-OPEN LOGIC O = C · A' · B' · D' ---------------- */}
          {/* Inverters (74HC04 Hex Inverter) */}
          {/* Inverter 1: NOT A */}
          <path d="M 120 72 L 120 260 L 160 260" fill="none" stroke={wireColor(A)} strokeWidth="2.5" />
          <circle cx="120" cy="72" r="3.5" fill={wireColor(A)} />
          <g transform="translate(160, 245)">
            <polygon points="0,0 30,15 0,30" fill="#1e293b" stroke="#ec4899" strokeWidth="2" />
            <circle cx="34" cy="15" r="4" fill="#1e293b" stroke="#ec4899" strokeWidth="2" />
            <text x="6" y="18" fill="#ec4899" fontSize="8" fontWeight="bold">7404</text>
          </g>
          <line x1="198" y1="260" x2="270" y2="260" stroke={wireColor(notA)} strokeWidth="2.5" />
          <text x="210" y="252" fill="#94a3b8" fontSize="9">A'={notA}</text>

          {/* Inverter 2: NOT B */}
          <path d="M 135 142 L 135 320 L 160 320" fill="none" stroke={wireColor(B)} strokeWidth="2.5" />
          <circle cx="135" cy="142" r="3.5" fill={wireColor(B)} />
          <g transform="translate(160, 305)">
            <polygon points="0,0 30,15 0,30" fill="#1e293b" stroke="#ec4899" strokeWidth="2" />
            <circle cx="34" cy="15" r="4" fill="#1e293b" stroke="#ec4899" strokeWidth="2" />
            <text x="6" y="18" fill="#ec4899" fontSize="8" fontWeight="bold">7404</text>
          </g>
          <line x1="198" y1="320" x2="270" y2="320" stroke={wireColor(notB)} strokeWidth="2.5" />
          <text x="210" y="312" fill="#94a3b8" fontSize="9">B'={notB}</text>

          {/* Inverter 3: NOT D */}
          <path d="M 105 212 L 105 380 L 160 380" fill="none" stroke={wireColor(D)} strokeWidth="2.5" />
          <circle cx="105" cy="212" r="3.5" fill={wireColor(D)} />
          <g transform="translate(160, 365)">
            <polygon points="0,0 30,15 0,30" fill="#1e293b" stroke="#ec4899" strokeWidth="2" />
            <circle cx="34" cy="15" r="4" fill="#1e293b" stroke="#ec4899" strokeWidth="2" />
            <text x="6" y="18" fill="#ec4899" fontSize="8" fontWeight="bold">7404</text>
          </g>
          <line x1="198" y1="380" x2="270" y2="380" stroke={wireColor(notD)} strokeWidth="2.5" />
          <text x="210" y="372" fill="#94a3b8" fontSize="9">D'={notD}</text>

          {/* AND Gate 1 (74HC08 Gate 1): A' · B' */}
          <path d="M 270 260 L 290 260 L 290 280 L 320 280" fill="none" stroke={wireColor(notA)} strokeWidth="2.5" />
          <path d="M 270 320 L 290 320 L 290 300 L 320 300" fill="none" stroke={wireColor(notB)} strokeWidth="2.5" />
          <g transform="translate(320, 265)">
            <path d="M 0 0 L 25 0 A 25 25 0 0 1 25 50 L 0 50 Z" fill="#1e293b" stroke="#71717a" strokeWidth="2" />
            <text x="8" y="28" fill="#94a3b8" fontSize="9" fontWeight="bold">7408</text>
          </g>
          {/* Wire A'B' out */}
          <line x1="370" y1="290" x2="440" y2="290" stroke={wireColor(notA && notB)} strokeWidth="2.5" />

          {/* AND Gate 2 (74HC08 Gate 2): (A' · B') · D' */}
          <line x1="440" y1="290" x2="470" y2="290" stroke={wireColor(notA && notB)} strokeWidth="2.5" />
          <path d="M 270 380 L 440 380 L 440 310 L 470 310" fill="none" stroke={wireColor(notD)} strokeWidth="2.5" />
          <g transform="translate(470, 275)">
            <path d="M 0 0 L 25 0 A 25 25 0 0 1 25 50 L 0 50 Z" fill="#1e293b" stroke="#71717a" strokeWidth="2" />
            <text x="8" y="28" fill="#94a3b8" fontSize="9" fontWeight="bold">7408</text>
          </g>
          {/* Wire A'B'D' out */}
          <line x1="520" y1="300" x2="590" y2="300" stroke={wireColor(notA && notB && notD)} strokeWidth="2.5" />

          {/* AND Gate 3 (74HC08 Gate 3): C · (A' · B' · D') = O */}
          {/* Wire from C to AND3 */}
          <path d="M 76 302 L 90 302 L 90 430 L 560 430 L 560 320 L 590 320" fill="none" stroke={wireColor(C)} strokeWidth="2.5" />
          <g transform="translate(590, 285)">
            <path d="M 0 0 L 25 0 A 25 25 0 0 1 25 50 L 0 50 Z" fill="#1e293b" stroke="#10b981" strokeWidth="2.5" />
            <text x="8" y="28" fill="#94a3b8" fontSize="9" fontWeight="bold">7408</text>
          </g>

          {/* Wire to Safe to Open Output */}
          <line x1="640" y1="310" x2="690" y2="310" stroke={wireColor(O)} strokeWidth="3.5" style={{ filter: wireGlow(O) }} />

          {/* Safe to Open Output Block */}
          <g transform="translate(690, 292)">
            <rect x="0" y="0" width="160" height="36" rx="6" fill="#1e293b" stroke={O ? '#10b981' : '#475569'} strokeWidth="2" />
            <circle cx="20" cy="18" r="8" fill={O ? '#10b981' : '#334155'} filter={O ? 'url(#glowSchematic)' : ''} />
            <text x="36" y="22" fill={O ? '#ffffff' : '#94a3b8'} fontSize="11" fontWeight="bold">
              O = {O} (SAFE OPEN)
            </text>
          </g>

          {/* DIP IC Pin Legend Box */}
          <g transform="translate(670, 390)">
            <rect x="0" y="0" width="180" height="75" rx="4" fill="#131315" stroke="#2e2d36" strokeWidth="1" />
            <text x="10" y="16" fill="#f59e0b" fontSize="10" fontWeight="bold">74xx DIP Pinout Reference:</text>
            <text x="10" y="32" fill="#d1cdc4" fontSize="9">Pin 14: Vcc (+5.0V DC)</text>
            <text x="10" y="46" fill="#d1cdc4" fontSize="9">Pin 7:  GND (0.0V)</text>
            <text x="10" y="60" fill="#8c8982" fontSize="8">Propagation Delay: ~9ns</text>
          </g>
        </svg>
      </div>

      {/* Logic Engineering Insight */}
      <div className="bg-cream-100/60 dark:bg-obsidian-900/60 p-3 rounded-lg border border-railway-border text-xs text-stone-700 dark:text-stone-300 flex items-start space-x-2">
        <Info className="w-4 h-4 text-stone-700 dark:text-stone-300 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-stone-900 dark:text-white">Combinational Logic vs Sequential Interlock: </span>
          <span>
            Notice how <strong>O = 1</strong> is asserted ONLY when <strong>C=1</strong> and all hazard lines are LOW (A=0, B=0, D=0).
            Even when O evaluates to 1 combinatorially, the master railway controller's sequential finite-state machine (FSM)
            requires a verified 2-clock safety buffer before commanding the physical servo barrier to raise.
          </span>
        </div>
      </div>
    </div>
  );
}
