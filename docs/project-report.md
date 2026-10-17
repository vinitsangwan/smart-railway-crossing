# COMPLETE ACADEMIC PROJECT REPORT

## SMART RAILWAY CROSSING WARNING SYSTEM USING DIGITAL LOGIC AND ARDUINO SIMULATION
**Course:** Digital Electronics & Logic Design (DELD)  
**Deliverable:** Software-Only College Mini-Project  

---

### Table of Contents
1. Project Title & Overview
2. Abstract
3. Problem Statement & Need
4. Aim & Objectives
5. Scope of Work
6. Proposed DELD Solution
7. System Architecture & Block Diagram
8. Hardware Components & Software Tools
9. Pin Mapping Specification
10. Circuit Diagrams (Arduino & 74-Series TTL)
11. Boolean Equations & Algebraic Derivations
12. 16-Row Truth Table (Minterms m0 to m15)
13. Boolean Algebraic Minimization & Proofs
14. Logic-Gate Design & De Morgan Equivalence
15. Sequential Circuit Design & D Flip-Flops
16. Finite-State Machine (FSM) State Transition Diagram
17. Arduino C++ Algorithm & Non-Blocking Design
18. Interactive Website Implementation
19. Automated Fault Injection & Test Results
20. Advantages
21. Limitations
22. Future Scope
23. Conclusion
24. Viva Voce Questions and Model Answers (22 Q&As)
25. References & Simulator Links

---

### 1. Abstract
Railway crossing safety is paramount in modern transportation networks. This project implements a fully interactive, software-only simulation of a Smart Railway Crossing Warning System. The project illustrates core Digital Electronics and Logic Design (DELD) principles including Boolean function formulation, 16-row truth tables, pure Boolean algebraic reduction, and sequential finite-state machines utilizing 3-bit D flip-flop state registers. The digital controller is accompanied by a virtual Arduino Uno circuit running non-blocking, debounced C++ firmware suitable for direct execution in Autodesk Tinkercad Circuits or Wokwi.

### 2. Core Boolean Logic
- **Warning Request:** `W = A + B + D`
- **Gate Close Command:** `G = A + B + D`
- **Safe to Open Interlock:** `O = C · A' · B' · D'`
- **De Morgan Equivalence:** `W' = (A + B + D)' = A' · B' · D'`, hence `O = C · W'`.

### 3. Sequential Controller States
- `IDLE (000)`: Track clear, barrier vertical (90°), signals off.
- `APPROACHING (001)`: Advance warning flashers and buzzer sound for 3 clock cycles.
- `CLOSING (010)`: Servo lowers barrier arm down to horizontal (0°).
- `CROSSING_OCCUPIED (011)`: Train occupies road intersection; barrier locked.
- `CLEARING (100)`: Departure sensor confirmed; validating Safe-to-Open equation with safety buffer.
- `OPENING (101)`: Barrier smoothly raises back to 90°.
- `EMERGENCY (110)`: Immediate fail-safe lockout to closed state.
