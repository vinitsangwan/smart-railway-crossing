import React, { useState } from 'react';
import BreadboardView from '../components/BreadboardView';
import { CircuitBoard, Copy, Check, ExternalLink, Terminal, AlertCircle, FileCode } from 'lucide-react';

export default function VirtualCircuit({ simState, onToggleSensor }) {
  const [activeTab, setActiveTab] = useState('BREADBOARD'); // 'BREADBOARD', 'SKETCH', 'WOKWI', 'TINKERCAD'
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedWokwi, setCopiedWokwi] = useState(false);

  // Read sketch code snippet for display
  const FIRMWARE_SKETCH_TEXT = `/* ============================================================================
 * SMART RAILWAY CROSSING WARNING LOGIC CONTROLLER
 * Microcontroller: ATmega328P MCU | Non-Blocking Hardware Timing
 * ============================================================================ */
#include <Servo.h>

const uint8_t PIN_SENSOR_A    = 2;   // Approach Sensor
const uint8_t PIN_SENSOR_B    = 3;   // Crossing Occupancy
const uint8_t PIN_SENSOR_C    = 4;   // Departure Clear
const uint8_t PIN_EMERGENCY_D = 5;   // Emergency Stop Line
const uint8_t PIN_RED_LED1    = 6;   // Red Warning Flasher 1
const uint8_t PIN_RED_LED2    = 7;   // Red Warning Flasher 2
const uint8_t PIN_GREEN_LED   = 8;   // Green Safe Status
const uint8_t PIN_BUZZER      = 9;   // Warning Buzzer Alarm
const uint8_t PIN_SERVO       = 10;  // Barrier Servo PWM

Servo barrierServo;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_SENSOR_A, INPUT_PULLUP);
  pinMode(PIN_SENSOR_B, INPUT_PULLUP);
  pinMode(PIN_SENSOR_C, INPUT_PULLUP);
  pinMode(PIN_EMERGENCY_D, INPUT_PULLUP);

  pinMode(PIN_RED_LED1, OUTPUT);
  pinMode(PIN_RED_LED2, OUTPUT);
  pinMode(PIN_GREEN_LED, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);

  barrierServo.attach(PIN_SERVO);
  barrierServo.write(90); // 90° = Barrier Open
}

void loop() {
  // 1. Debounced Sensor Inputs (Active-LOW with pullup inverted to 1/0)
  uint8_t A = !digitalRead(PIN_SENSOR_A);
  uint8_t B = !digitalRead(PIN_SENSOR_B);
  uint8_t C = !digitalRead(PIN_SENSOR_C);
  uint8_t D = !digitalRead(PIN_EMERGENCY_D);

  // 2. Boolean Formulas
  uint8_t W = (A || B || D) ? 1 : 0;                 // Warning: W = A + B + D
  uint8_t G = (A || B || D) ? 1 : 0;                 // Gate Close: G = A + B + D
  uint8_t O = (C && !A && !B && !D) ? 1 : 0;         // Safe to Open: O = C · A' · B' · D'

  // 3. FSM Update with non-blocking millis() ...
  // [Full sketch available in firmware/railway_crossing.ino]
}`;

  const WOKWI_DIAGRAM_JSON = `{
  "version": 1,
  "author": "Smart Railway Control Team",
  "editor": "wokwi",
  "parts": [
    { "type": "wokwi-arduino-uno", "id": "uno", "top": 120, "left": 180 },
    { "type": "wokwi-led", "id": "led_red1", "top": 40, "left": 460, "attrs": { "color": "red" } },
    { "type": "wokwi-led", "id": "led_red2", "top": 80, "left": 460, "attrs": { "color": "red" } },
    { "type": "wokwi-led", "id": "led_green", "top": 120, "left": 460, "attrs": { "color": "green" } },
    { "type": "wokwi-resistor", "id": "r_red1", "top": 50, "left": 520, "attrs": { "value": "220" } },
    { "type": "wokwi-buzzer", "id": "buzzer", "top": 180, "left": 470 },
    { "type": "wokwi-servo", "id": "servo_barrier", "top": 280, "left": 460 },
    { "type": "wokwi-pushbutton", "id": "btn_sensorA", "top": 40, "left": -20 },
    { "type": "wokwi-pushbutton", "id": "btn_sensorB", "top": 110, "left": -20 },
    { "type": "wokwi-pushbutton", "id": "btn_sensorC", "top": 180, "left": -20 },
    { "type": "wokwi-pushbutton", "id": "btn_emergencyD", "top": 250, "left": -20 }
  ],
  "connections": [
    [ "uno:6", "r_red1:1", "red" ],
    [ "r_red1:2", "led_red1:A", "red" ],
    [ "uno:10", "servo_barrier:PWM", "orange" ],
    [ "btn_sensorA:1.1", "uno:2", "yellow" ]
  ]
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(FIRMWARE_SKETCH_TEXT);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyWokwi = () => {
    navigator.clipboard.writeText(WOKWI_DIAGRAM_JSON);
    setCopiedWokwi(true);
    setTimeout(() => setCopiedWokwi(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Mode Notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-railway-border/60">
        <div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-wide font-mono flex items-center space-x-2">
            <CircuitBoard className="w-6 h-6 text-stone-700 dark:text-stone-300" />
            <span>HARDWARE CIRCUIT &amp; FIRMWARE SIMULATION</span>
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Reproducible virtual electronics schematics for Tinkercad Circuits and Wokwi
          </p>
        </div>

        {/* Operating Mode Pill */}
        <div className="flex items-center space-x-2 bg-railway-card px-3 py-1.5 rounded-lg border border-railway-border text-xs font-mono">
          <span className="text-stone-600 dark:text-stone-400">MODE:</span>
          <span className="px-2 py-0.5 rounded bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-bold border border-stone-700 dark:border-stone-300">
            WEB SIMULATION BENCH
          </span>
        </div>
      </div>

      {/* Simulator Mode Architecture Disclaimer */}
      <div className="bg-cream-100/60 dark:bg-obsidian-900/60 p-4 rounded-xl border border-railway-border text-xs text-stone-700 dark:text-stone-300 space-y-2">
        <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 font-mono font-bold">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span>SIMULATOR ARCHITECTURE &amp; OPERATING MODES</span>
        </div>
        <p className="leading-relaxed">
          <strong className="text-stone-900 dark:text-stone-100 font-semibold">Mode 1 (Web Simulation Mode):</strong> The interactive animated train and digital oscilloscope are executed
          directly inside this web dashboard using deterministic Boolean logic functions and finite-state machine transitions.
        </p>
        <p className="leading-relaxed">
          <strong className="text-stone-900 dark:text-stone-100 font-semibold">Mode 2 (Virtual Circuit Mode):</strong> The microcontroller firmware (<code className="text-stone-900 dark:text-stone-100 font-bold">railway_crossing.ino</code>) and virtual breadboard wiring
          can be imported directly into <strong>Tinkercad Circuits</strong> or <strong>Wokwi</strong> to execute on an emulated AVR core.
          Both environments execute the exact same mathematical state machine and safety interlocks.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-railway-border/60 pb-2">
        {[
          { id: 'BREADBOARD', label: 'Virtual Breadboard Schematic' },
          { id: 'SKETCH', label: 'C++ Firmware Sketch (railway_crossing.ino)' },
          { id: 'WOKWI', label: 'Wokwi Simulator (diagram.json)' },
          { id: 'TINKERCAD', label: 'Tinkercad Wiring Guide' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                : 'bg-railway-panel text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-railway-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'BREADBOARD' && (
        <BreadboardView simState={simState} onToggleSensor={onToggleSensor} />
      )}

      {activeTab === 'SKETCH' && (
        <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-railway-border">
            <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>firmware/railway_crossing.ino (Firmware)</span>
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 px-3 py-1 rounded bg-railway-panel hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 text-xs font-mono border border-railway-border transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>

          <pre className="bg-[#121215] text-stone-200 p-4 rounded-lg border border-railway-border text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
            {FIRMWARE_SKETCH_TEXT}
          </pre>
        </div>
      )}

      {activeTab === 'WOKWI' && (
        <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-railway-border">
            <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>wokwi/diagram.json (Importable Virtual Schematic)</span>
            </span>
            <button
              onClick={handleCopyWokwi}
              className="flex items-center space-x-1.5 px-3 py-1 rounded bg-railway-panel hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 text-xs font-mono border border-railway-border transition-colors"
            >
              {copiedWokwi ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWokwi ? "Copied!" : "Copy JSON"}</span>
            </button>
          </div>

          <pre className="bg-[#121215] text-stone-200 p-4 rounded-lg border border-railway-border text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
            {WOKWI_DIAGRAM_JSON}
          </pre>
        </div>
      )}

      {activeTab === 'TINKERCAD' && (
        <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-sm space-y-4 font-mono text-xs text-stone-700 dark:text-stone-300">
          <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm uppercase">
            Tinkercad Circuits Reproduction Guide
          </h3>
          <ol className="list-decimal list-inside space-y-2 leading-relaxed bg-cream-100/60 dark:bg-obsidian-900/60 p-4 rounded-lg border border-railway-border">
            <li>Open <a href="https://www.tinkercad.com" target="_blank" rel="noreferrer" className="text-stone-900 dark:text-stone-100 underline font-semibold">Tinkercad Circuits</a> and click "Create New Circuit".</li>
            <li>Add 1x <strong>Microcontroller Development Board</strong> and 1x <strong>Small Breadboard</strong>.</li>
            <li>Connect <strong>Pushbuttons</strong> to pins D2 (Sensor A), D3 (Sensor B), D4 (Sensor C), D5 (Emergency D) with internal pull-up enabled in sketch.</li>
            <li>Wire 2x <strong>Red LEDs</strong> to pins D6 and D7 through 220Ω resistors to GND.</li>
            <li>Wire 1x <strong>Green LED</strong> to pin D8 through a 220Ω resistor to GND.</li>
            <li>Wire 1x <strong>Piezo Buzzer</strong> positive to D9 and negative to GND.</li>
            <li>Wire 1x <strong>Micro Servo SG90</strong> signal to D10, power to 5V, ground to GND.</li>
            <li>Click "Code" -&gt; Select "Text" -&gt; Paste the full code from <code className="text-stone-900 dark:text-stone-100 font-bold">firmware/railway_crossing.ino</code>.</li>
            <li>Click <strong>Start Simulation</strong> and click push buttons to test the sequential crossing!</li>
          </ol>
        </div>
      )}
    </div>
  );
}
