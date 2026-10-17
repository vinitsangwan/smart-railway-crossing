import React, { useState } from 'react';
import { Layers, Cpu, Zap, Info, ShieldAlert } from 'lucide-react';

export default function UnitIIWorkbench() {
  const [activeUniversalGate, setActiveUniversalGate] = useState('NAND'); // 'NAND' or 'NOR'
  const [targetFunction, setTargetFunction] = useState('OR'); // 'NOT', 'AND', 'OR', 'XOR'
  const [testVoltage, setTestVoltage] = useState(3.5);

  // Determine TTL logic state based on voltage
  let ttlState = 'INVALID / FLOATING';
  let ttlColor = 'text-amber-400 bg-amber-950/20 border-amber-500/40';
  if (testVoltage <= 0.8) {
    ttlState = 'LOGIC 0 (LOW)';
    ttlColor = 'text-blue-400 bg-blue-950/20 border-blue-500/40';
  } else if (testVoltage >= 2.0) {
    ttlState = 'LOGIC 1 (HIGH)';
    ttlColor = 'text-emerald-400 bg-emerald-950/20 border-emerald-500/40';
  }

  // Determine CMOS logic state (Vdd = 5V: Low < 1.5V, High > 3.5V)
  let cmosState = 'TRANSITION REGION';
  let cmosColor = 'text-amber-400';
  if (testVoltage <= 1.5) {
    cmosState = 'LOGIC 0 (LOW)';
    cmosColor = 'text-blue-400';
  } else if (testVoltage >= 3.5) {
    cmosState = 'LOGIC 1 (HIGH)';
    cmosColor = 'text-emerald-400';
  }

  const UNIVERSAL_REALIZATIONS = {
    NAND: {
      NOT: {
        title: 'NOT Gate Realization using NAND (1 Gate)',
        formula: "Y = (A · A)' = A'",
        gateCount: 1,
        steps: [
          'Tie both inputs of a 2-input NAND gate together: connect input A to pin 1 and pin 2.',
          'By Idempotent Law, A · A = A.',
          'NAND output Y = (A · A)\' = A\'.'
        ]
      },
      AND: {
        title: 'AND Gate Realization using NAND (2 Gates)',
        formula: "Y = ((A · B)' · (A · B)')' = A · B",
        gateCount: 2,
        steps: [
          'Gate 1: Feed A and B into first NAND gate to obtain intermediate output X = (A · B)\'.',
          'Gate 2: Feed X into a NAND inverter: Y = (X · X)\' = ((A · B)\')\'.',
          'By Involution (Double Negation) Law, ((A · B)\')\' = A · B.'
        ]
      },
      OR: {
        title: 'OR Gate Realization using NAND (3 Gates - De Morgan Realization)',
        formula: "Y = (A' · B')' = (A')' + (B')' = A + B",
        gateCount: 3,
        steps: [
          'Gate 1: Invert A using NAND 1 to obtain A\'.',
          'Gate 2: Invert B using NAND 2 to obtain B\'.',
          'Gate 3: Feed A\' and B\' into NAND 3: Y = (A\' · B\')\'.',
          'By De Morgan\'s Second Law, (A\' · B\')\' = A + B.'
        ]
      },
      XOR: {
        title: 'XOR Gate Realization using NAND (4 Gates - Standard Minimal Form)',
        formula: "Y = A · (A·B)' + B · (A·B)' = A ⊕ B",
        gateCount: 4,
        steps: [
          'Gate 1: Compute NAND of A and B: X = (A · B)\'.',
          'Gate 2: Feed A and X into NAND 2: Y1 = (A · X)\'.',
          'Gate 3: Feed B and X into NAND 3: Y2 = (B · X)\'.',
          'Gate 4: Feed Y1 and Y2 into NAND 4: Y = (Y1 · Y2)\' = A ⊕ B.'
        ]
      }
    },
    NOR: {
      NOT: {
        title: 'NOT Gate Realization using NOR (1 Gate)',
        formula: "Y = (A + A)' = A'",
        gateCount: 1,
        steps: [
          'Tie both inputs of a 2-input NOR gate together: connect input A to pin 1 and pin 2.',
          'By Idempotent Law, A + A = A.',
          'NOR output Y = (A + A)\' = A\'.'
        ]
      },
      OR: {
        title: 'OR Gate Realization using NOR (2 Gates)',
        formula: "Y = ((A + B)' + (A + B)')' = A + B",
        gateCount: 2,
        steps: [
          'Gate 1: Feed A and B into first NOR gate to obtain X = (A + B)\'.',
          'Gate 2: Invert X using a NOR inverter: Y = (X + X)\' = ((A + B)\')\'.',
          'By Involution Law, ((A + B)\')\' = A + B.'
        ]
      },
      AND: {
        title: 'AND Gate Realization using NOR (3 Gates - De Morgan Realization)',
        formula: "Y = (A' + B')' = (A')' · (B')' = A · B",
        gateCount: 3,
        steps: [
          'Gate 1: Invert A using NOR 1 to obtain A\'.',
          'Gate 2: Invert B using NOR 2 to obtain B\'.',
          'Gate 3: Feed A\' and B\' into NOR 3: Y = (A\' + B\')\'.',
          'By De Morgan\'s First Law, (A\' + B\')\' = A · B.'
        ]
      },
      XOR: {
        title: 'XNOR / XOR Realization using NOR (4/5 Gates)',
        formula: "Y = (A + B)' + (A' + B')' = A ⊙ B (XNOR) -> Invert for XOR",
        gateCount: 5,
        steps: [
          'Gate 1: Compute NOR of A and B: X = (A + B)\'.',
          'Gate 2: Combine A and X in NOR 2: (A + X)\'.',
          'Gate 3: Combine B and X in NOR 3: (B + X)\'.',
          'Gate 4: Combine outputs in NOR 4 to obtain XOR.'
        ]
      }
    }
  };

  const activeRealization = UNIVERSAL_REALIZATIONS[activeUniversalGate][targetFunction];

  return (
    <div className="space-y-6">
      {/* Universal Gate Realization Workbench */}
      <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
          <div>
            <h3 className="text-sm font-bold text-white uppercase flex items-center space-x-2">
              <Layers className="w-4 h-4 text-railway-yellow" />
              <span>Universal Gate Implementation (NAND / NOR Realization)</span>
            </h3>
            <p className="text-xs text-railway-muted font-sans">
              Proves that any combinational gate can be realized exclusively using universal logic gates
            </p>
          </div>

          {/* Universal Gate Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Universal Gate:</span>
            <div className="flex rounded-lg bg-railway-darker p-1 border border-railway-border">
              <button
                onClick={() => setActiveUniversalGate('NAND')}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  activeUniversalGate === 'NAND' ? 'bg-cyan-500 text-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                NAND (7400)
              </button>
              <button
                onClick={() => setActiveUniversalGate('NOR')}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  activeUniversalGate === 'NOR' ? 'bg-emerald-500 text-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                NOR (7402)
              </button>
            </div>
          </div>
        </div>

        {/* Target Gate Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Realize Gate:</span>
          {['NOT', 'AND', 'OR', 'XOR'].map((fn) => (
            <button
              key={fn}
              onClick={() => setTargetFunction(fn)}
              className={`px-3 py-1 rounded border font-bold transition-all ${
                targetFunction === fn
                  ? 'bg-railway-panel border-railway-yellow text-railway-yellow shadow'
                  : 'bg-railway-darker border-railway-border text-slate-300 hover:border-slate-500'
              }`}
            >
              {fn} Gate
            </button>
          ))}
        </div>

        {/* Realization Details Card */}
        <div className="p-4 rounded-xl bg-railway-darker border border-railway-border space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-railway-border/60 pb-2">
            <span className="text-white font-bold text-sm">{activeRealization.title}</span>
            <span className="px-2 py-0.5 rounded bg-railway-panel text-cyan-300 border border-railway-border font-bold">
              Requires {activeRealization.gateCount} {activeUniversalGate} Gate(s)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-railway-panel/60 border border-railway-border/40 text-slate-200">
            <span className="text-slate-400 text-[10px] block uppercase">Boolean Equation:</span>
            <span className="text-emerald-400 font-bold text-sm">{activeRealization.formula}</span>
          </div>

          <div className="space-y-1.5 text-slate-300 font-sans text-xs">
            <strong className="text-slate-400 block font-mono text-[11px] uppercase">Step-by-Step Hardware Procedure:</strong>
            {activeRealization.steps.map((st, i) => (
              <div key={i} className="flex items-start space-x-2">
                <span className="text-railway-yellow font-bold font-mono">[{i + 1}]</span>
                <span>{st}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logic Levels & Voltage Thresholds Slider */}
      <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
          <div>
            <h3 className="text-sm font-bold text-white uppercase flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Logic Levels &amp; Voltage Standards Simulator</span>
            </h3>
            <p className="text-xs text-railway-muted font-sans">
              TTL (5V Standard) vs. CMOS Voltage Levels, Threshold Margins, and Forbidden Region
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Input Pin Voltage:</span>
            <span className="text-base font-bold text-white px-3 py-0.5 rounded bg-railway-darker border border-railway-border">
              {Number(testVoltage).toFixed(2)} V
            </span>
          </div>
        </div>

        {/* Interactive Voltage Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="5"
            step="0.05"
            value={testVoltage}
            onChange={(e) => setTestVoltage(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0.0V (GND)</span>
            <span>0.8V (V_IL max)</span>
            <span>2.0V (V_IH min)</span>
            <span>5.0V (Vcc)</span>
          </div>
        </div>

        {/* Live Voltage Decoding Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-railway-darker border border-railway-border space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-yellow-400 font-bold">TTL Logic Family (5V):</span>
              <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${ttlColor}`}>{ttlState}</span>
            </div>
            <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
              LOW: 0V to 0.8V | HIGH: 2.0V to 5.0V | Floating: 0.8V to 2.0V is an indeterminate undefined state prone to noise.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-railway-darker border border-railway-border space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-cyan-400 font-bold">CMOS Logic Family (5V Vdd):</span>
              <span className={`px-2 py-0.5 rounded border border-current text-[11px] font-bold ${cmosColor}`}>{cmosState}</span>
            </div>
            <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
              LOW: 0V to 1.5V (&lt; 30% Vdd) | HIGH: 3.5V to 5.0V (&gt; 70% Vdd). Superior noise immunity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
