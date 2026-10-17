/**
 * 22 Viva Voce Questions & Model Answers for DELD & Embedded Systems Examination
 */

export const VIVA_QUESTIONS = [
  {
    id: 1,
    topic: "Combinational Logic",
    question: "Why is OR logic used for the warning request (W = A + B + D) instead of AND logic?",
    answer: "In safety-critical systems, a warning must trigger whenever ANY dangerous condition arises. An OR gate evaluates to HIGH (1) if the approach sensor (A) is triggered, OR if the crossing is occupied (B), OR if an emergency (D) is asserted. If AND logic were used, the warning would fail to sound until all three occurred simultaneously, causing catastrophic collisions."
  },
  {
    id: 2,
    topic: "Sequential vs Combinational",
    question: "Why is sequential logic necessary for this railway crossing controller instead of pure combinational gates?",
    answer: "A railway crossing has memory and historical progression: it must know whether a train is approaching, currently occupying the roadway, or departing. Combinational logic has no memory—it only evaluates instantaneous sensor values. Sequential logic utilizes memory elements (flip-flops) to store the present system state and execute structured, clock-governed transitions (IDLE ➔ APPROACHING ➔ CLOSING ➔ OCCUPIED ➔ CLEARING ➔ OPENING)."
  },
  {
    id: 3,
    topic: "Flip-Flops & Registers",
    question: "How does a D flip-flop store state, and what is its role in our 3-bit state register?",
    answer: "A D flip-flop stores 1 bit of binary information by sampling the input D on the active (rising) clock edge and holding it at output Q until the next clock edge: Q(next) = D. In our railway controller, 7 states are encoded as 3-bit binary numbers (000 to 110), requiring three D flip-flops (Q2, Q1, Q0) to form the central state register."
  },
  {
    id: 4,
    topic: "Fail-Safe Engineering",
    question: "Why can a timer alone NEVER be permitted to reopen a railway crossing barrier?",
    answer: "An open-loop timer assumes the train always clears the crossing within a fixed duration. However, in reality, a train may decelerate, brake to an emergency stop, or derail across the road. If the barrier reopened solely on timer expiration, it would raise into or invite road traffic into the path of an occupied train. Reopening requires physical, closed-loop sensor validation (Safe-to-Open condition O = 1)."
  },
  {
    id: 5,
    topic: "Boolean Algebra",
    question: "What does the 16-row truth table demonstrate about our 4-variable logic system?",
    answer: "The 16-row truth table exhaustively maps all 2^4 = 16 binary permutations of the four input sensors (A, B, C, D) to their resulting combinational outputs (W, G, O). It proves mathematical determinism: under exactly 14 conditions warning W is active, while the Safe-to-Open output O is strictly 1 in only ONE combination (m2: ABCD = 0010)."
  },
  {
    id: 6,
    topic: "Boolean Algebraic Reduction",
    question: "How is Boolean algebraic reduction performed to simplify the 14 truth table minterms of Warning W into A + B + D?",
    answer: "By applying the Distributive and Complement laws: terms differing by a single complemented literal factorize as X·Y + X·Y' = X·(Y + Y') = X·1 = X. Factoring all minterms where A=1 allows the remaining literals (B, C, D) to complement and cancel out, reducing to literal A. Repeating this for terms where B=1 and D=1, and applying the Idempotent law (X + X = X) to shared minterms, the 14 canonical minterms reduce directly to the minimal Sum of Products W = A + B + D."
  },
  {
    id: 7,
    topic: "Emergency Interlocks",
    question: "Why does the Emergency input (D) override all other controller states?",
    answer: "In railway signaling, human life safety overrides normal operational sequence. When an emergency line (D=1) or sensor fault is detected, the controller executes a fail-safe interlock: it immediately forces gate closure, maintains warning flashers and sirens, and disables normal reopening until a certified manual reset is acknowledged."
  },
  {
    id: 8,
    topic: "Implementation Architecture",
    question: "What is the key architectural difference between our Arduino controller and a discrete 74-series logic circuit?",
    answer: "The Arduino executes instructions sequentially in software using a microcontroller CPU core with C++ algorithms and non-blocking timers. A discrete 74-series logic circuit is implemented using physical silicon gate ICs (7408, 7432, 7404, 7474) operating in pure hardware parallelism with nanosecond propagation delays."
  },
  {
    id: 9,
    topic: "Simulation vs Hardware",
    question: "What are the practical differences between simulation (Tinkercad/Wokwi) and real physical railway hardware?",
    answer: "Simulators assume idealized voltage levels, zero environmental EMI, and instant clean sensor pulses. Real physical hardware must manage relay contact bounce, mechanical wear, inductive spikes from servo motors, thermal variations, optical fogging of IR sensors, and strict SIL-4 (Safety Integrity Level 4) fail-safe redundancy."
  },
  {
    id: 10,
    topic: "Fault Handling",
    question: "Why must sensor conflicts (such as A=1 and C=1 with B=0) be explicitly detected?",
    answer: "A single train cannot physically be entering the approach track (A=1) and simultaneously leaving the departure track (C=1) while the center track is completely empty (B=0). This indicates a hardware fault, cut cable, or optical obstruction. The controller detects this anomaly and holds the crossing closed rather than guessing."
  },
  {
    id: 11,
    topic: "Signal Levels",
    question: "How are digital HIGH and LOW signals represented in TTL and CMOS logic?",
    answer: "In standard 5V TTL logic, LOW is 0V to 0.8V (logical 0), and HIGH is 2.0V to 5.0V (logical 1), with 0.8V to 2.0V being an undefined floating region. In CMOS logic, LOW is typically 0V to 1.5V (under 30% Vcc) and HIGH is 3.5V to 5V (above 70% Vcc), offering superior noise margins."
  },
  {
    id: 12,
    topic: "Validation Logic",
    question: "How does the controller validate the train-clear condition before initiating gate opening?",
    answer: "It checks two conditions: First, combinational validity: O = C · A' · B' · D' must equal 1 (departure sensor active, approach and crossing idle, no emergency). Second, sequential persistence: the controller requires O=1 to remain stable for a 2-cycle safety hold time to ensure the train's trailing carriage has physically exited the roadway boundary."
  },
  {
    id: 13,
    topic: "De Morgan's Laws",
    question: "Demonstrate how De Morgan's Law links the Safe-to-Open equation with the Warning equation.",
    answer: "The warning equation is W = A + B + D. By De Morgan's theorem, W' = (A + B + D)' = A' · B' · D'. The Safe-to-Open equation is O = C · A' · B' · D'. Substituting W' yields: O = C · W'. This proves that safe opening is granted if and only if Departure Clear is TRUE (C=1) AND Warning is FALSE (W'=1)."
  },
  {
    id: 14,
    topic: "Active-Low vs Active-High",
    question: "What is an active-low signal, and why is it preferred for emergency stop push buttons?",
    answer: "An active-low signal asserts its active/triggered state at logic LOW (0V / GND) and rests at HIGH (5V / Vcc). It is standard for emergency circuits because if a wire breaks, becomes loose, or loses power, the circuit naturally drops to 0V (GND), automatically tripping the emergency fail-safe state."
  },
  {
    id: 15,
    topic: "Sensor Debouncing",
    question: "How is debouncing implemented in our Arduino sketch?",
    answer: "Mechanical push buttons generate contact chatter for 5 to 20ms. In the Arduino sketch, non-blocking millis() timing samples each pin. The state transition is only registered when the pin has held a stable reading for more than DEBOUNCE_DELAY_MS (typically 50ms), preventing false triggers."
  },
  {
    id: 16,
    topic: "Servo Motor Control",
    question: "How does the Arduino control the barrier servo motor position?",
    answer: "The Arduino uses the Servo library to generate Pulse Width Modulation (PWM) signals at 50Hz. A pulse width of ~1.0ms commands 0 degrees (barrier horizontal / closed), while ~2.0ms commands 90 degrees (barrier vertical / open). In our sketch, the angle is incremented gradually to prevent mechanical stress."
  },
  {
    id: 17,
    topic: "Non-blocking Timing",
    question: "Why must delay() be avoided in the Arduino firmware for a safety controller?",
    answer: "The delay() function halts the microcontroller CPU core, during which sensor inputs cannot be read, emergency buttons are ignored, and LEDs cannot flash. Instead, non-blocking time-checking with millis() allows the Arduino to continually poll sensors every few microseconds while running background flashers and state timers."
  },
  {
    id: 18,
    topic: "Latches vs Flip-Flops",
    question: "What is the difference between a level-triggered latch and an edge-triggered flip-flop?",
    answer: "A latch is level-sensitive: as long as the enable/clock input is HIGH, the output transparently follows the input. A flip-flop is edge-triggered: it samples inputs and updates its output only during the instantaneous rising (0-to-1) or falling (1-to-0) transition of the clock, eliminating race-around conditions."
  },
  {
    id: 19,
    topic: "IC Pinout Configuration",
    question: "Identify the power and ground pins on standard 14-pin 74-series TTL DIP ICs like 7408 and 7432.",
    answer: "In standard 14-pin dual in-line package (DIP) 74-series TTL logic chips, Pin 14 is connected to +5V (Vcc), and Pin 7 is connected to 0V (GND). Connecting these in reverse causes immediate thermal breakdown of the silicon substrate."
  },
  {
    id: 20,
    topic: "Current Limiting",
    question: "Why do we connect 220Ω or 330Ω resistors in series with the warning LEDs?",
    answer: "LEDs have low dynamic internal resistance when forward-biased (~2.0V forward voltage drop). Connecting a 5V logic output directly across an LED would draw excessive current (>100mA), burning out the LED and damaging the Arduino output pin (rated for max 20-40mA). A 220Ω resistor limits current to approximately (5V - 2V) / 220Ω ≈ 13.6mA."
  },
  {
    id: 21,
    topic: "State Encoding",
    question: "What are the trade-offs between Binary State Encoding and One-Hot State Encoding?",
    answer: "Binary encoding uses log2(N) flip-flops (3 flip-flops for 7 states), saving hardware flip-flops but requiring combinational decoding logic. One-Hot encoding uses 1 flip-flop per state (7 flip-flops for 7 states), which simplifies next-state combinational decoding gates and increases operating frequency, commonly favored in FPGAs."
  },
  {
    id: 22,
    topic: "Deterministic Simulation",
    question: "What does deterministic simulation mean in the context of this project?",
    answer: "It means the animation and displayed signals are strictly governed by the underlying mathematical logic engine and finite-state machine. The train graphic cannot move or open the barrier based on arbitrary CSS timers; its motion and gate status are direct visual reflections of evaluated Boolean variables and clocked state transitions."
  }
];
