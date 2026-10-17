# Smart Railway Crossing Warning Logic Controller

A functional web-based simulation and digital control system for an automated smart railway crossing warning gate.

Features real Boolean logic equations, a 7-state finite-state machine with 3-bit D flip-flop state registers, a 16-row truth table generator, pure Boolean algebraic reduction, an animated SVG railway crossing simulation, a multi-channel digital oscilloscope, an automated fault injection lab with 10 test suites, and virtual microcontroller hardware schematics.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have **Node.js** (v18+ recommended) installed on your system.

### 2. Installation & Running
Open a terminal in the project directory and run:

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
```

The application will be live at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

---

## 🛠️ Technology Stack

- **Frontend & UI/UX:** React 18, Vite, Tailwind CSS, Lucide React, Framer Motion.
- **Theme System:** Neutral Obsidian Dark Mode & Cream Zinc Light Mode.
- **Digital Logic Engine:** Deterministic logic functions for basic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR), Boolean expression evaluation, algebraic reduction, and clocked finite-state machines.
- **Microcontroller Firmware:** ATmega328P C++ firmware (`arduino/railway_crossing.ino`) with non-blocking timing, switch debouncing, and Wokwi configuration (`wokwi/diagram.json`).

---

## 🌟 Key Application Sections

1. **Overview Dashboard:** High-level status cards, real-time railway simulation preview, and architecture verification.
2. **Live Railway Simulation:** Animated SVG railway environment featuring steel rails, wooden sleepers, asphalt roadway, animated locomotive, crossbuck mast with dual alternating red LEDs, buzzer siren, and operator controls.
3. **Digital Logic Laboratory:** Interactive gate sandboxes (AND, OR, NOT, NAND, NOR, XOR, XNOR) and a complete 74-series discrete IC schematic (74HC04, 74HC08, 74HC32) with live signal wire tracing.
4. **Hardware Circuit Simulation:** Interactive virtual breadboard schematic and importable wiring guides for Tinkercad and Wokwi.
5. **Truth Table & Boolean Algebra:** All 16 minterms (m0 to m15) mapped with output filtering, search, live active-row highlight, and CSV export.
6. **Timing Diagram & Digital Waveforms:** Multi-channel real-time logic analyzer displaying clock, sensor edges, combinational outputs, gate position, and flip-flop register states.
7. **State Machine Explorer:** 7-state transition graph (IDLE, APPROACHING, CLOSING, OCCUPIED, CLEARING, OPENING, EMERGENCY) and 3-bit D flip-flop register excitation table (Q2 Q1 Q0 -> D2 D1 D0).
8. **Fault Injection & Automated Testing:** 10 test scenarios evaluating stuck sensors, sensor conflicts, and emergency recovery with real automated assertions.
