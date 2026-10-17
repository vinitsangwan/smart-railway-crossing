import React, { useState } from 'react';
import { Network, Plus, Split, GitPullRequest, ArrowRightLeft } from 'lucide-react';

export default function UnitIIIWorkbench() {
  const [activeTab, setActiveTab] = useState('ADDER'); // 'ADDER', 'MUX', 'PRIORITY', 'COMPARATOR'

  // Full Adder inputs
  const [faA, setFaA] = useState(1);
  const [faB, setFaB] = useState(1);
  const [faCin, setFaCin] = useState(0);

  // Full Adder logic: Sum = A ⊕ B ⊕ Cin, Cout = AB + Cin(A ⊕ B)
  const faSum = faA ^ faB ^ faCin;
  const faCout = (faA & faB) | (faCin & (faA ^ faB));

  // 4:1 Multiplexer inputs
  const [muxD, setMuxD] = useState([1, 0, 1, 0]);
  const [muxS, setMuxS] = useState([0, 1]); // S1, S0

  const selIndex = (muxS[0] << 1) | muxS[1];
  const muxOutput = muxD[selIndex];

  // 4:2 Priority Encoder (I3, I2, I1, I0)
  // I3 (Emergency) has highest priority, I0 (Idle) lowest
  const [peInputs, setPeInputs] = useState([0, 0, 1, 0]); // I3, I2, I1, I0

  let peY1 = 0;
  let peY0 = 0;
  let peValid = 1;

  if (peInputs[0] === 1) { // I3
    peY1 = 1; peY0 = 1;
  } else if (peInputs[1] === 1) { // I2
    peY1 = 1; peY0 = 0;
  } else if (peInputs[2] === 1) { // I1
    peY1 = 0; peY0 = 1;
  } else if (peInputs[3] === 1) { // I0
    peY1 = 0; peY0 = 0;
  } else {
    peValid = 0;
  }

  // Magnitude Comparator: Compare 4-bit Value A (Train Speed) with Value B (Speed Limit)
  const [compA, setCompA] = useState(65); // Train speed in km/h
  const [compB, setCompB] = useState(60); // Speed limit in km/h

  const isAGreater = compA > compB;
  const isAEqual = compA === compB;
  const isALess = compA < compB;

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-railway-border/60 pb-2 font-mono text-xs">
        {[
          { id: 'ADDER', label: '1. Arithmetic: Half & Full Adder' },
          { id: 'MUX', label: '2. Data Routing: 4:1 Multiplexer' },
          { id: 'PRIORITY', label: '3. 4:2 Priority Encoder (Emergency Safety)' },
          { id: 'COMPARATOR', label: '4. Magnitude Comparator & Code Converters' }
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

      {/* 1. Full Adder Simulation */}
      {activeTab === 'ADDER' && (
        <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
            <div>
              <h3 className="text-sm font-bold text-white uppercase flex items-center space-x-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Arithmetic Circuits: Full Adder Simulation</span>
              </h3>
              <p className="text-xs text-railway-muted font-sans">
                Computes Sum = A ⊕ B ⊕ Cin and Carry-Out = A·B + Cin·(A ⊕ B)
              </p>
            </div>

            {/* Input Switches */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFaA(faA ? 0 : 1)}
                className={`px-3 py-1 rounded border font-bold ${faA ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-slate-800 text-slate-400'}`}
              >
                A: {faA}
              </button>
              <button
                onClick={() => setFaB(faB ? 0 : 1)}
                className={`px-3 py-1 rounded border font-bold ${faB ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-slate-800 text-slate-400'}`}
              >
                B: {faB}
              </button>
              <button
                onClick={() => setFaCin(faCin ? 0 : 1)}
                className={`px-3 py-1 rounded border font-bold ${faCin ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-slate-800 text-slate-400'}`}
              >
                Cin: {faCin}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-railway-darker border border-railway-border space-y-2">
              <span className="text-slate-400 text-[10px] uppercase block">Sum Output (A ⊕ B ⊕ Cin):</span>
              <span className="text-2xl font-bold text-cyan-300">{faSum}</span>
              <p className="text-[11px] font-sans text-slate-400">
                Generated via cascaded XOR gates. Odd parity of inputs produces Sum = 1.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-railway-darker border border-railway-border space-y-2">
              <span className="text-slate-400 text-[10px] uppercase block">Carry-Out (Cout = AB + Cin(A ⊕ B)):</span>
              <span className="text-2xl font-bold text-amber-400">{faCout}</span>
              <p className="text-[11px] font-sans text-slate-400">
                Generated via AND-OR array. Cascaded across 4 stages in a 7483 parallel adder.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. 4:1 Multiplexer */}
      {activeTab === 'MUX' && (
        <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
            <div>
              <h3 className="text-sm font-bold text-white uppercase flex items-center space-x-2">
                <Network className="w-4 h-4 text-cyan-400" />
                <span>4:1 Multiplexer (Data Selector)</span>
              </h3>
              <p className="text-xs text-railway-muted font-sans">
                Routes 1-of-4 sensor channels to a single microcontroller line using select pins S1 and S0
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Select Lines (S1, S0):</span>
              <button
                onClick={() => setMuxS([muxS[0] ? 0 : 1, muxS[1]])}
                className={`px-2.5 py-1 rounded border font-bold ${muxS[0] ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400'}`}
              >
                S1: {muxS[0]}
              </button>
              <button
                onClick={() => setMuxS([muxS[0], muxS[1] ? 0 : 1])}
                className={`px-2.5 py-1 rounded border font-bold ${muxS[1] ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400'}`}
              >
                S0: {muxS[1]}
              </button>
            </div>
          </div>

          {/* MUX Data Inputs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map(idx => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-center transition-all ${
                  selIndex === idx
                    ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold shadow'
                    : 'bg-railway-darker border-railway-border text-slate-400'
                }`}
              >
                <div className="text-[10px] text-slate-400 uppercase">Input D{idx} {selIndex === idx && '★ ACTIVE'}</div>
                <button
                  onClick={() => {
                    const next = [...muxD];
                    next[idx] = next[idx] ? 0 : 1;
                    setMuxD(next);
                  }}
                  className={`mt-1 px-3 py-0.5 rounded font-bold border text-sm ${
                    muxD[idx] ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {muxD[idx]}
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-railway-darker border border-railway-border flex items-center justify-between">
            <span className="text-slate-300">
              Selected Channel: <strong className="text-cyan-400">D{selIndex} (Binary: {muxS[0]}{muxS[1]})</strong>
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Multiplexer Output Y:</span>
              <span className={`px-4 py-1 rounded text-base font-bold border ${muxOutput ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                Y = {muxOutput}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Priority Encoder */}
      {activeTab === 'PRIORITY' && (
        <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
            <div>
              <h3 className="text-sm font-bold text-white uppercase flex items-center space-x-2">
                <GitPullRequest className="w-4 h-4 text-rose-400" />
                <span>4:2 Priority Encoder (Safety Emergency Interlock)</span>
              </h3>
              <p className="text-xs text-railway-muted font-sans">
                Higher order inputs override lower inputs. I3 (Emergency) overrides I2 (Occupied), I1 (Approach), and I0 (Idle).
              </p>
            </div>
          </div>

          {/* Priority Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'I3: Emergency (Highest)', idx: 0, color: 'text-rose-400' },
              { label: 'I2: Crossing Occupied', idx: 1, color: 'text-red-400' },
              { label: 'I1: Train Approach', idx: 2, color: 'text-yellow-400' },
              { label: 'I0: Track Idle (Lowest)', idx: 3, color: 'text-slate-400' }
            ].map(item => (
              <div key={item.idx} className="p-3 rounded-lg bg-railway-darker border border-railway-border space-y-1">
                <span className={`text-[10px] block font-bold truncate ${item.color}`}>{item.label}</span>
                <button
                  onClick={() => {
                    const next = [...peInputs];
                    next[item.idx] = next[item.idx] ? 0 : 1;
                    setPeInputs(next);
                  }}
                  className={`w-full py-1 rounded font-bold border ${
                    peInputs[item.idx] ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {peInputs[item.idx] ? '1 (ACTIVE)' : '0 (OFF)'}
                </button>
              </div>
            ))}
          </div>

          {/* Encoded Outputs */}
          <div className="p-4 rounded-xl bg-railway-darker border border-railway-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-4">
              <span>Encoded Binary Output (Y1, Y0):</span>
              <span className="text-lg font-bold text-cyan-300 px-3 py-0.5 rounded bg-railway-panel border border-railway-border">
                {peValid ? `${peY1} ${peY0}` : 'XX'}
              </span>
            </div>
            <div>
              <span>Valid Bit (V): </span>
              <span className={`font-bold ${peValid ? 'text-emerald-400' : 'text-slate-500'}`}>
                {peValid ? '1 (Active Input Present)' : '0 (All Inputs Zero)'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Magnitude Comparator & Code Converters */}
      {activeTab === 'COMPARATOR' && (
        <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
            <div>
              <h3 className="text-sm font-bold text-white uppercase flex items-center space-x-2">
                <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                <span>Magnitude Comparator &amp; Speed Interlock</span>
              </h3>
              <p className="text-xs text-railway-muted font-sans">
                Compares Train Speed (A) with Crossing Speed Limit (B) to evaluate A &gt; B, A = B, or A &lt; B
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-railway-darker border border-railway-border space-y-2">
              <span className="text-slate-400 text-[10px] block uppercase">Input A: Train Approach Speed</span>
              <input
                type="number"
                value={compA}
                onChange={(e) => setCompA(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded bg-railway-panel border border-railway-border text-white text-base font-bold focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-500">Binary: {compA.toString(2).padStart(8, '0')}</span>
            </div>

            <div className="p-4 rounded-xl bg-railway-darker border border-railway-border space-y-2">
              <span className="text-slate-400 text-[10px] block uppercase">Input B: Regulatory Speed Limit</span>
              <input
                type="number"
                value={compB}
                onChange={(e) => setCompB(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded bg-railway-panel border border-railway-border text-white text-base font-bold focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-500">Binary: {compB.toString(2).padStart(8, '0')}</span>
            </div>
          </div>

          {/* Comparator Outputs */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className={`p-3 rounded-lg border font-bold ${isAGreater ? 'bg-rose-950/20 text-rose-400 border-rose-500' : 'bg-railway-darker text-slate-600 border-railway-border'}`}>
              <div className="text-[10px]">A &gt; B (OVERSPEED)</div>
              <div className="text-lg mt-1">{isAGreater ? '1 (ALARM)' : '0'}</div>
            </div>
            <div className={`p-3 rounded-lg border font-bold ${isAEqual ? 'bg-amber-950/20 text-amber-400 border-amber-500' : 'bg-railway-darker text-slate-600 border-railway-border'}`}>
              <div className="text-[10px]">A = B (AT LIMIT)</div>
              <div className="text-lg mt-1">{isAEqual ? '1' : '0'}</div>
            </div>
            <div className={`p-3 rounded-lg border font-bold ${isALess ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500' : 'bg-railway-darker text-slate-600 border-railway-border'}`}>
              <div className="text-[10px]">A &lt; B (SAFE SPEED)</div>
              <div className="text-lg mt-1">{isALess ? '1 (SAFE)' : '0'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
