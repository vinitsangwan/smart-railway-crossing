import React from 'react';
import RailwayScene from '../components/RailwayScene';
import EventLog from '../components/EventLog';
import { STATES } from '../logic/stateMachine';
import { Info, ShieldAlert, Cpu } from 'lucide-react';

export default function RailwaySimulation({
  simState,
  onStart,
  onPause,
  onStep,
  onReset,
  onToggleMode,
  onSetSpeed,
  onToggleSensor,
  onSetScenario,
  onEmergencyToggle,
  onClearFault,
  onClearLogs
}) {
  const { fsm, sensors, combinational, eventLogs } = simState;

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-railway-border/60">
        <div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-wide font-mono">
            LIVE RAILWAY CROSSING CONTROL SIMULATOR
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Deterministic kinematic simulation driven exclusively by digital logic and clocked state transitions
          </p>
        </div>
      </div>

      {/* Main Animated SVG Railway Scene */}
      <RailwayScene
        simState={simState}
        onStart={onStart}
        onPause={onPause}
        onStep={onStep}
        onReset={onReset}
        onToggleMode={onToggleMode}
        onSetSpeed={onSetSpeed}
        onToggleSensor={onToggleSensor}
        onSetScenario={onSetScenario}
        onEmergencyToggle={onEmergencyToggle}
        onClearFault={onClearFault}
      />

      {/* Split View: Live Telemetry Status + Controller Event Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Controller Signals (5 cols) */}
        <div className="lg:col-span-5 bg-railway-card border border-railway-border rounded-xl p-5 shadow-sm space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-railway-border/60 pb-2">
            <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>LOGIC CONTROLLER REGISTER &amp; PINS</span>
            </span>
            <span className="text-[10px] text-stone-600 dark:text-stone-400">CYCLE #{fsm.clockCycle}</span>
          </div>

          {/* Sensor Inputs */}
          <div className="space-y-1.5">
            <span className="text-stone-600 dark:text-stone-400 text-[11px] uppercase block">Input Track Sensors:</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-cream-100/60 dark:bg-obsidian-900/60 border border-railway-border flex justify-between items-center">
                <span className="text-stone-700 dark:text-stone-300">A (Approach):</span>
                <span className={`font-bold ${sensors.A ? 'text-amber-700 dark:text-amber-400' : 'text-stone-400 dark:text-stone-600'}`}>{sensors.A}</span>
              </div>
              <div className="p-2 rounded bg-cream-100/60 dark:bg-obsidian-900/60 border border-railway-border flex justify-between items-center">
                <span className="text-stone-700 dark:text-stone-300">B (Occupied):</span>
                <span className={`font-bold ${sensors.B ? 'text-red-700 dark:text-red-400' : 'text-stone-400 dark:text-stone-600'}`}>{sensors.B}</span>
              </div>
              <div className="p-2 rounded bg-cream-100/60 dark:bg-obsidian-900/60 border border-railway-border flex justify-between items-center">
                <span className="text-stone-700 dark:text-stone-300">C (Clear):</span>
                <span className={`font-bold ${sensors.C ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-600'}`}>{sensors.C}</span>
              </div>
              <div className="p-2 rounded bg-cream-100/60 dark:bg-obsidian-900/60 border border-railway-border flex justify-between items-center">
                <span className="text-stone-700 dark:text-stone-300">D (Emergency):</span>
                <span className={`font-bold ${sensors.D ? 'text-red-700 dark:text-red-400 animate-pulse' : 'text-stone-400 dark:text-stone-600'}`}>{sensors.D}</span>
              </div>
            </div>
          </div>

          {/* Evaluated Boolean Outputs */}
          <div className="space-y-1.5">
            <span className="text-stone-600 dark:text-stone-400 text-[11px] uppercase block">Evaluated Logic Outputs:</span>
            <div className="space-y-2">
              <div className="p-2 rounded bg-cream-100/60 dark:bg-obsidian-900/60 border border-railway-border flex justify-between items-center">
                <span className="text-stone-700 dark:text-stone-300">Warning (W = A + B + D):</span>
                <span className={`font-bold px-2 py-0.5 rounded ${combinational.W ? 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30' : 'bg-railway-panel text-stone-500'}`}>
                  {combinational.W}
                </span>
              </div>
              <div className="p-2 rounded bg-cream-100/60 dark:bg-obsidian-900/60 border border-railway-border flex justify-between items-center">
                <span className="text-stone-700 dark:text-stone-300">Gate Close (G = A + B + D):</span>
                <span className={`font-bold px-2 py-0.5 rounded ${combinational.G ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30' : 'bg-railway-panel text-stone-500'}`}>
                  {combinational.G}
                </span>
              </div>
              <div className="p-2 rounded bg-cream-100/60 dark:bg-obsidian-900/60 border border-railway-border flex justify-between items-center">
                <span className="text-stone-700 dark:text-stone-300">Safe Open (O = C·A'·B'·D'):</span>
                <span className={`font-bold px-2 py-0.5 rounded ${combinational.O ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30' : 'bg-railway-panel text-stone-500'}`}>
                  {combinational.O}
                </span>
              </div>
            </div>
          </div>

          {/* Actuator State */}
          <div className="p-3 rounded-lg bg-cream-100/60 dark:bg-obsidian-900/60 border border-railway-border text-stone-700 dark:text-stone-300 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Barrier Boom Arm:</span>
              <span className="text-stone-900 dark:text-white font-bold">{fsm.gateAngle}° ({fsm.gatePosition})</span>
            </div>
            <div className="flex justify-between">
              <span>Warning Flashers:</span>
              <span className={fsm.warningLights ? 'text-red-700 dark:text-red-400 font-bold' : 'text-stone-500'}>
                {fsm.warningLights ? 'ALTERNATING FLASH' : 'EXTINGUISHED'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Alarm Buzzer:</span>
              <span className={fsm.buzzer ? 'text-amber-700 dark:text-amber-400 font-bold' : 'text-stone-500'}>
                {fsm.buzzer ? 'PULSING SIREN' : 'SILENT'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controller Event Log (7 cols) */}
        <div className="lg:col-span-7">
          <EventLog logs={eventLogs} onClearLogs={onClearLogs} />
        </div>
      </div>
    </div>
  );
}
