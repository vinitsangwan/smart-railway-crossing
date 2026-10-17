import React, { useState } from 'react';
import { AND, OR, NOT, NAND, NOR, XOR, XNOR } from '../logic/booleanFunctions';
import { RotateCcw, Info } from 'lucide-react';

export const GATE_DEFINITIONS = {
  AND: {
    name: 'AND Gate (Conjunction)',
    inputs: 2,
    fn: (a, b) => AND(a, b),
    booleanSymbol: '· (or &)',
    description: 'Output is HIGH (1) if and only if ALL inputs are HIGH (1). Used in our project for Safe-to-Open condition O = C · A\' · B\' · D\'.',
    icEquivalent: '7408 / 74HC08 (Quad 2-Input AND)'
  },
  OR: {
    name: 'OR Gate (Disjunction)',
    inputs: 2,
    fn: (a, b) => OR(a, b),
    booleanSymbol: '+ (or ||)',
    description: 'Output is HIGH (1) if AT LEAST ONE input is HIGH (1). Used for Warning request W = A + B + D and Gate-Close request G = A + B + D.',
    icEquivalent: '7432 / 74HC32 (Quad 2-Input OR)'
  },
  NOT: {
    name: 'NOT Gate (Inverter)',
    inputs: 1,
    fn: (a) => NOT(a),
    booleanSymbol: "' (or ¬)",
    description: 'Output is the exact opposite (complement) of the input. Used to invert sensor lines to produce A\', B\', D\'.',
    icEquivalent: '7404 / 74HC04 (Hex Inverter)'
  },
  NAND: {
    name: 'NAND Gate (Universal Gate)',
    inputs: 2,
    fn: (a, b) => NAND(a, b),
    booleanSymbol: '(A · B)\'',
    description: 'Universal logic gate: Output is LOW (0) only when all inputs are HIGH (1). Any combinational circuit can be built exclusively with NAND gates.',
    icEquivalent: '7400 / 74HC00 (Quad 2-Input NAND)'
  },
  NOR: {
    name: 'NOR Gate (Universal Gate)',
    inputs: 2,
    fn: (a, b) => NOR(a, b),
    booleanSymbol: '(A + B)\'',
    description: 'Universal logic gate: Output is HIGH (1) only when all inputs are LOW (0). Forms the foundation of SR latches.',
    icEquivalent: '7402 / 74HC02 (Quad 2-Input NOR)'
  },
  XOR: {
    name: 'XOR Gate (Exclusive OR)',
    inputs: 2,
    fn: (a, b) => XOR(a, b),
    booleanSymbol: '⊕',
    description: 'Output is HIGH (1) if inputs are different (odd parity). Used in parity checkers, binary adders, and phase comparators.',
    icEquivalent: '7486 / 74HC86 (Quad 2-Input XOR)'
  },
  XNOR: {
    name: 'XNOR Gate (Equivalence Gate)',
    inputs: 2,
    fn: (a, b) => XNOR(a, b),
    booleanSymbol: '⊙',
    description: 'Output is HIGH (1) if both inputs are identical (even parity). Used in digital magnitude comparators.',
    icEquivalent: '74266 / 74HC266 (Quad 2-Input XNOR)'
  }
};

export default function LogicGate({ gateType = 'AND' }) {
  const [inA, setInA] = useState(1);
  const [inB, setInB] = useState(0);

  const def = GATE_DEFINITIONS[gateType] || GATE_DEFINITIONS.AND;
  const isSingleInput = def.inputs === 1;
  const output = isSingleInput ? def.fn(inA) : def.fn(inA, inB);

  // Wire styling derived from evaluated value
  const getWireStroke = (val) => (val ? '#f59e0b' : '#334155');
  const getWireGlow = (val) => (val ? 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.6))' : 'none');

  const renderGateSVG = () => {
    switch (gateType) {
      case 'AND':
        return (
          <path
            d="M 120 70 L 160 70 A 30 30 0 0 1 160 130 L 120 130 Z"
            fill="#1e293b"
            stroke="#e4e4e7"
            strokeWidth="3"
          />
        );
      case 'OR':
        return (
          <path
            d="M 115 70 Q 140 100 115 130 Q 155 130 185 100 Q 155 70 115 70 Z"
            fill="#1e293b"
            stroke="#f59e0b"
            strokeWidth="3"
          />
        );
      case 'NOT':
        return (
          <g>
            <polygon points="120,70 170,100 120,130" fill="#1e293b" stroke="#ec4899" strokeWidth="3" />
            <circle cx="176" cy="100" r="6" fill="#1e293b" stroke="#ec4899" strokeWidth="2.5" />
          </g>
        );
      case 'NAND':
        return (
          <g>
            <path d="M 120 70 L 155 70 A 30 30 0 0 1 155 130 L 120 130 Z" fill="#1e293b" stroke="#e4e4e7" strokeWidth="3" />
            <circle cx="191" cy="100" r="6" fill="#1e293b" stroke="#e4e4e7" strokeWidth="2.5" />
          </g>
        );
      case 'NOR':
        return (
          <g>
            <path d="M 115 70 Q 140 100 115 130 Q 155 130 180 100 Q 155 70 115 70 Z" fill="#1e293b" stroke="#10b981" strokeWidth="3" />
            <circle cx="187" cy="100" r="6" fill="#1e293b" stroke="#10b981" strokeWidth="2.5" />
          </g>
        );
      case 'XOR':
        return (
          <g>
            <path d="M 108 70 Q 133 100 108 130" fill="none" stroke="#a855f7" strokeWidth="3" />
            <path d="M 118 70 Q 143 100 118 130 Q 158 130 188 100 Q 158 70 118 70 Z" fill="#1e293b" stroke="#a855f7" strokeWidth="3" />
          </g>
        );
      case 'XNOR':
        return (
          <g>
            <path d="M 106 70 Q 131 100 106 130" fill="none" stroke="#eab308" strokeWidth="3" />
            <path d="M 116 70 Q 141 100 116 130 Q 156 130 182 100 Q 156 70 116 70 Z" fill="#1e293b" stroke="#eab308" strokeWidth="3" />
            <circle cx="188" cy="100" r="6" fill="#1e293b" stroke="#eab308" strokeWidth="2.5" />
          </g>
        );
      default:
        return null;
    }
  };

  const getOutputStartX = () => {
    switch (gateType) {
      case 'NOT': return 182;
      case 'NAND': return 197;
      case 'NOR': return 193;
      case 'XNOR': return 194;
      default: return 185;
    }
  };

  return (
    <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-railway-border/60">
        <div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white tracking-wide">{def.name}</h3>
          <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 font-semibold">IC: {def.icEquivalent}</span>
        </div>
        <button
          onClick={() => { setInA(0); setInB(0); }}
          title="Reset Inputs"
          className="p-1.5 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Circuit Canvas */}
      <div className="my-4 py-3 bg-railway-darker rounded-lg border border-railway-border/60 flex items-center justify-center">
        <svg viewBox="0 0 320 200" className="w-full max-w-[320px] h-48 select-none">
          {/* Grid lines */}
          <defs>
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="320" height="200" fill="url(#smallGrid)" />

          {/* Input Wires */}
          {isSingleInput ? (
            // NOT Gate single centered input
            <g>
              <line x1="40" y1="100" x2="120" y2="100" stroke={getWireStroke(inA)} strokeWidth="4" style={{ filter: getWireGlow(inA) }} />
              <circle cx="40" cy="100" r="5" fill={inA ? '#f59e0b' : '#334155'} />
              <text x="35" y="90" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">IN</text>
            </g>
          ) : (
            // Dual inputs (A and B)
            <g>
              {/* Input A */}
              <line x1="40" y1="80" x2="118" y2="80" stroke={getWireStroke(inA)} strokeWidth="4" style={{ filter: getWireGlow(inA) }} />
              <circle cx="40" cy="80" r="5" fill={inA ? '#f59e0b' : '#334155'} />
              <text x="35" y="72" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">A</text>

              {/* Input B */}
              <line x1="40" y1="120" x2="118" y2="120" stroke={getWireStroke(inB)} strokeWidth="4" style={{ filter: getWireGlow(inB) }} />
              <circle cx="40" cy="120" r="5" fill={inB ? '#f59e0b' : '#334155'} />
              <text x="35" y="140" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">B</text>
            </g>
          )}

          {/* Logic Gate Body */}
          {renderGateSVG()}

          {/* Output Wire */}
          <line
            x1={getOutputStartX()}
            y1="100"
            x2="270"
            y2="100"
            stroke={getWireStroke(output)}
            strokeWidth="4"
            style={{ filter: getWireGlow(output) }}
          />
          <circle cx="270" cy="100" r="6" fill={output ? '#f59e0b' : '#334155'} />
          <text x="260" y="88" fill="#94a3b8" fontSize="11" fontFamily="monospace" fontWeight="bold">OUT (Y)</text>

          {/* Output Logic Level Indicator Box */}
          <g transform="translate(250, 115)">
            <rect x="0" y="0" width="40" height="22" rx="4" fill="#131315" stroke={output ? '#10b981' : '#4d4c55'} strokeWidth="1.5" />
            <text x="20" y="15" fill={output ? '#10b981' : '#a8a59e'} fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              {output ? 'HIGH (1)' : 'LOW (0)'}
            </text>
          </g>
        </svg>
      </div>

      {/* Input Interactive Switch Buttons */}
      <div className="flex items-center justify-around bg-cream-100/60 dark:bg-obsidian-900/60 p-2.5 rounded-lg border border-railway-border mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-stone-700 dark:text-stone-300">Input A:</span>
          <button
            onClick={() => setInA(inA ? 0 : 1)}
            className={`w-14 py-1 rounded text-xs font-mono font-bold transition-all shadow-sm ${
              inA ? 'bg-amber-500 text-stone-950 shadow-sm' : 'bg-railway-panel text-stone-700 dark:text-stone-300 border border-railway-border'
            }`}
          >
            {inA ? '1 (HIGH)' : '0 (LOW)'}
          </button>
        </div>

        {!isSingleInput && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-stone-700 dark:text-stone-300">Input B:</span>
            <button
              onClick={() => setInB(inB ? 0 : 1)}
              className={`w-14 py-1 rounded text-xs font-mono font-bold transition-all shadow-sm ${
                inB ? 'bg-amber-500 text-stone-950 shadow-sm' : 'bg-railway-panel text-stone-700 dark:text-stone-300 border border-railway-border'
              }`}
            >
              {inB ? '1 (HIGH)' : '0 (LOW)'}
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-stone-700 dark:text-stone-300">Output Y:</span>
          <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
            output ? 'bg-emerald-600 text-white shadow-sm' : 'bg-railway-panel text-stone-700 dark:text-stone-300 border border-railway-border'
          }`}>
            {output}
          </span>
        </div>
      </div>

      {/* Technical Explanation */}
      <div className="text-[11px] text-stone-600 dark:text-stone-400 bg-cream-100/60 dark:bg-obsidian-900/60 p-3 rounded-lg border border-railway-border space-y-1">
        <div className="flex items-center space-x-1 text-stone-900 dark:text-stone-100 font-semibold">
          <Info className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
          <span>Boolean Function:</span>
        </div>
        <p>{def.description}</p>
      </div>
    </div>
  );
}
