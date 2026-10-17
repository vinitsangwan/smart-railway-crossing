import React from 'react';
import { Cpu, Terminal, ExternalLink, Copy, Check } from 'lucide-react';

export default function BreadboardView({ simState, onToggleSensor }) {
  const { sensors, fsm } = simState;
  const isRed1 = fsm.warningLights && fsm.warningFlashPhase === 0;
  const isRed2 = fsm.warningLights && fsm.warningFlashPhase === 1;
  const isGreen = !fsm.warningLights && fsm.gatePosition === 'OPEN';
  const isBuzzer = fsm.buzzer;
  const servoAngle = fsm.gateAngle;

  const [copied, setCopied] = React.useState(false);

  const copyWokwiUrl = () => {
    navigator.clipboard.writeText("https://wokwi.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-2xl flex flex-col space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
        <div>
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-50 flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-stone-700 dark:text-stone-300" />
            <span>VIRTUAL MICROCONTROLLER &amp; BREADBOARD CIRCUIT</span>
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Simulated ATmega328P Microcontroller running railway_crossing.ino with discrete hardware components
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={copyWokwiUrl}
            className="flex items-center space-x-1 px-3 py-1.5 rounded bg-railway-panel hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-mono border border-railway-border transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Link" : "Wokwi Link"}</span>
          </button>
        </div>
      </div>

      {/* SVG Interactive Virtual Breadboard */}
      <div className="bg-railway-darker rounded-xl p-4 border border-railway-border overflow-x-auto">
        <svg viewBox="0 0 900 480" className="w-full min-w-[800px] h-[440px] select-none font-mono">
          <defs>
            <filter id="ledGlowRed" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="ledGlowGreen" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="900" height="480" fill="#131315" />

          {/* CONTROLLER BOARD (Left side: X=40, Y=50, W=320, H=380) */}
          <g transform="translate(40, 50)">
            {/* PCB Body */}
            <rect x="0" y="0" width="320" height="380" rx="10" fill="#1c1c20" stroke="#2e2d36" strokeWidth="3" />
            
            {/* USB Port */}
            <rect x="-10" y="20" width="60" height="50" rx="4" fill="#a0aec0" stroke="#718096" strokeWidth="2" />
            <rect x="-6" y="28" width="40" height="34" fill="#2d3748" />

            {/* DC Power Barrel Jack */}
            <rect x="-12" y="300" width="65" height="55" rx="3" fill="#1a202c" stroke="#2d3748" strokeWidth="2" />
            <circle cx="15" cy="327" r="10" fill="#4a5568" />

            {/* ATmega328P DIP IC Socket */}
            <rect x="140" y="190" width="130" height="45" rx="2" fill="#1a202c" stroke="#4a5568" strokeWidth="1.5" />
            <text x="150" y="218" fill="#e2e8f0" fontSize="10" fontWeight="bold">ATMEGA328P-PU</text>
            {/* IC Pins */}
            {Array.from({ length: 14 }).map((_, i) => (
              <rect key={`icpin-t-${i}`} x={145 + i * 8.5} y="186" width="4" height="5" fill="#cbd5e1" />
            ))}
            {Array.from({ length: 14 }).map((_, i) => (
              <rect key={`icpin-b-${i}`} x={145 + i * 8.5} y="234" width="4" height="5" fill="#cbd5e1" />
            ))}

            {/* Crystal Oscillator */}
            <rect x="105" y="150" width="30" height="15" rx="4" fill="#cbd5e1" stroke="#94a3b8" />
            <text x="110" y="161" fill="#475569" fontSize="8" fontWeight="bold">16MHz</text>

            {/* Reset Button */}
            <circle cx="35" cy="100" r="10" fill="#e2e8f0" stroke="#718096" strokeWidth="2" />
            <circle cx="35" cy="100" r="6" fill="#dc2626" />
            <text x="25" y="125" fill="#cbd5e1" fontSize="9" fontWeight="bold">RESET</text>

            {/* Digital Pin Headers (Top Header: D0 to D13, GND, AREF) */}
            <rect x="110" y="5" width="195" height="24" rx="2" fill="#1a202c" stroke="#2d3748" strokeWidth="1" />
            {['AREF', 'GND', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'TX', 'RX'].map((lbl, i) => (
              <g key={`pin-top-${lbl}`} transform={`translate(${116 + i * 12}, 8)`}>
                <circle cx="4" cy="9" r="3" fill="#fbbf24" stroke="#000000" strokeWidth="0.5" />
                <text x="4" y="28" fill="#94a3b8" fontSize="7" textAnchor="middle">{lbl}</text>
              </g>
            ))}

            {/* Power Pin Headers (Bottom Header: 5V, 3.3V, GND, VIN, A0-A5) */}
            <rect x="110" y="350" width="195" height="24" rx="2" fill="#1a202c" stroke="#2d3748" strokeWidth="1" />
            {['IOREF', 'RST', '3V3', '5V', 'GND', 'GND', 'VIN', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5'].map((lbl, i) => (
              <g key={`pin-bot-${lbl}`} transform={`translate(${116 + i * 14}, 352)`}>
                <circle cx="4" cy="9" r="3" fill="#fbbf24" stroke="#000000" strokeWidth="0.5" />
                <text x="4" y="-3" fill="#94a3b8" fontSize="7" textAnchor="middle">{lbl}</text>
              </g>
            ))}

            {/* Board Branding */}
            <text x="80" y="270" fill="#e2e8f0" fontSize="15" fontWeight="bold">CONTROLLER</text>
            <text x="80" y="290" fill="#fafafa" fontSize="11" fontWeight="bold">ATmega328P</text>
            <text x="80" y="305" fill="#94a3b8" fontSize="8">SMART RAILWAY SYSTEM</text>
          </g>

          {/* SOLDERLESS BREADBOARD (Right side: X=420, Y=50, W=450, H=380) */}
          <g transform="translate(420, 50)">
            {/* Breadboard Base Plastic */}
            <rect x="0" y="0" width="450" height="380" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            {/* Center divider channel */}
            <rect x="10" y="180" width="430" height="20" fill="#e2e8f0" />

            {/* Power Rails */}
            <line x1="15" y1="20" x2="435" y2="20" stroke="#ef4444" strokeWidth="2" />
            <line x1="15" y1="36" x2="435" y2="36" stroke="#52525b" strokeWidth="2" />
            <line x1="15" y1="344" x2="435" y2="344" stroke="#52525b" strokeWidth="2" />
            <line x1="15" y1="360" x2="435" y2="360" stroke="#ef4444" strokeWidth="2" />

            {/* Pin tie-point holes matrix */}
            {Array.from({ length: 28 }).map((_, col) => (
              <g key={`bb-col-${col}`} transform={`translate(${20 + col * 15}, 0)`}>
                {/* Upper block holes */}
                {[55, 75, 95, 115, 135].map(row => (
                  <circle key={`hole-u-${col}-${row}`} cx="0" cy={row} r="2.5" fill="#475569" />
                ))}
                {/* Lower block holes */}
                {[220, 240, 260, 280, 300].map(row => (
                  <circle key={`hole-l-${col}-${row}`} cx="0" cy={row} r="2.5" fill="#475569" />
                ))}
              </g>
            ))}

            {/* 1. SENSOR PUSH BUTTONS ON BREADBOARD */}
            {/* Sensor A Pushbutton */}
            <g transform="translate(40, 70)" className="cursor-pointer" onClick={() => onToggleSensor?.('A')}>
              <rect x="0" y="0" width="34" height="34" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="2" />
              <circle cx="17" cy="17" r="10" fill={sensors.A ? '#f59e0b' : '#64748b'} />
              <text x="17" y="46" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">BTN-A (D2)</text>
            </g>

            {/* Sensor B Pushbutton */}
            <g transform="translate(100, 70)" className="cursor-pointer" onClick={() => onToggleSensor?.('B')}>
              <rect x="0" y="0" width="34" height="34" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="2" />
              <circle cx="17" cy="17" r="10" fill={sensors.B ? '#ef4444' : '#64748b'} />
              <text x="17" y="46" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">BTN-B (D3)</text>
            </g>

            {/* Sensor C Pushbutton */}
            <g transform="translate(160, 70)" className="cursor-pointer" onClick={() => onToggleSensor?.('C')}>
              <rect x="0" y="0" width="34" height="34" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="2" />
              <circle cx="17" cy="17" r="10" fill={sensors.C ? '#10b981' : '#64748b'} />
              <text x="17" y="46" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">BTN-C (D4)</text>
            </g>

            {/* Emergency D Pushbutton */}
            <g transform="translate(220, 70)" className="cursor-pointer" onClick={() => onToggleSensor?.('D')}>
              <rect x="0" y="0" width="34" height="34" rx="4" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />
              <circle cx="17" cy="17" r="10" fill={sensors.D ? '#f43f5e' : '#b91c1c'} />
              <text x="17" y="46" fill="#991b1b" fontSize="8" fontWeight="bold" textAnchor="middle">EMERG (D5)</text>
            </g>

            {/* 2. LED INDICATORS AND 220Ω CURRENT LIMITING RESISTORS */}
            {/* Red LED 1 (D6) */}
            <g transform="translate(45, 230)">
              {/* 220Ω Resistor */}
              <rect x="2" y="-35" width="8" height="22" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="1" />
              <line x1="2" y1="-28" x2="10" y2="-28" stroke="#ef4444" strokeWidth="1.5" />
              <line x1="2" y1="-22" x2="10" y2="-22" stroke="#ef4444" strokeWidth="1.5" />
              <line x1="2" y1="-16" x2="10" y2="-16" stroke="#78350f" strokeWidth="1.5" />
              {/* LED Dome */}
              <circle cx="6" cy="10" r="9" fill={isRed1 ? '#ef4444' : '#450a0a'} stroke="#991b1b" strokeWidth="1.5" filter={isRed1 ? 'url(#ledGlowRed)' : ''} />
              <text x="6" y="32" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">RED 1 (D6)</text>
            </g>

            {/* Red LED 2 (D7) */}
            <g transform="translate(105, 230)">
              <rect x="2" y="-35" width="8" height="22" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="1" />
              <line x1="2" y1="-28" x2="10" y2="-28" stroke="#ef4444" strokeWidth="1.5" />
              <line x1="2" y1="-22" x2="10" y2="-22" stroke="#ef4444" strokeWidth="1.5" />
              <line x1="2" y1="-16" x2="10" y2="-16" stroke="#78350f" strokeWidth="1.5" />
              <circle cx="6" cy="10" r="9" fill={isRed2 ? '#ef4444' : '#450a0a'} stroke="#991b1b" strokeWidth="1.5" filter={isRed2 ? 'url(#ledGlowRed)' : ''} />
              <text x="6" y="32" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">RED 2 (D7)</text>
            </g>

            {/* Green LED (D8) */}
            <g transform="translate(165, 230)">
              <rect x="2" y="-35" width="8" height="22" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="1" />
              <line x1="2" y1="-28" x2="10" y2="-28" stroke="#ef4444" strokeWidth="1.5" />
              <line x1="2" y1="-22" x2="10" y2="-22" stroke="#ef4444" strokeWidth="1.5" />
              <line x1="2" y1="-16" x2="10" y2="-16" stroke="#78350f" strokeWidth="1.5" />
              <circle cx="6" cy="10" r="9" fill={isGreen ? '#10b981' : '#064e3b'} stroke="#047857" strokeWidth="1.5" filter={isGreen ? 'url(#ledGlowGreen)' : ''} />
              <text x="6" y="32" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">GRN (D8)</text>
            </g>

            {/* 3. ACTIVE PIEZO BUZZER (D9) */}
            <g transform="translate(235, 230)">
              <circle cx="18" cy="10" r="18" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
              <circle cx="18" cy="10" r="5" fill="#0f172a" />
              <text x="18" y="42" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">BUZZER (D9)</text>
              {isBuzzer && (
                <circle cx="18" cy="10" r="24" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-ping" />
              )}
            </g>

            {/* 4. MICRO SERVO SG90 (D10) */}
            <g transform="translate(320, 180)">
              <rect x="0" y="0" width="95" height="110" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="2" />
              <text x="47" y="24" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">SG90 SERVO</text>
              <text x="47" y="38" fill="#e4e4e7" fontSize="8" textAnchor="middle">PWM D10</text>
              
              {/* Servo Rotating Gear & Arm */}
              <circle cx="47" cy="70" r="16" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
              <g transform={`translate(47, 70) rotate(${servoAngle - 90})`} className="transition-transform duration-300">
                <rect x="-4" y="-35" width="8" height="40" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                <circle cx="0" cy="0" r="4" fill="#64748b" />
              </g>
              <text x="47" y="102" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">{servoAngle}°</text>
            </g>
          </g>

          {/* JUMPER WIRES BETWEEN CONTROLLER AND BREADBOARD */}
          {/* Wire D2 (Yellow) */}
          <path d="M 314 55 Q 360 20 460 115" fill="none" stroke="#eab308" strokeWidth="3" />
          {/* Wire D3 (Orange) */}
          <path d="M 302 55 Q 360 30 520 115" fill="none" stroke="#f97316" strokeWidth="3" />
          {/* Wire D4 (Green) */}
          <path d="M 290 55 Q 370 40 580 115" fill="none" stroke="#10b981" strokeWidth="3" />
          {/* Wire D5 (Red) */}
          <path d="M 278 55 Q 380 50 640 115" fill="none" stroke="#ef4444" strokeWidth="3" />

          {/* Wire D6 (Red LED 1) */}
          <path d="M 266 55 Q 350 140 465 245" fill="none" stroke="#dc2626" strokeWidth="3" />
          {/* Wire D7 (Red LED 2) */}
          <path d="M 254 55 Q 340 150 525 245" fill="none" stroke="#b91c1c" strokeWidth="3" />
          {/* Wire D8 (Green LED) */}
          <path d="M 242 55 Q 330 160 585 245" fill="none" stroke="#059669" strokeWidth="3" />
          {/* Wire D9 (Buzzer) */}
          <path d="M 230 55 Q 340 190 655 245" fill="none" stroke="#71717a" strokeWidth="3" />
          {/* Wire D10 (Servo PWM) */}
          <path d="M 218 55 Q 360 230 740 250" fill="none" stroke="#f59e0b" strokeWidth="3" />

          {/* Common GND Wire (Black) */}
          <path d="M 200 405 Q 330 460 440 400" fill="none" stroke="#0f172a" strokeWidth="4" />
          {/* Common 5V Wire (Red) */}
          <path d="M 186 405 Q 320 440 440 415" fill="none" stroke="#ef4444" strokeWidth="4" />
        </svg>
      </div>

      {/* Pin Mapping Summary Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <h4 className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 mb-2 uppercase">Input Pin Assignments:</h4>
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                <th className="py-1">Pin</th>
                <th>Signal</th>
                <th>Type</th>
                <th>Logic Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
              <tr>
                <td className="py-1 text-zinc-900 dark:text-zinc-100 font-bold">D2</td>
                <td>Approach Sensor (A)</td>
                <td>INPUT_PULLUP</td>
                <td>{sensors.A ? 'Active (LOW/HIGH)' : 'Idle'}</td>
              </tr>
              <tr>
                <td className="py-1 text-stone-900 dark:text-stone-100 font-bold">D3</td>
                <td>Crossing Occupied (B)</td>
                <td>INPUT_PULLUP</td>
                <td>{sensors.B ? 'Active' : 'Idle'}</td>
              </tr>
              <tr>
                <td className="py-1 text-stone-900 dark:text-stone-100 font-bold">D4</td>
                <td>Crossing Clear (C)</td>
                <td>INPUT_PULLUP</td>
                <td>{sensors.C ? 'Active' : 'Idle'}</td>
              </tr>
              <tr>
                <td className="py-1 text-stone-900 dark:text-stone-100 font-bold">D5</td>
                <td>Emergency Line (D)</td>
                <td>INPUT_PULLUP</td>
                <td>{sensors.D ? 'TRIGGERED' : 'Safe'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-cream-100/60 dark:bg-obsidian-900/60 p-3 rounded-lg border border-railway-border">
          <h4 className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100 mb-2 uppercase">Output Pin Assignments:</h4>
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-railway-border text-stone-600 dark:text-stone-400">
                <th className="py-1">Pin</th>
                <th>Component</th>
                <th>Hardware Role</th>
                <th>Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-railway-border text-stone-800 dark:text-stone-200">
              <tr>
                <td className="py-1 text-amber-500 font-bold">D6</td>
                <td>Red Flasher LED 1</td>
                <td>220Ω Resistor</td>
                <td>{isRed1 ? 'ILLUMINATED' : 'OFF'}</td>
              </tr>
              <tr>
                <td className="py-1 text-amber-500 font-bold">D7</td>
                <td>Red Flasher LED 2</td>
                <td>220Ω Resistor</td>
                <td>{isRed2 ? 'ILLUMINATED' : 'OFF'}</td>
              </tr>
              <tr>
                <td className="py-1 text-amber-500 font-bold">D8</td>
                <td>Green Safe LED</td>
                <td>220Ω Resistor</td>
                <td>{isGreen ? 'ILLUMINATED' : 'OFF'}</td>
              </tr>
              <tr>
                <td className="py-1 text-amber-500 font-bold">D9</td>
                <td>Piezo Buzzer</td>
                <td>Audible Warning</td>
                <td>{isBuzzer ? 'BEEPING' : 'MUTED'}</td>
              </tr>
              <tr>
                <td className="py-1 text-amber-500 font-bold">D10</td>
                <td>SG90 Servo Motor</td>
                <td>Barrier Arm Angle</td>
                <td className="text-stone-900 dark:text-stone-100 font-bold">{servoAngle}° ({fsm.gatePosition})</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
