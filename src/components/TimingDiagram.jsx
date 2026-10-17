import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, Activity } from 'lucide-react';

export default function TimingDiagram({
  simState,
  onStart,
  onPause,
  onStep,
  onReset
}) {
  const { waveforms, isRunning } = simState;

  // Signal channels to render
  const CHANNELS = [
    { key: 'clock', label: 'CLK (Clock)', color: '#a8a59e', type: 'digital' },
    { key: 'A', label: 'Sensor A (Approach)', color: '#f59e0b', type: 'digital' },
    { key: 'B', label: 'Sensor B (Occupancy)', color: '#dc2626', type: 'digital' },
    { key: 'C', label: 'Sensor C (Clear)', color: '#059669', type: 'digital' },
    { key: 'D', label: 'Sensor D (Emergency)', color: '#b91c1c', type: 'digital' },
    { key: 'W', label: 'Warning W (Comb)', color: '#d97706', type: 'digital' },
    { key: 'G', label: 'Gate Close G (Comb)', color: '#ea580c', type: 'digital' },
    { key: 'O', label: 'Safe Open O (Comb)', color: '#10b981', type: 'digital' },
    { key: 'warningLights', label: 'Warning Lights (FSM)', color: '#dc2626', type: 'digital' },
    { key: 'buzzer', label: 'Buzzer Siren (FSM)', color: '#854d0e', type: 'digital' },
    { key: 'gateStatusNum', label: 'Gate Position', color: '#d1cdc4', type: 'analog' }
  ];

  const totalPoints = Math.max(waveforms.length, 30);
  const chartWidth = 840;
  const channelHeight = 34;
  const startX = 170;
  const renderWidth = chartWidth - startX;
  const stepX = renderWidth / Math.max(totalPoints - 1, 1);

  // Helper to generate SVG polyline path for square digital signals
  const buildDigitalPath = (channelKey, baselineY, highY) => {
    if (waveforms.length === 0) return '';
    let d = '';

    waveforms.forEach((pt, idx) => {
      const x = startX + idx * stepX;
      const isHigh = pt[channelKey] === 1;
      const y = isHigh ? highY : baselineY;

      if (idx === 0) {
        d += `M ${x} ${y}`;
      } else {
        const prevPt = waveforms[idx - 1];
        const prevHigh = prevPt[channelKey] === 1;
        const prevY = prevHigh ? highY : baselineY;
        // Draw horizontal line to current X, then instantaneous vertical transition
        d += ` L ${x} ${prevY} L ${x} ${y}`;
      }
    });

    return d;
  };

  // Helper for multi-level Gate position waveform
  const buildAnalogPath = (baselineY, maxHeight) => {
    if (waveforms.length === 0) return '';
    let d = '';

    waveforms.forEach((pt, idx) => {
      const x = startX + idx * stepX;
      // pt.gateStatusNum: 0 (Open), 0.33 (Closing), 1 (Closed), 0.66 (Opening)
      const ratio = pt.gateStatusNum ?? (pt.gateClosed ? 1 : 0);
      const y = baselineY - (ratio * maxHeight);

      if (idx === 0) {
        d += `M ${x} ${y}`;
      } else {
        d += ` L ${x} ${y}`;
      }
    });

    return d;
  };

  return (
    <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-sm flex flex-col space-y-4">
      {/* Waveform Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
        <div>
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-50 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-stone-700 dark:text-stone-300" />
            <span>REAL-TIME DIGITAL LOGIC ANALYZER &amp; TIMING WAVEFORMS</span>
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Live sample history captured directly from running simulation clock cycles
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {isRunning ? (
            <button
              onClick={onPause}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-mono font-bold"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>PAUSE</span>
            </button>
          ) : (
            <button
              onClick={onStart}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold"
            >
              <Play className="w-3.5 h-3.5" />
              <span>CAPTURE</span>
            </button>
          )}

          <button
            onClick={onStep}
            disabled={isRunning}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-railway-panel hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-40 text-stone-900 dark:text-stone-100 border border-railway-border text-xs font-mono"
          >
            <SkipForward className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
            <span>STEP (1 CLK)</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-railway-panel hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 border border-railway-border text-xs font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* SVG Waveform Oscilloscope Display */}
      <div className="bg-railway-darker rounded-xl p-4 border border-railway-border overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${CHANNELS.length * channelHeight + 60}`} className="w-full min-w-[760px] h-[480px] font-mono select-none">
          <defs>
            <pattern id="waveformGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width={chartWidth} height={CHANNELS.length * channelHeight + 60} fill="#131315" />
          <rect width={chartWidth} height={CHANNELS.length * channelHeight + 60} fill="url(#waveformGrid)" />

          {/* Time Division Grids */}
          {waveforms.map((pt, idx) => {
            const x = startX + idx * stepX;
            return (
              <g key={`time-div-${idx}`}>
                <line x1={x} y1="15" x2={x} y2={CHANNELS.length * channelHeight + 35} stroke="#282730" strokeWidth="1" strokeDasharray="2 4" />
                {idx % 5 === 0 && (
                  <text x={x} y="12" fill="#8c8982" fontSize="8" textAnchor="middle">
                    T{pt.cycle}
                  </text>
                )}
              </g>
            );
          })}

          {/* Waveform Channels */}
          {CHANNELS.map((ch, idx) => {
            const chY = idx * channelHeight + 25;
            const baselineY = chY + 24;
            const highY = chY + 6;
            const currentVal = waveforms.length > 0 ? waveforms[waveforms.length - 1][ch.key] : 0;

            return (
              <g key={ch.key} transform={`translate(0, 0)`}>
                {/* Horizontal Baseline */}
                <line x1={startX} y1={baselineY} x2={chartWidth - 10} y2={baselineY} stroke="#282730" strokeWidth="1" />

                {/* Channel Label */}
                <text x="15" y={chY + 16} fill="#d1cdc4" fontSize="10" fontWeight="bold">
                  {ch.label}
                </text>

                {/* Live Current Value Badge */}
                <rect x="125" y={chY + 4} width="32" height="18" rx="3" fill="#1c1c21" stroke={ch.color} strokeWidth="1" />
                <text x="141" y={chY + 16} fill={ch.color} fontSize="9" fontWeight="bold" textAnchor="middle">
                  {ch.type === 'analog' ? (currentVal > 0.5 ? 'CLOSED' : (currentVal > 0 ? 'TRANS' : 'OPEN')) : currentVal}
                </text>

                {/* Signal Polyline */}
                {ch.type === 'digital' ? (
                  <path
                    d={buildDigitalPath(ch.key, baselineY, highY)}
                    fill="none"
                    stroke={ch.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d={buildAnalogPath(baselineY, 18)}
                    fill="none"
                    stroke={ch.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Waveform Interpretation Note */}
      <div className="text-xs text-stone-700 dark:text-stone-300 bg-cream-100/60 dark:bg-obsidian-900/60 p-3 rounded-lg border border-railway-border">
        <span className="font-bold text-stone-900 dark:text-white">Waveform Analysis: </span>
        <span>
          Observe the synchronous relationship between clock pulses and sensor edge transitions.
          When Approach sensor <strong>A</strong> steps from 0 to 1, Warning <strong>W</strong> and Gate Close <strong>G</strong> rise immediately (combinational propagation),
          while the barrier position follows a gradual, clocked trajectory from OPEN to CLOSED.
        </span>
      </div>
    </div>
  );
}
