import React, { useState } from 'react';
import { Cpu, Zap, RotateCcw, Clock, Info } from 'lucide-react';

export default function FlipFlopLab() {
  const [ffType, setFfType] = useState('D'); // 'SR', 'D', 'JK'

  // Flip-Flop inputs
  const [dInput, setDInput] = useState(1);
  const [sInput, setSInput] = useState(1);
  const [rInput, setRInput] = useState(0);
  const [jInput, setJInput] = useState(1);
  const [kInput, setKInput] = useState(0);

  // Stored state Q
  const [qState, setQState] = useState(0);
  const [clockTriggered, setClockTriggered] = useState(false);
  const [invalidState, setInvalidState] = useState(false);

  // Trigger Rising Clock Edge
  const triggerClock = () => {
    setClockTriggered(true);
    setTimeout(() => setClockTriggered(false), 300);

    if (ffType === 'D') {
      // D Flip-Flop: Q(t+1) = D
      setQState(dInput);
      setInvalidState(false);
    } else if (ffType === 'JK') {
      // JK Flip-Flop:
      // J=0, K=0 -> No change
      // J=0, K=1 -> Reset (0)
      // J=1, K=0 -> Set (1)
      // J=1, K=1 -> Toggle (Q')
      if (jInput === 0 && kInput === 0) {
        // No change
      } else if (jInput === 0 && kInput === 1) {
        setQState(0);
      } else if (jInput === 1 && kInput === 0) {
        setQState(1);
      } else if (jInput === 1 && kInput === 1) {
        setQState(qState ? 0 : 1);
      }
      setInvalidState(false);
    } else if (ffType === 'SR') {
      // SR Latch / Flip-Flop:
      // S=0, R=0 -> No change
      // S=0, R=1 -> Reset (0)
      // S=1, R=0 -> Set (1)
      // S=1, R=1 -> Invalid / Race Condition
      if (sInput === 1 && rInput === 1) {
        setInvalidState(true);
      } else {
        setInvalidState(false);
        if (sInput === 1 && rInput === 0) setQState(1);
        if (sInput === 0 && rInput === 1) setQState(0);
      }
    }
  };

  const resetFlipFlop = () => {
    setQState(0);
    setInvalidState(false);
    setDInput(0);
    setSInput(0);
    setRInput(0);
    setJInput(0);
    setKInput(0);
  };

  return (
    <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-2xl flex flex-col space-y-4">
      {/* Header and Type Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>INTERACTIVE FLIP-FLOP &amp; LATCH LABORATORY</span>
          </h2>
          <p className="text-xs text-railway-muted">
            Fundamental Sequential Memory Elements: Bistable Multivibrators with Clock-Edge Synchronization
          </p>
        </div>

        {/* FF Type Switcher */}
        <div className="flex items-center space-x-1 bg-railway-darker p-1 rounded-lg border border-railway-border font-mono text-xs">
          {['D', 'JK', 'SR'].map((type) => (
            <button
              key={type}
              onClick={() => { setFfType(type); setInvalidState(false); }}
              className={`px-3 py-1.5 rounded font-bold transition-all ${
                ffType === type
                  ? 'bg-cyan-500 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type === 'D' ? 'D Flip-Flop (State Register)' : (type === 'JK' ? 'JK Flip-Flop' : 'SR Latch')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Flip-Flop Graphic and Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive SVG Flip-Flop Symbol (7 cols) */}
        <div className="lg:col-span-7 bg-railway-darker p-4 rounded-xl border border-railway-border flex flex-col items-center justify-center">
          <svg viewBox="0 0 460 260" className="w-full max-w-[460px] h-60 select-none font-mono">
            {/* Flip-Flop IC Block */}
            <rect x="140" y="40" width="180" height="180" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
            <text x="230" y="70" fill="#38bdf8" fontSize="14" fontWeight="bold" textAnchor="middle">
              {ffType === 'D' ? 'D FLIP-FLOP' : (ffType === 'JK' ? 'JK FLIP-FLOP' : 'SR LATCH')}
            </text>
            <text x="230" y="90" fill="#94a3b8" fontSize="9" textAnchor="middle">
              {ffType === 'D' ? '74HC74' : (ffType === 'JK' ? '74HC73' : '74HC02 NOR')}
            </text>

            {/* CLOCK Input (with dynamic triangular edge symbol) */}
            <g transform="translate(140, 150)">
              {/* Dynamic pulse wire */}
              <line x1="-90" y1="0" x2="0" y2="0" stroke={clockTriggered ? '#f59e0b' : '#334155'} strokeWidth="4" />
              <polygon points="0,-12 14,0 0,12" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <text x="-40" y="-8" fill={clockTriggered ? '#f59e0b' : '#64748b'} fontSize="10" fontWeight="bold">CLK (↑)</text>
            </g>

            {/* D FLIP-FLOP SPECIFIC PINS */}
            {ffType === 'D' && (
              <g>
                {/* Data Input D Pin */}
                <line x1="50" y1="90" x2="140" y2="90" stroke={dInput ? '#f59e0b' : '#334155'} strokeWidth="4" />
                <circle cx="50" cy="90" r="6" fill={dInput ? '#f59e0b' : '#334155'} />
                <text x="65" y="82" fill="#f59e0b" fontSize="12" fontWeight="bold">D = {dInput}</text>
              </g>
            )}

            {/* JK FLIP-FLOP SPECIFIC PINS */}
            {ffType === 'JK' && (
              <g>
                <line x1="50" y1="90" x2="140" y2="90" stroke={jInput ? '#f59e0b' : '#334155'} strokeWidth="4" />
                <circle cx="50" cy="90" r="6" fill={jInput ? '#f59e0b' : '#334155'} />
                <text x="65" y="82" fill="#f59e0b" fontSize="12" fontWeight="bold">J = {jInput}</text>

                <line x1="50" y1="190" x2="140" y2="190" stroke={kInput ? '#f59e0b' : '#334155'} strokeWidth="4" />
                <circle cx="50" cy="190" r="6" fill={kInput ? '#f59e0b' : '#334155'} />
                <text x="65" y="182" fill="#f59e0b" fontSize="12" fontWeight="bold">K = {kInput}</text>
              </g>
            )}

            {/* SR LATCH SPECIFIC PINS */}
            {ffType === 'SR' && (
              <g>
                <line x1="50" y1="90" x2="140" y2="90" stroke={sInput ? '#f59e0b' : '#334155'} strokeWidth="4" />
                <circle cx="50" cy="90" r="6" fill={sInput ? '#f59e0b' : '#334155'} />
                <text x="65" y="82" fill="#f59e0b" fontSize="12" fontWeight="bold">S = {sInput}</text>

                <line x1="50" y1="190" x2="140" y2="190" stroke={rInput ? '#f59e0b' : '#334155'} strokeWidth="4" />
                <circle cx="50" cy="190" r="6" fill={rInput ? '#f59e0b' : '#334155'} />
                <text x="65" y="182" fill="#f59e0b" fontSize="12" fontWeight="bold">R = {rInput}</text>
              </g>
            )}

            {/* OUTPUTS: Q and Q' */}
            {/* Output Q */}
            <line x1="320" y1="90" x2="410" y2="90" stroke={qState ? '#10b981' : '#334155'} strokeWidth="4" />
            <circle cx="410" cy="90" r="6" fill={qState ? '#10b981' : '#334155'} />
            <text x="340" y="82" fill="#10b981" fontSize="12" fontWeight="bold">Q = {invalidState ? 'ERR' : qState}</text>

            {/* Output Q' (Inverted) */}
            <line x1="320" y1="170" x2="410" y2="170" stroke={!qState ? '#10b981' : '#334155'} strokeWidth="4" />
            <circle cx="410" cy="170" r="6" fill={!qState ? '#10b981' : '#334155'} />
            <circle cx="326" cy="170" r="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x="340" y="162" fill="#94a3b8" fontSize="12" fontWeight="bold">Q' = {invalidState ? 'ERR' : (qState ? 0 : 1)}</text>

            {/* Invalid State Warning Badge */}
            {invalidState && (
              <g transform="translate(230, 185)">
                <rect x="-80" y="-12" width="160" height="24" rx="4" fill="#dc2626" />
                <text x="0" y="4" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  FORBIDDEN S=1, R=1
                </text>
              </g>
            )}
          </svg>

          {/* Interactive Clock Trigger and Input Controls */}
          <div className="mt-2 w-full flex flex-wrap items-center justify-between gap-2 p-2 bg-railway-panel rounded-lg border border-railway-border/60">
            {/* Input Switches */}
            <div className="flex items-center space-x-2 font-mono text-xs">
              {ffType === 'D' && (
                <button
                  onClick={() => setDInput(dInput ? 0 : 1)}
                  className={`px-3 py-1.5 rounded font-bold border transition-all ${
                    dInput ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Toggle D: {dInput}
                </button>
              )}

              {ffType === 'JK' && (
                <>
                  <button
                    onClick={() => setJInput(jInput ? 0 : 1)}
                    className={`px-2.5 py-1.5 rounded font-bold border transition-all ${
                      jInput ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    J: {jInput}
                  </button>
                  <button
                    onClick={() => setKInput(kInput ? 0 : 1)}
                    className={`px-2.5 py-1.5 rounded font-bold border transition-all ${
                      kInput ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    K: {kInput}
                  </button>
                </>
              )}

              {ffType === 'SR' && (
                <>
                  <button
                    onClick={() => setSInput(sInput ? 0 : 1)}
                    className={`px-2.5 py-1.5 rounded font-bold border transition-all ${
                      sInput ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    S: {sInput}
                  </button>
                  <button
                    onClick={() => setRInput(rInput ? 0 : 1)}
                    className={`px-2.5 py-1.5 rounded font-bold border transition-all ${
                      rInput ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    R: {rInput}
                  </button>
                </>
              )}
            </div>

            {/* Rising Edge Trigger Button */}
            <button
              onClick={triggerClock}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded text-xs font-mono font-bold transition-all shadow ${
                clockTriggered ? 'bg-amber-400 text-black shadow-amber-400/50 scale-105' : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>SEND CLK PULSE (↑)</span>
            </button>

            <button
              onClick={resetFlipFlop}
              title="Reset flip-flop"
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Characteristic Equation & Excitation Table (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 font-mono text-xs">
          <div className="bg-railway-darker p-4 rounded-xl border border-railway-border space-y-3">
            <h3 className="font-bold text-cyan-400">CHARACTERISTIC EQUATION</h3>
            {ffType === 'D' && (
              <div>
                <p className="text-emerald-400 text-base font-bold bg-railway-panel p-2 rounded border border-railway-border/60">
                  Q(t+1) = D
                </p>
                <p className="text-slate-400 text-[11px] mt-1">
                  The next state Q(t+1) copies input D unconditionally on the rising clock edge. This is why 3 D flip-flops are used as our railway state registers Q2, Q1, Q0.
                </p>
              </div>
            )}
            {ffType === 'JK' && (
              <div>
                <p className="text-emerald-400 text-base font-bold bg-railway-panel p-2 rounded border border-railway-border/60">
                  Q(t+1) = J · Q' + K' · Q
                </p>
                <p className="text-slate-400 text-[11px] mt-1">
                  Universal flip-flop: eliminates the invalid state of the SR latch. When J=1 and K=1, the output toggles on every clock edge.
                </p>
              </div>
            )}
            {ffType === 'SR' && (
              <div>
                <p className="text-emerald-400 text-base font-bold bg-railway-panel p-2 rounded border border-railway-border/60">
                  Q(t+1) = S + R' · Q &nbsp;(S · R = 0)
                </p>
                <p className="text-slate-400 text-[11px] mt-1">
                  Bistable set-reset latch. S=1, R=1 is strictly forbidden because it forces Q and Q' to 0 simultaneously.
                </p>
              </div>
            )}
          </div>

          <div className="bg-railway-darker p-4 rounded-xl border border-railway-border space-y-2">
            <h3 className="font-bold text-railway-yellow">EXCITATION TABLE</h3>
            <table className="w-full text-[11px] text-left">
              <thead>
                <tr className="border-b border-railway-border/60 text-slate-400">
                  <th className="py-1">Q(t)</th>
                  <th>Q(t+1)</th>
                  <th className="text-cyan-300">Required Input(s)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-railway-border/30 text-slate-300">
                {ffType === 'D' ? (
                  <>
                    <tr><td className="py-1">0</td><td>0</td><td className="text-cyan-300">D = 0</td></tr>
                    <tr><td className="py-1">0</td><td>1</td><td className="text-cyan-300">D = 1</td></tr>
                    <tr><td className="py-1">1</td><td>0</td><td className="text-cyan-300">D = 0</td></tr>
                    <tr><td className="py-1">1</td><td>1</td><td className="text-cyan-300">D = 1</td></tr>
                  </>
                ) : ffType === 'JK' ? (
                  <>
                    <tr><td className="py-1">0</td><td>0</td><td className="text-cyan-300">J=0, K=X</td></tr>
                    <tr><td className="py-1">0</td><td>1</td><td className="text-cyan-300">J=1, K=X</td></tr>
                    <tr><td className="py-1">1</td><td>0</td><td className="text-cyan-300">J=X, K=1</td></tr>
                    <tr><td className="py-1">1</td><td>1</td><td className="text-cyan-300">J=X, K=0</td></tr>
                  </>
                ) : (
                  <>
                    <tr><td className="py-1">0</td><td>0</td><td className="text-cyan-300">S=0, R=X</td></tr>
                    <tr><td className="py-1">0</td><td>1</td><td className="text-cyan-300">S=1, R=0</td></tr>
                    <tr><td className="py-1">1</td><td>0</td><td className="text-cyan-300">S=0, R=1</td></tr>
                    <tr><td className="py-1">1</td><td>1</td><td className="text-cyan-300">S=X, R=0</td></tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
