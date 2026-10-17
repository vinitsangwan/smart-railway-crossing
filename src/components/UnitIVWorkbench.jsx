import React, { useState } from 'react';
import FlipFlopLab from './FlipFlopLab';
import { Clock, Activity, Cpu, Layers, Zap } from 'lucide-react';

export default function UnitIVWorkbench() {
  const [activeSubTab, setActiveSubTab] = useState('FLIPFLOPS'); // 'FLIPFLOPS', 'TIMING', 'FREQ_DIV'

  // Frequency Division simulation
  const [clockPulses, setClockPulses] = useState(0);

  // T Flip-Flop 1 divides clock by 2
  // T Flip-Flop 2 divides clock by 4
  const qDiv2 = Math.floor(clockPulses / 2) % 2;
  const qDiv4 = Math.floor(clockPulses / 4) % 2;

  const handlePulse = () => {
    setClockPulses(prev => prev + 1);
  };

  const handleResetPulse = () => {
    setClockPulses(0);
  };

  return (
    <div className="space-y-6">
      {/* Subtab Selector */}
      <div className="flex flex-wrap gap-2 border-b border-railway-border/60 pb-2 font-mono text-xs">
        {[
          { id: 'FLIPFLOPS', label: '1. Latches & Flip-Flops (SR, D, JK, T)' },
          { id: 'TIMING', label: '2. Timing Parameters (Setup, Hold, Prop Delay)' },
          { id: 'FREQ_DIV', label: '3. Applications: Frequency Division (/2, /4)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubTab === tab.id
                ? 'bg-railway-yellow text-black shadow'
                : 'bg-railway-card text-slate-400 hover:text-white border border-railway-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'FLIPFLOPS' && (
        <FlipFlopLab />
      )}

      {/* 2. Timing Parameters & Race Around Condition */}
      {activeSubTab === 'TIMING' && (
        <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
          <div className="pb-3 border-b border-railway-border">
            <h3 className="text-sm font-bold text-white uppercase flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Sequential Circuit Timing Parameters &amp; Race Around Elimination</span>
            </h3>
            <p className="text-xs text-railway-muted font-sans">
              Critical temporal constraints required for reliable, hazard-free digital state transitions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-railway-darker border border-railway-border space-y-2">
              <span className="text-cyan-400 font-bold block text-sm">1. Setup Time (t_su)</span>
              <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
                The minimum time interval that the digital data input (D, J, K) must remain stable <strong>before</strong> the active clock edge occurs.
                Violating setup time results in metastability.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-railway-darker border border-railway-border space-y-2">
              <span className="text-amber-400 font-bold block text-sm">2. Hold Time (t_h)</span>
              <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
                The minimum time interval that the data input must remain stable <strong>after</strong> the active clock edge has passed to guarantee proper latching inside the internal gates.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-railway-darker border border-railway-border space-y-2">
              <span className="text-emerald-400 font-bold block text-sm">3. Propagation Delay (t_pd)</span>
              <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
                The time elapsed between the trigger edge of the clock signal and the moment the output Q settles at its new valid logic level (typically 5ns to 25ns in 74HC series).
              </p>
            </div>
          </div>

          {/* Race Around Condition Box */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-2 text-slate-200">
            <h4 className="text-rose-400 font-bold text-xs uppercase flex items-center space-x-2">
              <span>Race Around Condition in Level-Triggered JK Flip-Flops:</span>
            </h4>
            <p className="text-[11px] font-sans leading-relaxed">
              When J=1, K=1, and Clock remains HIGH for a duration longer than the propagation delay of the flip-flop (tp &gt; t_pd),
              the output toggles continuously (0 ➔ 1 ➔ 0 ➔ 1) like an oscillator, producing an indeterminate output at the end of the pulse.
            </p>
            <div className="p-2.5 rounded bg-railway-darker border border-railway-border/60 text-slate-300 text-[11px] space-y-1 font-sans">
              <strong className="text-white block font-mono">Methods of Elimination:</strong>
              <div>1. <strong>Edge Triggering:</strong> Responding only to instantaneous rising (0-to-1) or falling (1-to-0) transitions.</div>
              <div>2. <strong>Master-Slave JK Flip-Flop:</strong> Two cascaded stages where Master samples on Clock HIGH and Slave updates output on Clock LOW.</div>
              <div>3. Restricting clock pulse width tp &lt; t_pd (often physically impractical).</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Frequency Division Application */}
      {activeSubTab === 'FREQ_DIV' && (
        <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
            <div>
              <h3 className="text-sm font-bold text-white uppercase flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Flip-Flop Application: Frequency Division (/2 and /4)</span>
              </h3>
              <p className="text-xs text-railway-muted font-sans">
                Cascaded Toggle (T) flip-flops divide clock frequencies for timing circuits, counters, and baud rate generators
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePulse}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Clock Pulse ({clockPulses})</span>
              </button>
              <button
                onClick={handleResetPulse}
                className="px-2.5 py-1.5 rounded bg-railway-panel hover:bg-railway-border text-slate-300 border border-railway-border"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-railway-darker border border-railway-border space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block">Input Clock (f_in)</span>
              <span className="text-2xl font-bold text-cyan-300">{clockPulses} Ticks</span>
              <span className="text-[10px] text-slate-500 block">Frequency = f</span>
            </div>

            <div className="p-4 rounded-xl bg-railway-darker border border-railway-border space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block">Stage 1 Output Q1 (Divide-by-2)</span>
              <span className="text-2xl font-bold text-amber-400">{qDiv2}</span>
              <span className="text-[10px] text-slate-500 block">Frequency = f / 2</span>
            </div>

            <div className="p-4 rounded-xl bg-railway-darker border border-railway-border space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block">Stage 2 Output Q2 (Divide-by-4)</span>
              <span className="text-2xl font-bold text-emerald-400">{qDiv4}</span>
              <span className="text-[10px] text-slate-500 block">Frequency = f / 4</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
