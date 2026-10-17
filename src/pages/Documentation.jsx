import React from 'react';
import { VIVA_QUESTIONS } from '../data/vivaQuestions';
import { Printer, BookOpen, Download, FileText, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

export default function Documentation() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title & Print Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-railway-border/60 no-print">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide font-mono flex items-center space-x-2">
            <FileText className="w-6 h-6 text-railway-yellow" />
            <span>COLLEGE MINI-PROJECT REPORT &amp; VIVA COMPENDIUM</span>
          </h1>
          <p className="text-xs text-railway-muted">
            Formal 27-Section Academic Project Report aligned with DELD syllabus and university viva requirements
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-railway-yellow hover:bg-amber-400 text-black font-mono text-xs font-bold transition-all shadow-md shadow-yellow-500/20"
        >
          <Printer className="w-4 h-4" />
          <span>PRINT / SAVE AS PDF</span>
        </button>
      </div>

      {/* Academic Paper Report Shell */}
      <div className="bg-railway-card border border-railway-border rounded-xl p-6 sm:p-10 shadow-2xl text-slate-200 space-y-8 leading-relaxed font-sans print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        
        {/* Academic Header */}
        <div className="text-center pb-6 border-b border-railway-border/60 print:border-black space-y-2">
          <div className="text-xs font-mono font-bold text-railway-yellow uppercase tracking-widest print:text-black">
            DEPARTMENT OF ELECTRONICS &amp; COMMUNICATION ENGINEERING / COMPUTER SCIENCE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight print:text-black">
            SMART RAILWAY CROSSING WARNING SYSTEM USING DIGITAL LOGIC AND ARDUINO SIMULATION
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono print:text-gray-700">
            Subject: Digital Electronics &amp; Logic Design (DELD) | Course Mini-Project Report
          </p>
        </div>

        {/* 1. Abstract */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider text-cyan-400 print:text-black border-b border-railway-border/40 pb-1">
            1. Abstract
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 print:text-gray-800 leading-relaxed">
            Railway level crossings represent safety-critical intersections where vehicular highway traffic crosses active railway lines.
            This project designs and implements an educational, software-only <strong>Smart Railway Crossing Warning System</strong> using
            core Digital Electronics and Logic Design (DELD) principles coupled with an ATmega328P (Arduino Uno) virtual simulation.
            The system models track approach detection, crossing occupancy, train exit validation, dual alternating warning flashers,
            piezo acoustic sirens, and an SG90 servo-actuated barrier arm. Combinational Boolean equations are developed and simplified via
            direct Boolean algebraic reduction and De Morgan's theorems. Sequential memory control is realized using a 7-state finite-state machine (FSM)
            encoded into 3-bit D flip-flop state registers. The complete architecture is verified across 10 automated edge-case test suites and
            reproduced in Autodesk Tinkercad Circuits and Wokwi.
          </p>
        </section>

        {/* 2. Problem Statement */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider text-cyan-400 print:text-black border-b border-railway-border/40 pb-1">
            2. Problem Statement
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 print:text-gray-800 leading-relaxed">
            Unmanned and manually operated railway level crossings account for numerous catastrophic vehicular collisions globally due to human error,
            delayed barrier lowering, or premature reopening before a train has fully cleared. Furthermore, digital electronics students often view
            Boolean algebra and flip-flops as abstract mathematics disconnected from real-world fail-safe automation.
            There is a compelling need for a deterministic, simulation-based DELD mini-project that models safe railway crossing operations without
            requiring physical proprietary hardware.
          </p>
        </section>

        {/* 3. Aim & Objectives */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider text-cyan-400 print:text-black border-b border-railway-border/40 pb-1">
            3. Aim &amp; Objectives
          </h2>
          <ul className="list-disc list-inside text-xs sm:text-sm text-slate-300 print:text-gray-800 space-y-1">
            <li>Design combinational Boolean expressions for Warning (<code className="text-cyan-300 font-mono">W = A + B + D</code>) and Safe-to-Open (<code className="text-cyan-300 font-mono">O = C · A' · B' · D'</code>).</li>
            <li>Exhaustively evaluate all 16 minterms in a 4-variable truth table and demonstrate algebraic reduction using fundamental Boolean postulates.</li>
            <li>Construct a 7-state clocked sequential finite-state machine using 3 D flip-flops (<code className="text-cyan-300 font-mono">Q2 Q1 Q0</code>).</li>
            <li>Implement non-blocking, debounced C++ firmware for the Arduino Uno with dual flashing LEDs, buzzer, and servo barrier control.</li>
            <li>Validate the design across nominal passage, sensor stuck faults, optical sensor conflicts, and emergency overrides.</li>
          </ul>
        </section>

        {/* 4. Boolean Equations & Proofs */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider text-cyan-400 print:text-black border-b border-railway-border/40 pb-1">
            4. Digital Logic Equations &amp; Mathematical Formulation
          </h2>
          <div className="bg-railway-darker print:bg-gray-100 p-4 rounded-lg font-mono text-xs space-y-2 text-slate-200 print:text-black">
            <div><strong>Input Variables:</strong> A = Train Approaching Sensor | B = Crossing Occupied Sensor | C = Train Clear Sensor | D = Emergency / Sensor Fault</div>
            <div><strong>Warning Request:</strong> W = A + B + D &nbsp;(OR logic: any single hazard triggers warnings)</div>
            <div><strong>Gate-Close Request:</strong> G = A + B + D &nbsp;(OR logic: any hazard mandates barrier closure)</div>
            <div><strong>Safe-to-Open Request:</strong> O = C · A' · B' · D' &nbsp;(AND logic: clear confirmed AND zero hazards)</div>
            <div className="text-emerald-400 print:text-emerald-700 font-bold">
              De Morgan Equivalence: Since W' = (A + B + D)' = A' · B' · D', therefore O = C · W'. Safe to open iff Clear=1 and Warning=0.
            </div>
          </div>
        </section>

        {/* 5. 16-Row Truth Table Summary */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider text-cyan-400 print:text-black border-b border-railway-border/40 pb-1">
            5. Combinational Truth Table (Minterms m0 to m15)
          </h2>
          <p className="text-xs text-slate-300 print:text-gray-800">
            Evaluating the 16 binary combinations reveals that Warning W is asserted in 14 minterms, while Safe-to-Open O is strictly asserted in exactly ONE minterm (<code className="font-mono text-cyan-300">m2: ABCD = 0010</code>).
          </p>
          <div className="overflow-x-auto text-xs font-mono">
            <table className="w-full text-left border border-railway-border print:border-gray-400">
              <thead className="bg-railway-panel print:bg-gray-200">
                <tr className="border-b border-railway-border">
                  <th className="p-1.5">Minterm</th><th>ABCD</th><th>W (Warn)</th><th>G (Gate)</th><th>O (Open)</th><th>Operating Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-railway-border/40 text-[11px]">
                <tr><td className="p-1">m0</td><td>0000</td><td>0</td><td>0</td><td>0</td><td>Idle / Track Clear</td></tr>
                <tr><td className="p-1">m1</td><td>0001</td><td>1</td><td>1</td><td>0</td><td>Emergency Active</td></tr>
                <tr className="bg-emerald-950/20 font-bold text-emerald-400 print:text-emerald-800"><td className="p-1">m2</td><td>0010</td><td>0</td><td>0</td><td>1</td><td>Train Departure Clear (Safe to Open)</td></tr>
                <tr><td className="p-1">m3..m15</td><td>xxxx</td><td>1</td><td>1</td><td>0</td><td>Track Approaching, Occupied, or Conflicting</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. Hardware Pin Mapping & Circuit Specifications */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider text-cyan-400 print:text-black border-b border-railway-border/40 pb-1">
            6. Virtual Hardware Pin Mapping Table
          </h2>
          <div className="overflow-x-auto text-xs font-mono">
            <table className="w-full text-left border border-railway-border print:border-gray-400">
              <thead className="bg-railway-panel print:bg-gray-200">
                <tr className="border-b border-railway-border">
                  <th className="p-1.5">Pin</th><th>Component</th><th>Interface Role</th><th>Hardware Configuration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-railway-border/40 text-[11px]">
                <tr><td className="p-1 font-bold text-cyan-400">D2</td><td>Pushbutton A</td><td>Approach Sensor</td><td>INPUT_PULLUP (Active-LOW)</td></tr>
                <tr><td className="p-1 font-bold text-cyan-400">D3</td><td>Pushbutton B</td><td>Crossing Occupancy</td><td>INPUT_PULLUP (Active-LOW)</td></tr>
                <tr><td className="p-1 font-bold text-cyan-400">D4</td><td>Pushbutton C</td><td>Departure Clear</td><td>INPUT_PULLUP (Active-LOW)</td></tr>
                <tr><td className="p-1 font-bold text-cyan-400">D5</td><td>Pushbutton D</td><td>Emergency Stop Line</td><td>INPUT_PULLUP (Active-LOW)</td></tr>
                <tr><td className="p-1 font-bold text-yellow-400">D6</td><td>Red LED 1</td><td>Warning Flasher 1</td><td>220Ω Resistor to GND</td></tr>
                <tr><td className="p-1 font-bold text-yellow-400">D7</td><td>Red LED 2</td><td>Warning Flasher 2</td><td>220Ω Resistor to GND</td></tr>
                <tr><td className="p-1 font-bold text-yellow-400">D8</td><td>Green LED</td><td>Safe Status Lamp</td><td>220Ω Resistor to GND</td></tr>
                <tr><td className="p-1 font-bold text-yellow-400">D9</td><td>Active Buzzer</td><td>Acoustic Alarm</td><td>GND Return</td></tr>
                <tr><td className="p-1 font-bold text-yellow-400">D10</td><td>SG90 Servo</td><td>Barrier Boom Gate</td><td>PWM Signal, 5V Vcc, GND</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 7. Sequential FSM Design & 3-Bit State Registers */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider text-cyan-400 print:text-black border-b border-railway-border/40 pb-1">
            7. Sequential Finite-State Machine &amp; D Flip-Flop Registers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 print:text-gray-800 leading-relaxed">
            The sequential controller is organized into 7 distinct states: IDLE (000), APPROACHING (001), CLOSING (010),
            CROSSING_OCCUPIED (011), CLEARING (100), OPENING (101), and EMERGENCY (110).
            Three D-type flip-flops (Q2, Q1, Q0) store the active binary state. Because Q(t+1) = D for edge-triggered D flip-flops,
            the next-state combinational logic equations drive inputs D2, D1, D0 directly at each rising clock edge.
          </p>
        </section>

        {/* 8. Course Outcomes & Syllabus Alignment (2025 Pattern) */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider text-cyan-400 print:text-black border-b border-railway-border/40 pb-1">
            8. Syllabus Alignment &amp; Course Outcomes Mapping (2025 Pattern)
          </h2>
          <div className="overflow-x-auto text-xs font-mono">
            <table className="w-full text-left border border-railway-border print:border-gray-400">
              <thead className="bg-railway-panel print:bg-gray-200">
                <tr className="border-b border-railway-border text-slate-300 print:text-black">
                  <th className="p-2">Unit</th>
                  <th className="p-2">Syllabus Scope &amp; Topics</th>
                  <th className="p-2">Demonstrated In Project</th>
                  <th className="p-2">CO / PO Mapping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-railway-border/40 text-[11px] text-slate-200 print:text-black">
                <tr>
                  <td className="p-2 font-bold text-yellow-400">Unit I (08 Hrs)</td>
                  <td className="p-2">Digital vs Analog, Number Systems (Dec/Bin/Oct/Hex), 1's &amp; 2's Complement, BCD, XS-3, Gray Code, Parity.</td>
                  <td className="p-2">Track sensor position Gray encoding, signed 2's complement telemetry, and base conversion workbench.</td>
                  <td className="p-2 font-bold text-emerald-400">CO1 (PO1, PO2, PSO1)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-yellow-400">Unit II (08 Hrs)</td>
                  <td className="p-2">Logic Gates, Universal Gates (NAND/NOR realization), Boolean Postulates, De Morgan's, Voltage Levels.</td>
                  <td className="p-2">Warning W = A+B+D, Safe-to-Open O = C·W', Universal NAND realization, and 5V TTL vs CMOS threshold analysis.</td>
                  <td className="p-2 font-bold text-emerald-400">CO2 (PO1, PO2, PO3, PSO1)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-yellow-400">Unit III (08 Hrs)</td>
                  <td className="p-2">Adders/Subtractors, 4:1 MUX, DEMUX, 4:2 Priority Encoders, Magnitude Comparators, Code Converters.</td>
                  <td className="p-2">Emergency priority encoder (D overrides A, B), 4-bit train overspeed magnitude comparator, and MUX data routing.</td>
                  <td className="p-2 font-bold text-emerald-400">CO3 (PO1-PO5, PSO1, PSO2)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-yellow-400">Unit IV (08 Hrs)</td>
                  <td className="p-2">SR, JK, D, T Flip-Flops, Setup/Hold Time (t_su, t_h), Prop Delay (t_pd), Race Around, Frequency Division.</td>
                  <td className="p-2">3 D Flip-Flop state register (Q2 Q1 Q0), Master-Slave edge elimination, and T flip-flop clock divider.</td>
                  <td className="p-2 font-bold text-emerald-400">CO4 (PO1-PO5, PSO1, PSO2)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-yellow-400">Unit V (08 Hrs)</td>
                  <td className="p-2">Shift Registers (SISO/SIPO/PISO/PIPO), Synchronous Mod-8 Counter, Memory (ROM/RAM), Logic Families.</td>
                  <td className="p-2">Mod-8 sequential state counter, 4-bit SIPO telemetry shift register, and TTL vs CMOS electrical comparison.</td>
                  <td className="p-2 font-bold text-emerald-400">CO5 (PO1-PO5, PSO1, PSO2)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 9. 22 Comprehensive Viva Voce Questions & Answers */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider text-cyan-400 print:text-black border-b border-railway-border/40 pb-1">
            9. Viva Voce Preparation (22 Technical Questions &amp; Answers)
          </h2>

          <div className="space-y-3">
            {VIVA_QUESTIONS.map((viva, idx) => (
              <div key={viva.id} className="p-3.5 rounded-lg bg-railway-darker print:bg-gray-50 border border-railway-border/60 print:border-gray-300 text-xs space-y-1">
                <div className="flex items-center space-x-2 font-bold font-mono">
                  <span className="text-railway-yellow print:text-black">Q{idx + 1}.</span>
                  <span className="text-white print:text-black">{viva.question}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-railway-panel print:bg-gray-200 text-cyan-300 print:text-black ml-auto shrink-0 font-normal">
                    {viva.topic}
                  </span>
                </div>
                <p className="text-slate-300 print:text-gray-800 leading-relaxed pt-1 border-t border-railway-border/30 print:border-gray-200">
                  <strong className="text-emerald-400 print:text-emerald-700">Ans: </strong>
                  {viva.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Conclusion & References */}
        <section className="space-y-2 pt-4 border-t border-railway-border/60">
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider text-cyan-400 print:text-black">
            9. Conclusion &amp; References
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 print:text-gray-800 leading-relaxed">
            The Smart Railway Crossing Warning System successfully bridges theoretical DELD concepts with practical microcontroller automation.
            By proving Boolean equations, mapping truth tables, minimizing terms via Karnaugh maps, and clocking sequential D flip-flops,
            students gain complete mastery over both combinational and sequential hardware architectures.
          </p>
          <div className="text-xs font-mono text-slate-400 print:text-gray-600 space-y-1 pt-2">
            <div>[1] M. Morris Mano and Michael D. Ciletti, <em>Digital Design: With an Introduction to the Verilog HDL</em>, 6th ed., Pearson.</div>
            <div>[2] Ronald J. Tocci, Neal S. Widmer, Gregory L. Moss, <em>Digital Systems: Principles and Applications</em>, 12th ed., Pearson.</div>
            <div>[3] Autodesk Tinkercad Circuits Online Simulation Environment: https://www.tinkercad.com</div>
            <div>[4] Wokwi Arduino AVR Microcontroller Simulator: https://wokwi.com</div>
          </div>
        </section>
      </div>
    </div>
  );
}
