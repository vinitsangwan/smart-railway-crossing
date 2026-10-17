import React from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  ShieldCheck, 
  Gauge, 
  SlidersHorizontal,
  Zap
} from 'lucide-react';
import { STATES } from '../logic/stateMachine';
import { SIMULATION_MODES } from '../logic/simulationEngine';

export default function RailwayScene({
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
  onClearFault
}) {
  const { trainPosition, trainLength, sensors, fsm, mode, isRunning, speed, manualOverrides } = simState;
  const isEmergency = fsm.currentState === STATES.EMERGENCY || sensors.D === 1;

  // Gate angle: 90 is upright open, 0 is horizontal closed
  const gateAngle = fsm.gateAngle;
  // Warning lights phase: LED1 on when 0, LED2 on when 1
  const isFlashing = fsm.warningLights;
  const led1Active = isFlashing && (fsm.warningFlashPhase === 0);
  const led2Active = isFlashing && (fsm.warningFlashPhase === 1);
  const buzzerActive = fsm.buzzer;

  // Cars waiting when gate is closing or closed
  const carsMustStop = fsm.gatePosition !== 'OPEN';

  return (
    <div className="bg-railway-card border border-railway-border rounded-xl overflow-hidden shadow-md flex flex-col">
      {/* Top Scene Bar with Live Status */}
      <div className="bg-railway-panel/90 border-b border-railway-border px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-50 uppercase tracking-wider">
              LIVE RAILWAY CROSSING SIMULATOR
            </span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded font-mono bg-railway-panel border border-railway-border text-stone-800 dark:text-stone-200">
            MODE: {mode}
          </span>
        </div>

        {/* Live Signal Telemetry */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <div className={`px-2 py-1 rounded border flex items-center space-x-1 ${sensors.A ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/40' : 'bg-railway-panel text-stone-600 dark:text-stone-400 border-railway-border'}`}>
            <span>A (Approach):</span>
            <span className="font-bold">{sensors.A}</span>
          </div>
          <div className={`px-2 py-1 rounded border flex items-center space-x-1 ${sensors.B ? 'bg-red-500/15 text-red-800 dark:text-red-300 border-red-500/40' : 'bg-railway-panel text-stone-600 dark:text-stone-400 border-railway-border'}`}>
            <span>B (Occupied):</span>
            <span className="font-bold">{sensors.B}</span>
          </div>
          <div className={`px-2 py-1 rounded border flex items-center space-x-1 ${sensors.C ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/40' : 'bg-railway-panel text-stone-600 dark:text-stone-400 border-railway-border'}`}>
            <span>C (Clear):</span>
            <span className="font-bold">{sensors.C}</span>
          </div>
          <div className={`px-2 py-1 rounded border flex items-center space-x-1 ${sensors.D ? 'bg-red-600 text-white border-red-700 animate-pulse' : 'bg-railway-panel text-stone-600 dark:text-stone-400 border-railway-border'}`}>
            <span>D (Emergency):</span>
            <span className="font-bold">{sensors.D}</span>
          </div>
        </div>
      </div>

      {/* SVG Railway Environment */}
      <div className="relative w-full bg-[#131315] overflow-hidden select-none border-b border-railway-border" style={{ height: '360px' }}>
        <svg 
          viewBox="0 0 960 360" 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Ballast gravel pattern */}
            <pattern id="ballastPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#1f1f23" />
              <circle cx="4" cy="4" r="1.5" fill="#35343b" />
              <circle cx="14" cy="7" r="1" fill="#45444e" />
              <circle cx="8" cy="15" r="1.8" fill="#35343b" />
              <circle cx="17" cy="16" r="1.2" fill="#45444e" />
            </pattern>

            {/* Barrier hazard stripe pattern */}
            <pattern id="hazardStripe" width="24" height="24" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <rect width="12" height="24" fill="#f4f3f0" />
              <rect x="12" width="12" height="24" fill="#dc2626" />
            </pattern>

            {/* Glowing Red LED filter */}
            <filter id="glowRed" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Glowing Yellow Sensor filter */}
            <filter id="glowYellow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Terrain & Greenery (Warm obsidian palette) */}
          <rect x="0" y="0" width="960" height="360" fill="#141416" />
          
          {/* Ground textures */}
          <rect x="0" y="0" width="960" height="120" fill="#1c1c20" />
          <rect x="0" y="240" width="960" height="120" fill="#1c1c20" />

          {/* NORTH-SOUTH ROAD CROSSING */}
          {/* Road asphalt */}
          <rect x="360" y="0" width="160" height="360" fill="#24242a" />
          {/* Road curbs */}
          <rect x="358" y="0" width="2" height="360" fill="#4d4c55" />
          <rect x="520" y="0" width="2" height="360" fill="#4d4c55" />
          {/* Road yellow center divider line */}
          <line x1="440" y1="0" x2="440" y2="120" stroke="#f59e0b" strokeWidth="3" strokeDasharray="14 8" />
          <line x1="440" y1="240" x2="440" y2="360" stroke="#f59e0b" strokeWidth="3" strokeDasharray="14 8" />
          {/* Road Stop Lines before tracks */}
          <line x1="365" y1="124" x2="515" y2="124" stroke="#f4f3f0" strokeWidth="4" />
          <line x1="365" y1="236" x2="515" y2="236" stroke="#f4f3f0" strokeWidth="4" />
          {/* Zebra Pedestrian Markings */}
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <rect key={`zebra1-${i}`} x={370 + i * 20} y="112" width="12" height="6" fill="#d1cec6" opacity="0.75" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <rect key={`zebra2-${i}`} x={370 + i * 20} y="242" width="12" height="6" fill="#d1cec6" opacity="0.75" />
          ))}

          {/* EAST-WEST RAILWAY TRACK */}
          {/* Track ballast bed */}
          <rect x="0" y="145" width="960" height="70" fill="url(#ballastPattern)" />
          <line x1="0" y1="145" x2="960" y2="145" stroke="#334155" strokeWidth="2" />
          <line x1="0" y1="215" x2="960" y2="215" stroke="#334155" strokeWidth="2" />

          {/* Wooden Railway Sleepers / Ties */}
          {Array.from({ length: 48 }).map((_, i) => (
            <rect 
              key={`sleeper-${i}`} 
              x={i * 20 + 2} 
              y="148" 
              width="8" 
              height="64" 
              rx="1" 
              fill="#473322" 
              stroke="#2e1f13" 
              strokeWidth="1" 
            />
          ))}

          {/* Steel Rails */}
          {/* Top Rail */}
          <line x1="0" y1="162" x2="960" y2="162" stroke="#94a3b8" strokeWidth="5" />
          <line x1="0" y1="162" x2="960" y2="162" stroke="#e2e8f0" strokeWidth="2" />
          {/* Bottom Rail */}
          <line x1="0" y1="198" x2="960" y2="198" stroke="#94a3b8" strokeWidth="5" />
          <line x1="0" y1="198" x2="960" y2="198" stroke="#e2e8f0" strokeWidth="2" />

          {/* SENSOR MARKERS ALONG TRACK (Interactive: Click to toggle) */}
          {/* Approach Sensor A at X = 160 */}
          <g 
            transform="translate(160, 130)"
            onClick={() => onToggleSensor('A')}
            className="cursor-pointer group"
          >
            <title>Click to toggle Approach Sensor A (Currently: {sensors.A})</title>
            <line x1="0" y1="0" x2="0" y2="100" stroke={sensors.A ? '#f59e0b' : '#334155'} strokeWidth="2" strokeDasharray="4 2" />
            <circle cx="0" cy="50" r="14" fill="transparent" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" className="opacity-40 group-hover:opacity-100 transition-opacity" />
            <circle cx="0" cy="50" r="10" fill={sensors.A ? '#f59e0b' : '#1e293b'} stroke="#f59e0b" strokeWidth="2" filter={sensors.A ? 'url(#glowYellow)' : ''} />
            <text x="0" y="54" fill={sensors.A ? '#000000' : '#f59e0b'} fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">A</text>
            <rect x="-34" y="-22" width="68" height="18" rx="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" className="group-hover:stroke-white transition-colors" />
            <text x="0" y="-9" fill="#f59e0b" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              {sensors.A ? 'APPROACH: 1' : 'APPROACH: 0'}
            </text>
          </g>

          {/* Crossing Occupancy Sensor B at X = 440 */}
          <g 
            transform="translate(440, 130)"
            onClick={() => onToggleSensor('B')}
            className="cursor-pointer group"
          >
            <title>Click to toggle Crossing Occupancy Sensor B (Currently: {sensors.B})</title>
            <line x1="0" y1="0" x2="0" y2="100" stroke={sensors.B ? '#ef4444' : '#334155'} strokeWidth="2" strokeDasharray="4 2" />
            <circle cx="0" cy="50" r="14" fill="transparent" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" className="opacity-40 group-hover:opacity-100 transition-opacity" />
            <circle cx="0" cy="50" r="10" fill={sensors.B ? '#ef4444' : '#1e293b'} stroke="#ef4444" strokeWidth="2" filter={sensors.B ? 'url(#glowRed)' : ''} />
            <text x="0" y="54" fill={sensors.B ? '#ffffff' : '#ef4444'} fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">B</text>
            <rect x="-34" y="-22" width="68" height="18" rx="3" fill="#0f172a" stroke="#ef4444" strokeWidth="1" className="group-hover:stroke-white transition-colors" />
            <text x="0" y="-9" fill="#ef4444" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              {sensors.B ? 'OCCUPIED: 1' : 'OCCUPIED: 0'}
            </text>
          </g>

          {/* Departure Sensor C at X = 620 */}
          <g 
            transform="translate(620, 130)"
            onClick={() => onToggleSensor('C')}
            className="cursor-pointer group"
          >
            <title>Click to toggle Departure Sensor C (Currently: {sensors.C})</title>
            <line x1="0" y1="0" x2="0" y2="100" stroke={sensors.C ? '#10b981' : '#334155'} strokeWidth="2" strokeDasharray="4 2" />
            <circle cx="0" cy="50" r="14" fill="transparent" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" className="opacity-40 group-hover:opacity-100 transition-opacity" />
            <circle cx="0" cy="50" r="10" fill={sensors.C ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" />
            <text x="0" y="54" fill={sensors.C ? '#000000' : '#10b981'} fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">C</text>
            <rect x="-34" y="-22" width="68" height="18" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="1" className="group-hover:stroke-white transition-colors" />
            <text x="0" y="-9" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              {sensors.C ? 'CLEAR: 1' : 'CLEAR: 0'}
            </text>
          </g>

          {/* ROAD TRAFFIC: WAITING CARS */}
          {/* Northbound Car (Lower road) */}
          <g transform={`translate(${460}, ${carsMustStop ? 260 : 290})`} className="transition-transform duration-700">
            {/* Car body */}
            <rect x="0" y="0" width="36" height="56" rx="6" fill="#3f3f46" stroke="#27272a" strokeWidth="2" />
            {/* Windshield & Windows */}
            <rect x="4" y="14" width="28" height="24" rx="2" fill="#18181b" />
            <rect x="6" y="16" width="24" height="8" rx="1" fill="#a1a1aa" opacity="0.8" />
            {/* Headlights */}
            <circle cx="6" cy="4" r="3" fill="#fef08a" />
            <circle cx="30" cy="4" r="3" fill="#fef08a" />
            {/* Taillights */}
            <circle cx="6" cy="52" r="3" fill="#dc2626" />
            <circle cx="30" cy="52" r="3" fill="#dc2626" />
          </g>

          {/* Southbound Truck (Upper road) */}
          <g transform={`translate(${380}, ${carsMustStop ? 46 : 20})`} className="transition-transform duration-700">
            {/* Truck trailer */}
            <rect x="0" y="0" width="44" height="42" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            {/* Truck cab */}
            <rect x="2" y="44" width="40" height="24" rx="4" fill="#d97706" stroke="#b45309" strokeWidth="2" />
            {/* Windshield */}
            <rect x="6" y="52" width="32" height="10" rx="2" fill="#0284c7" opacity="0.8" />
            {/* Headlights */}
            <circle cx="8" cy="65" r="3" fill="#fef08a" />
            <circle cx="36" cy="65" r="3" fill="#fef08a" />
          </g>

          {/* RAILWAY WARNING MAST & FLASHERS */}
          {/* Mast on Roadside Right (X = 540, Y = 120) */}
          <g transform="translate(540, 110)">
            {/* Mast Pole */}
            <rect x="-3" y="0" width="6" height="50" fill="#475569" stroke="#1e293b" strokeWidth="1" />
            {/* Crossbuck cross (X) */}
            <g transform="translate(0, -6)">
              <line x1="-18" y1="-9" x2="18" y2="9" stroke="#ffffff" strokeWidth="4" />
              <line x1="-18" y1="-9" x2="18" y2="9" stroke="#000000" strokeWidth="1" />
              <line x1="-18" y1="9" x2="18" y2="-9" stroke="#ffffff" strokeWidth="4" />
              <line x1="-18" y1="9" x2="18" y2="-9" stroke="#000000" strokeWidth="1" />
            </g>

            {/* Alternating Dual Red Flasher Mast Arm */}
            <line x1="-22" y1="12" x2="22" y2="12" stroke="#1e293b" strokeWidth="3" />
            {/* Left Red LED */}
            <circle cx="-18" cy="12" r="7" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <circle 
              cx="-18" 
              cy="12" 
              r="5" 
              fill={led1Active ? '#ef4444' : '#450a0a'} 
              filter={led1Active ? 'url(#glowRed)' : ''} 
            />
            {/* Right Red LED */}
            <circle cx="18" cy="12" r="7" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <circle 
              cx="18" 
              cy="12" 
              r="5" 
              fill={led2Active ? '#ef4444' : '#450a0a'} 
              filter={led2Active ? 'url(#glowRed)' : ''} 
            />

            {/* Green Safe Indicator Lamp */}
            <circle cx="0" cy="28" r="5" fill={!isFlashing ? '#10b981' : '#064e3b'} stroke="#1e293b" strokeWidth="1.5" />

            {/* Electronic Buzzer Housing & Sound Wave Rings */}
            <circle cx="0" cy="-20" r="6" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
            {buzzerActive && (
              <g className="animate-ping" opacity="0.6">
                <circle cx="0" cy="-20" r="14" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="0" cy="-20" r="22" fill="none" stroke="#ef4444" strokeWidth="1" />
              </g>
            )}
          </g>

          {/* RAILWAY BARRIER BOOM GATES */}
          {/* Barrier 1 (North side of crossing, X = 350, Y = 135) */}
          <g transform="translate(350, 135)">
            {/* Pivot Base Post */}
            <rect x="-8" y="-12" width="16" height="24" rx="2" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="6" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.5" />

            {/* Rotating Boom Arm (Angle 90 is vertical, 0 is horizontal) */}
            <g transform={`rotate(${90 - gateAngle})`} className="transition-transform duration-200">
              {/* Arm strip with hazard colors */}
              <rect x="0" y="-4" width="170" height="8" rx="2" fill="url(#hazardStripe)" stroke="#0f172a" strokeWidth="1" />
              {/* Counter-weight end */}
              <rect x="-24" y="-8" width="24" height="16" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
              {/* Tip warning LED */}
              <circle cx="166" cy="0" r="3" fill={isFlashing ? '#ef4444' : '#ffffff'} />
            </g>
          </g>

          {/* Barrier 2 (South side of crossing, X = 530, Y = 225) */}
          <g transform="translate(530, 225)">
            {/* Pivot Base Post */}
            <rect x="-8" y="-12" width="16" height="24" rx="2" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="6" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.5" />

            {/* Rotating Boom Arm (Closes leftwards toward center) */}
            <g transform={`rotate(${-(90 - gateAngle)})`} className="transition-transform duration-200">
              <rect x="-170" y="-4" width="170" height="8" rx="2" fill="url(#hazardStripe)" stroke="#0f172a" strokeWidth="1" />
              <rect x="0" y="-8" width="24" height="16" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
              <circle cx="-166" cy="0" r="3" fill={isFlashing ? '#ef4444' : '#ffffff'} />
            </g>
          </g>

          {/* ANIMATED TRAIN (Locomotive + 3 Carriages) */}
          <g transform={`translate(${trainPosition}, 150)`}>
            {/* Locomotive (Front) */}
            <g transform={`translate(${trainLength - 80}, 0)`}>
              {/* Cowcatcher / Pilot */}
              <polygon points="76,28 86,30 76,32" fill="#64748b" />
              {/* Engine Body */}
              <rect x="0" y="8" width="76" height="44" rx="4" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
              {/* Yellow warning stripes on nose */}
              <rect x="64" y="10" width="8" height="40" fill="#facc15" />
              {/* Cab Windows */}
              <rect x="12" y="12" width="22" height="16" rx="2" fill="#0284c7" />
              <rect x="42" y="12" width="16" height="16" rx="2" fill="#0284c7" />
              {/* Engine vents */}
              <line x1="16" y1="36" x2="36" y2="36" stroke="#7f1d1d" strokeWidth="2" />
              <line x1="16" y1="40" x2="36" y2="40" stroke="#7f1d1d" strokeWidth="2" />
              {/* Headlight with forward beam */}
              <circle cx="76" cy="20" r="4" fill="#fef08a" />
              <polygon points="80,20 220,-5 220,45" fill="#fef08a" opacity="0.15" />
              {/* Bogie Wheels */}
              <circle cx="16" cy="54" r="6" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              <circle cx="34" cy="54" r="6" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              <circle cx="60" cy="54" r="6" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            </g>

            {/* Carriage 1 */}
            <g transform={`translate(${trainLength - 140}, 0)`}>
              <line x1="56" y1="30" x2="64" y2="30" stroke="#334155" strokeWidth="4" />
              <rect x="0" y="10" width="56" height="42" rx="3" fill="#1e3a8a" stroke="#172554" strokeWidth="2" />
              {/* Passenger windows */}
              {[4, 16, 28, 40].map(w => (
                <rect key={`c1-w-${w}`} x={w} y="16" width="9" height="12" rx="1" fill="#38bdf8" opacity="0.8" />
              ))}
              <circle cx="14" cy="54" r="5" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              <circle cx="42" cy="54" r="5" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            </g>

            {/* Carriage 2 */}
            <g transform={`translate(${trainLength - 200}, 0)`}>
              <line x1="56" y1="30" x2="64" y2="30" stroke="#334155" strokeWidth="4" />
              <rect x="0" y="10" width="56" height="42" rx="3" fill="#1e3a8a" stroke="#172554" strokeWidth="2" />
              {[4, 16, 28, 40].map(w => (
                <rect key={`c2-w-${w}`} x={w} y="16" width="9" height="12" rx="1" fill="#38bdf8" opacity="0.8" />
              ))}
              <circle cx="14" cy="54" r="5" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              <circle cx="42" cy="54" r="5" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            </g>

            {/* Carriage 3 (Rear Guard Van) */}
            <g transform="translate(0, 0)">
              <line x1="56" y1="30" x2="64" y2="30" stroke="#334155" strokeWidth="4" />
              <rect x="0" y="10" width="56" height="42" rx="3" fill="#047857" stroke="#064e3b" strokeWidth="2" />
              <rect x="12" y="16" width="12" height="14" rx="1" fill="#6ee7b7" opacity="0.8" />
              <rect x="32" y="16" width="12" height="14" rx="1" fill="#6ee7b7" opacity="0.8" />
              {/* Red Rear Taillight */}
              <circle cx="2" cy="22" r="3" fill="#ef4444" filter="url(#glowRed)" />
              <circle cx="14" cy="54" r="5" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              <circle cx="42" cy="54" r="5" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            </g>
          </g>

          {/* Emergency Alert Banner Overlay */}
          {isEmergency && (
            <g transform="translate(480, 40)">
              <rect x="-180" y="-18" width="360" height="36" rx="6" fill="#be123c" stroke="#f43f5e" strokeWidth="2" filter="url(#glowRed)" />
              <text x="0" y="6" fill="#ffffff" fontSize="14" fontWeight="bold" fontFamily="monospace" textAnchor="middle" letterSpacing="2">
                ⚠ EMERGENCY SHUTDOWN ACTIVE ⚠
              </text>
            </g>
          )}
        </svg>

        {/* Floating Mini Sound / Buzzer Badge */}
        <div className="absolute bottom-3 right-4 flex items-center space-x-2 bg-railway-darker/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-railway-border text-xs font-mono">
          {buzzerActive ? (
            <div className="flex items-center space-x-1.5 text-railway-yellow">
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span className="font-bold">BUZZER: SOUNDING (ALARM)</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-slate-500">
              <VolumeX className="w-4 h-4" />
              <span>BUZZER: SILENT</span>
            </div>
          )}
        </div>
      </div>

      {/* Operator Control Panel (Bottom) */}
      <div className="p-4 bg-railway-card flex flex-wrap items-center justify-between gap-4">
        {/* Playback & Step Controls */}
        <div className="flex items-center space-x-2">
          {isRunning ? (
            <button
              onClick={onPause}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-amber-600/20"
            >
              <Pause className="w-4 h-4" />
              <span>PAUSE</span>
            </button>
          ) : (
            <button
              onClick={onStart}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
            >
              <Play className="w-4 h-4" />
              <span>START SIMULATION</span>
            </button>
          )}

          <button
            onClick={onStep}
            disabled={isRunning}
            title="Step clock forward by 1 cycle"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-railway-panel hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed text-stone-900 dark:text-stone-100 border border-railway-border text-xs font-mono transition-colors"
          >
            <SkipForward className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span>STEP (CLK)</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-railway-panel hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 border border-railway-border text-xs font-mono transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-amber-500" />
            <span>RESET</span>
          </button>
        </div>

        {/* Speed & Mode Selectors */}
        <div className="flex items-center space-x-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-railway-panel p-1 rounded-lg border border-railway-border">
            <button
              onClick={() => onToggleMode(SIMULATION_MODES.AUTO)}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                mode === SIMULATION_MODES.AUTO
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-bold shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              AUTO TRAIN
            </button>
            <button
              onClick={() => onToggleMode(SIMULATION_MODES.MANUAL)}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                mode === SIMULATION_MODES.MANUAL
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-bold shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              MANUAL SENSORS
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center space-x-1 bg-railway-panel px-2 py-1 rounded-lg border border-railway-border text-xs font-mono">
            <Gauge className="w-3.5 h-3.5 text-stone-500" />
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => onSetSpeed(s)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  speed === s ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Manual Sensor Controls (If in Manual mode) */}
        {mode === SIMULATION_MODES.MANUAL && (
          <div className="w-full pt-3 border-t border-railway-border/60 space-y-3">
            {/* Quick Test Scenario Stage Triggers */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-cream-100/60 dark:bg-obsidian-900/60 p-2.5 rounded-lg border border-railway-border">
              <span className="text-[11px] font-mono text-stone-900 dark:text-stone-100 font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-stone-900 dark:bg-stone-100 animate-pulse"></span>
                <span>QUICK TEST SCENARIO STAGES:</span>
              </span>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => onSetScenario ? onSetScenario('approach') : onToggleSensor('A')}
                  className={`px-2.5 py-1 rounded font-mono text-xs font-semibold border transition-all ${
                    sensors.A && !sensors.B && !sensors.C
                      ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm font-bold'
                      : 'bg-railway-panel text-stone-800 dark:text-stone-200 border-railway-border hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                  title="Asserts Approach Sensor A (A=1) - Triggers flashers & lowers barrier"
                >
                  ① Approach (A=1)
                </button>

                <button
                  onClick={() => onSetScenario ? onSetScenario('crossing') : onToggleSensor('B')}
                  className={`px-2.5 py-1 rounded font-mono text-xs font-semibold border transition-all ${
                    sensors.B
                      ? 'bg-red-600 text-white border-red-500 shadow-sm font-bold'
                      : 'bg-railway-panel text-stone-800 dark:text-stone-200 border-railway-border hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                  title="Asserts Crossing Sensor B (B=1) - Positions train on crossing, locks gate down"
                >
                  ② Crossing Occupied (B=1)
                </button>

                <button
                  onClick={() => onSetScenario ? onSetScenario('depart') : onToggleSensor('C')}
                  className={`px-2.5 py-1 rounded font-mono text-xs font-semibold border transition-all ${
                    sensors.C && !sensors.B
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm font-bold'
                      : 'bg-railway-panel text-stone-800 dark:text-stone-200 border-railway-border hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                  title="Asserts Departure Sensor C (C=1) - Evaluates O=1, raises barrier to 90°"
                >
                  ③ Train Departing (C=1)
                </button>

                <button
                  onClick={() => onSetScenario ? onSetScenario('clear') : null}
                  className={`px-2.5 py-1 rounded font-mono text-xs font-semibold border transition-all ${
                    !sensors.A && !sensors.B && !sensors.C && !sensors.D
                      ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 border-stone-600'
                      : 'bg-railway-panel text-stone-800 dark:text-stone-200 border-railway-border hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                  title="Clears all sensors (0,0,0,0) - Returns system to IDLE state 000"
                >
                  ④ All Clear (0)
                </button>

                <button
                  onClick={() => onSetScenario ? onSetScenario('fault') : null}
                  className={`px-2.5 py-1 rounded font-mono text-xs font-semibold border transition-all ${
                    sensors.A && sensors.C
                      ? 'bg-red-600 text-white border-red-500 shadow-sm font-bold animate-pulse'
                      : 'bg-railway-panel text-red-700 dark:text-red-400 border-red-300 dark:border-red-900/60 hover:border-red-500'
                  }`}
                  title="Injects invalid contradiction fault: both Approach (A) and Departure (C) simultaneously active"
                >
                  ⚠️ Sensor Fault (A=1 &amp; C=1)
                </button>
              </div>
            </div>

            {/* Individual Hardware DIP Switches */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono text-stone-700 dark:text-stone-300 flex items-center space-x-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                <span>INDIVIDUAL SWITCHES (OR CLICK SVG TRACK SENSORS):</span>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onToggleSensor('A')}
                  className={`px-3 py-1 rounded font-mono text-xs font-bold border transition-all ${
                    sensors.A
                      ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm'
                      : 'bg-railway-panel text-stone-800 dark:text-stone-200 border-railway-border hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  SW-A: {sensors.A ? '1 (HIGH)' : '0 (LOW)'}
                </button>

                <button
                  onClick={() => onToggleSensor('B')}
                  className={`px-3 py-1 rounded font-mono text-xs font-bold border transition-all ${
                    sensors.B
                      ? 'bg-red-600 text-white border-red-500 shadow-sm'
                      : 'bg-railway-panel text-stone-800 dark:text-stone-200 border-railway-border hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  SW-B: {sensors.B ? '1 (HIGH)' : '0 (LOW)'}
                </button>

                <button
                  onClick={() => onToggleSensor('C')}
                  className={`px-3 py-1 rounded font-mono text-xs font-bold border transition-all ${
                    sensors.C
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-railway-panel text-stone-800 dark:text-stone-200 border-railway-border hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  SW-C: {sensors.C ? '1 (HIGH)' : '0 (LOW)'}
                </button>

                <button
                  onClick={() => onToggleSensor('D')}
                  className={`px-3 py-1 rounded font-mono text-xs font-bold border transition-all ${
                    sensors.D
                      ? 'bg-red-600 text-white border-red-500 shadow-sm animate-pulse'
                      : 'bg-railway-panel text-stone-800 dark:text-stone-200 border-railway-border hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  SW-D (EMERG): {sensors.D ? '1 (ACTIVE)' : '0 (OFF)'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
