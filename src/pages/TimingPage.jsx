import React from 'react';
import TimingDiagram from '../components/TimingDiagram';
import { Activity, Clock } from 'lucide-react';

export default function TimingPage({
  simState,
  onStart,
  onPause,
  onStep,
  onReset
}) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-railway-border/60">
        <div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-wide font-mono flex items-center space-x-2">
            <Activity className="w-6 h-6 text-stone-700 dark:text-stone-300" />
            <span>TIMING DIAGRAMS &amp; DIGITAL OSCILLOSCOPE WAVEFORMS</span>
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Multi-channel digital logic signal analyzer capturing transitions across discrete clock intervals
          </p>
        </div>
      </div>

      {/* Main Timing Diagram Component */}
      <TimingDiagram
        simState={simState}
        onStart={onStart}
        onPause={onPause}
        onStep={onStep}
        onReset={onReset}
      />
    </div>
  );
}
