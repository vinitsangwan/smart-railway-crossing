import React, { useState } from 'react';
import { Cpu, HardDrive, ArrowRight, Layers, Table, RefreshCw, Zap } from 'lucide-react';

export default function UnitVWorkbench() {
  const [activeTab, setActiveTab] = useState('REGISTERS'); // 'REGISTERS', 'COUNTERS', 'LOGIC_FAMILIES', 'MEMORY'

  // Shift Register Simulator State (4 bits: Q3, Q2, Q1, Q0)
  const [shiftReg, setShiftReg] = useState([0, 1, 0, 1]);
  const [serialIn, setSerialIn] = useState(1);
  const [shiftMode, setShiftMode] = useState('SISO'); // 'SISO', 'SIPO', 'PIPO'

  // Counter Simulator State (3-bit Mod-8: 0 to 7)
  const [counterVal, setCounterVal] = useState(0);
  const [isCountUp, setIsCountUp] = useState(true);

  // Clock Shift Register by 1 step
  const handleShiftClock = () => {
    // Shift right: Q3 gets serialIn, Q2 gets Q3, Q1 gets Q2, Q0 gets Q1
    setShiftReg([serialIn, shiftReg[0], shiftReg[1], shiftReg[2]]);
  };

  // Clock Counter by 1 step
  const handleCounterClock = () => {
    if (isCountUp) {
      setCounterVal(prev => (prev + 1) % 8);
    } else {
      setCounterVal(prev => (prev === 0 ? 7 : prev - 1));
    }
  };

  const LOGIC_FAMILIES_COMPARISON = [
    { parameter: 'Basic Building Element', ttl: 'Bipolar Junction Transistors (BJT)', cmos: 'Complementary MOSFETs (P-MOS & N-MOS)' },
    { parameter: 'Operating Supply Voltage (Vcc / Vdd)', ttl: 'Strict 5.0V ± 5%', cmos: 'Wide Range: 3.0V to 15.0V (or 2V-6V for 74HC)' },
    { parameter: 'Power Dissipation (Static)', ttl: 'High (~10 mW per gate)', cmos: 'Extremely Low / Negligible (~10 nW static)' },
    { parameter: 'Propagation Delay (Speed)', ttl: 'Very Fast (~9 ns for standard TTL)', cmos: 'Fast (~8-12 ns for 74HC / 74ACT)' },
    { parameter: 'Noise Margin / Immunity', ttl: 'Moderate (V_NL = 0.4V, V_NH = 0.4V)', cmos: 'Excellent (~1.5V, approx 30% to 40% Vdd)' },
    { parameter: 'Fan-Out (Drive Capacity)', ttl: 'Standard 10 TTL loads', cmos: 'High (&gt; 50 CMOS loads due to high gate impedance)' },
    { parameter: 'Input Impedance', ttl: 'Moderate (~kΩ)', cmos: 'Extremely High (~10^12 Ω, MOS gate insulation)' },
    { parameter: 'Susceptibility to Electrostatic Discharge (ESD)', ttl: 'Low susceptibility', cmos: 'High susceptibility (requires built-in clamp diodes)' }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-railway-border/60 pb-2 font-mono text-xs">
        {[
          { id: 'REGISTERS', label: '1. Shift Registers (SISO, SIPO, PISO, PIPO)' },
          { id: 'COUNTERS', label: '2. Counters (3-Bit Mod-8 Synchronous)' },
          { id: 'LOGIC_FAMILIES', label: '3. Logic Families Comparison (TTL vs CMOS)' },
          { id: 'MEMORY', label: '4. Memory Architecture (ROM vs RAM)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-railway-yellow text-black shadow'
                : 'bg-railway-card text-slate-400 hover:text-white border border-railway-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Shift Registers */}
      {activeTab === 'REGISTERS' && (
        <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
            <div>
              <h3 className="text-sm font-bold text-white uppercase flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-cyan-400" />
                <span>4-Bit Shift Register Workbench</span>
              </h3>
              <p className="text-xs text-railway-muted font-sans">
                Simulating Serial-In Serial-Out (SISO) and Serial-In Parallel-Out (SIPO) register mechanisms
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSerialIn(serialIn ? 0 : 1)}
                className={`px-3 py-1 rounded font-bold border ${serialIn ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
              >
                Serial Data In: {serialIn}
              </button>

              <button
                onClick={handleShiftClock}
                className="flex items-center space-x-1.5 px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Shift Clock (↑)</span>
              </button>
            </div>
          </div>

          {/* Register Flip-Flops Display */}
          <div className="grid grid-cols-4 gap-3 text-center">
            {shiftReg.map((bit, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-railway-darker border border-railway-border space-y-1 relative">
                <span className="text-[10px] text-slate-400 uppercase block">FF{3 - idx} (Q{3 - idx})</span>
                <span className="text-3xl font-bold text-cyan-300 block">{bit}</span>
                <span className="text-[9px] text-slate-500">Stage {idx + 1}</span>
                {idx < 3 && (
                  <ArrowRight className="w-4 h-4 text-slate-600 absolute -right-2.5 top-1/2 -translate-y-1/2 hidden sm:block" />
                )}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-railway-darker border border-railway-border flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-slate-400 block text-[10px]">Parallel Output Word (Q3 Q2 Q1 Q0):</span>
              <span className="text-lg font-bold text-emerald-400">{shiftReg.join(' ')}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">SISO Serial Out Bit (from Q0):</span>
              <span className="text-lg font-bold text-railway-yellow">{shiftReg[3]}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Counters */}
      {activeTab === 'COUNTERS' && (
        <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
            <div>
              <h3 className="text-sm font-bold text-white uppercase flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>3-Bit Mod-8 Synchronous Up/Down Counter</span>
              </h3>
              <p className="text-xs text-railway-muted font-sans">
                Counts 0 to 7 (000 to 111), matching the 3-bit state registers of our railway warning controller
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsCountUp(!isCountUp)}
                className="px-3 py-1 rounded bg-railway-panel border border-railway-border text-slate-200 font-bold"
              >
                Mode: {isCountUp ? 'COUNT UP (↑)' : 'COUNT DOWN (↓)'}
              </button>

              <button
                onClick={handleCounterClock}
                className="flex items-center space-x-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Clock Step</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-railway-darker border border-railway-border text-center space-y-2">
              <span className="text-slate-400 text-xs block uppercase">Current Counter Value</span>
              <span className="text-4xl font-bold text-white block">{counterVal}</span>
              <span className="text-xs text-slate-500 font-sans block">Modulo: Mod-8 (Sequence 0, 1, 2, 3, 4, 5, 6, 7)</span>
            </div>

            <div className="p-5 rounded-xl bg-railway-darker border border-railway-border text-center space-y-2">
              <span className="text-cyan-400 text-xs block uppercase">3-Bit Flip-Flop Register Bits (Q2 Q1 Q0)</span>
              <span className="text-4xl font-bold text-cyan-300 block">
                {((counterVal >> 2) & 1)} {((counterVal >> 1) & 1)} {(counterVal & 1)}
              </span>
              <span className="text-xs text-slate-500 font-sans block">Direct hardware link to railway controller state</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Logic Families Comparison */}
      {activeTab === 'LOGIC_FAMILIES' && (
        <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
          <div className="pb-3 border-b border-railway-border">
            <h3 className="text-sm font-bold text-white uppercase flex items-center space-x-2">
              <Table className="w-4 h-4 text-railway-yellow" />
              <span>Digital Logic Families Comparison (TTL vs. CMOS)</span>
            </h3>
            <p className="text-xs text-railway-muted font-sans">
              Comprehensive technical comparison across speed, power dissipation, operating voltage, and noise margins
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-railway-border">
            <table className="w-full text-left">
              <thead className="bg-railway-panel text-slate-300 uppercase text-[11px] border-b border-railway-border">
                <tr>
                  <th className="py-2.5 px-3">Performance Parameter</th>
                  <th className="py-2.5 px-3 text-yellow-400">TTL (Transistor-Transistor Logic)</th>
                  <th className="py-2.5 px-3 text-cyan-400">CMOS (Complementary MOS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-railway-border/40 text-slate-200">
                {LOGIC_FAMILIES_COMPARISON.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-railway-darker' : 'bg-railway-card'}>
                    <td className="py-2 px-3 font-bold text-white">{row.parameter}</td>
                    <td className="py-2 px-3 text-slate-300">{row.ttl}</td>
                    <td className="py-2 px-3 text-cyan-300">{row.cmos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Memory Architecture */}
      {activeTab === 'MEMORY' && (
        <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
          <div className="pb-3 border-b border-railway-border">
            <h3 className="text-sm font-bold text-white uppercase flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>Semiconductor Memory Architecture Overview</span>
            </h3>
            <p className="text-xs text-railway-muted font-sans">
              Comparative analysis of primary memory devices: ROM, PROM, EPROM, SRAM, and DRAM
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-railway-darker border border-railway-border space-y-2">
              <span className="text-railway-yellow font-bold text-sm block">1. Read-Only Memory (ROM - Non-Volatile)</span>
              <ul className="space-y-1.5 text-slate-300 font-sans text-xs">
                <li>• <strong>Mask ROM:</strong> Data hardwired during factory silicon fabrication.</li>
                <li>• <strong>PROM:</strong> One-time user programmable via fusible links.</li>
                <li>• <strong>EPROM:</strong> Erasable using Ultraviolet (UV) light exposure through a quartz window.</li>
                <li>• <strong>EEPROM / Flash:</strong> Electrically erasable in-circuit (Used in Arduino ATmega328P Flash for sketch storage).</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-railway-darker border border-railway-border space-y-2">
              <span className="text-cyan-400 font-bold text-sm block">2. Random-Access Memory (RAM - Volatile)</span>
              <ul className="space-y-1.5 text-slate-300 font-sans text-xs">
                <li>• <strong>Static RAM (SRAM):</strong> Built using 6-transistor cross-coupled bistable flip-flop latches. High speed, low power, requires no refresh cycles. Used for CPU registers and cache.</li>
                <li>• <strong>Dynamic RAM (DRAM):</strong> Stores data as electrical charge on single MOS capacitors. Higher packing density and lower cost per bit, but requires continuous periodic refresh every few milliseconds.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
