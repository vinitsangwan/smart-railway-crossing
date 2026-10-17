/**
 * DELD Educational Quiz Questions
 * 20 Multiple Choice Questions explicitly mapped across Units I to V
 * of the Second Year Engineering Syllabus (2025 Pattern)
 */

export const QUIZ_QUESTIONS = [
  // --- UNIT I: Number Systems, Binary Codes, Complements ---
  {
    id: 1,
    unit: 'Unit I',
    question: "What is the 2's complement representation of -18 in an 8-bit signed binary format?",
    options: [
      "11101110",
      "10010010",
      "11101101",
      "00010010"
    ],
    correctAnswer: 0,
    explanation: "+18 in 8-bit is 00010010. 1's complement = 11101101. Adding 1 gives 2's complement: 11101110."
  },
  {
    id: 2,
    unit: 'Unit I',
    question: "Why is Gray code preferred over standard binary code in railway track position encoders and shaft angle sensors?",
    options: [
      "It can be decoded directly by 7-segment displays without decoders",
      "Only one bit changes between successive adjacent numbers, preventing false intermediate race states",
      "It requires fewer flip-flops in shift registers",
      "It allows arithmetic addition without using full adders"
    ],
    correctAnswer: 1,
    explanation: "Gray code is a unit-distance code: adjacent states differ by exactly 1 bit. In optical or mechanical track encoders, this eliminates false intermediate readings caused by slight timing differences among mechanical contacts."
  },
  {
    id: 3,
    unit: 'Unit I',
    question: "What is the Excess-3 (XS-3) code for the decimal number 5?",
    options: [
      "0101",
      "1000",
      "0011",
      "1001"
    ],
    correctAnswer: 1,
    explanation: "Excess-3 is obtained by adding 3 (0011 in binary) to the BCD representation of the digit: 5 + 3 = 8 -> 1000."
  },
  {
    id: 4,
    unit: 'Unit I',
    question: "Which of the following describes an advantage of digital circuits over analog circuits?",
    options: [
      "Higher immunity to environmental electromagnetic noise and easier storage in digital memory",
      "Zero propagation delay in silicon substrates",
      "Infinite resolution across continuous voltage levels",
      "Lower component count for simple audio amplifiers"
    ],
    correctAnswer: 0,
    explanation: "Digital signals operate between discrete voltage thresholds (0 and 1), providing superior noise margin, signal regeneration, error detection, and programmable logic integration."
  },

  // --- UNIT II: Logic Gates, Universal Gates & Boolean Logic ---
  {
    id: 5,
    unit: 'Unit II',
    question: "Why are NAND and NOR gates called Universal Logic Gates?",
    options: [
      "Because they operate at both 5V TTL and 15V CMOS supply voltages",
      "Because any basic logic function (AND, OR, NOT, XOR) can be realized exclusively using only NAND or only NOR gates",
      "Because they consume zero power during transitions",
      "Because they do not require pull-up resistors in open-collector outputs"
    ],
    correctAnswer: 1,
    explanation: "A functional complete set of gates can construct any arbitrary combinational Boolean function. Both NAND-only and NOR-only logic satisfy functional completeness."
  },
  {
    id: 6,
    unit: 'Unit II',
    question: "In standard 5V TTL digital logic (e.g., 74-series ICs), what does an input voltage of 1.4V represent?",
    options: [
      "Definite Logic 0 (LOW)",
      "Definite Logic 1 (HIGH)",
      "Invalid / Forbidden indeterminate floating region",
      "Negative logic ground"
    ],
    correctAnswer: 2,
    explanation: "In 5V TTL, V_IL(max) is 0.8V and V_IH(min) is 2.0V. The interval between 0.8V and 2.0V is an undefined/forbidden transition region where gate behavior is unpredictable."
  },
  {
    id: 7,
    unit: 'Unit II',
    question: "According to the Boolean Absorption Law, what does the expression A + (A · B) simplify to?",
    options: [
      "A",
      "B",
      "A + B",
      "A · B"
    ],
    correctAnswer: 0,
    explanation: "Absorption Law: A + A·B = A·(1 + B) = A·(1) = A. The product term A·B is completely absorbed by literal A."
  },
  {
    id: 8,
    unit: 'Unit II',
    question: "According to De Morgan's First Law, what is the complement of the railway warning equation (A + B + D)'?",
    options: [
      "A' + B' + D'",
      "A' · B' · D'",
      "(A · B · D)'",
      "A + B' + D"
    ],
    correctAnswer: 1,
    explanation: "De Morgan's theorem states: (X + Y + Z)' = X' · Y' · Z'. This proves our safe-to-open interlock O = C · A' · B' · D' = C · W'."
  },

  // --- UNIT III: Combinational Digital Circuits ---
  {
    id: 9,
    unit: 'Unit III',
    question: "What are the Boolean output equations for a Half Adder with inputs A and B?",
    options: [
      "Sum = A + B, Carry = A · B",
      "Sum = A ⊕ B, Carry = A · B",
      "Sum = A · B, Carry = A ⊕ B",
      "Sum = A ⊕ B, Carry = A + B"
    ],
    correctAnswer: 1,
    explanation: "A Half Adder computes arithmetic sum and carry: Sum = A ⊕ B (XOR gate), Carry = A · B (AND gate)."
  },
  {
    id: 10,
    unit: 'Unit III',
    question: "In a 4:1 Multiplexer (MUX) with inputs D0, D1, D2, D3, which input is routed to output Y when select lines S1=1 and S0=0?",
    options: [
      "D0",
      "D1",
      "D2",
      "D3"
    ],
    correctAnswer: 2,
    explanation: "The select binary value S1S0 = 10 (decimal 2) routes input channel D2 to output Y."
  },
  {
    id: 11,
    unit: 'Unit III',
    question: "What is the key functional feature of a Priority Encoder compared to a standard binary encoder?",
    options: [
      "It operates without a DC power supply",
      "If multiple inputs are active simultaneously, the output code reflects only the input with the highest designated priority",
      "It inverts all outputs to active-low TTL levels",
      "It stores the last active input indefinitely"
    ],
    correctAnswer: 1,
    explanation: "In safety systems, priority encoders ensure critical inputs (like an Emergency Stop D) take precedence over routine sensor inputs (like Approach A)."
  },
  {
    id: 12,
    unit: 'Unit III',
    question: "Which digital combinational circuit is used to compare whether Train Speed (Word A) exceeds the Speed Limit (Word B)?",
    options: [
      "Full Subtractor",
      "Magnitude Comparator (e.g., 7485)",
      "Priority Multiplexer",
      "Demultiplexer"
    ],
    correctAnswer: 1,
    explanation: "A Magnitude Comparator compares two n-bit binary words A and B and produces three mutually exclusive outputs: A > B, A = B, and A < B."
  },

  // --- UNIT IV: Sequential Digital Circuits & Flip-Flops ---
  {
    id: 13,
    unit: 'Unit IV',
    question: "What is the characteristic equation of a Toggle (T) Flip-Flop?",
    options: [
      "Q(t+1) = T",
      "Q(t+1) = T ⊕ Q(t)",
      "Q(t+1) = T · Q(t)",
      "Q(t+1) = T + Q'(t)"
    ],
    correctAnswer: 1,
    explanation: "The characteristic equation of a T flip-flop is Q(t+1) = T ⊕ Q. When T=0, it holds state (Q); when T=1, it toggles (Q')."
  },
  {
    id: 14,
    unit: 'Unit IV',
    question: "How is the Race Around Condition eliminated in JK flip-flops?",
    options: [
      "By replacing silicon transistors with germanium diodes",
      "By using Master-Slave flip-flop configuration or Edge-Triggering",
      "By removing the feedback connection between Q and K",
      "By connecting a pull-down resistor to the clock input"
    ],
    correctAnswer: 1,
    explanation: "Race around occurs when J=K=1 and clock pulse width exceeds flip-flop propagation delay. Edge-triggering or Master-Slave dual-stage clocking resolves this completely."
  },
  {
    id: 15,
    unit: 'Unit IV',
    question: "What does Setup Time (t_su) specify in synchronous digital sequential circuits?",
    options: [
      "The time taken by the power supply to reach 5.0V after boot",
      "The minimum time the data input must remain stable BEFORE the active clock edge occurs",
      "The time taken by output Q to settle AFTER the clock edge",
      "The interval between two consecutive clock cycles"
    ],
    correctAnswer: 1,
    explanation: "Setup time is the minimum duration the data line must be held stable prior to the triggering clock transition to prevent internal metastability."
  },
  {
    id: 16,
    unit: 'Unit IV',
    question: "If a 10 kHz clock signal is applied to the clock input of a T flip-flop with T=1, what is the output frequency at pin Q?",
    options: [
      "20 kHz",
      "10 kHz",
      "5 kHz",
      "2.5 kHz"
    ],
    correctAnswer: 2,
    explanation: "A T flip-flop with T=1 toggles on every active clock edge, completing 1 full cycle for every 2 input clock cycles (Frequency division by 2: 10 kHz / 2 = 5 kHz)."
  },

  // --- UNIT V: Registers, Counters & Digital IC Families ---
  {
    id: 17,
    unit: 'Unit V',
    question: "Which type of shift register accepts data one bit at a time and presents all stored bits simultaneously on parallel output pins?",
    options: [
      "SISO (Serial-In Serial-Out)",
      "SIPO (Serial-In Parallel-Out)",
      "PISO (Parallel-In Serial-Out)",
      "PIPO (Parallel-In Parallel-Out)"
    ],
    correctAnswer: 1,
    explanation: "SIPO registers (e.g. 74164 or 74595) convert serial bit streams into parallel binary bytes."
  },
  {
    id: 18,
    unit: 'Unit V',
    question: "What is the primary architectural difference between an Asynchronous (Ripple) Counter and a Synchronous Counter?",
    options: [
      "Asynchronous counters use vacuum tubes; synchronous counters use transistors",
      "In asynchronous counters, flip-flops are clocked sequentially by preceding outputs (causing ripple delay), whereas in synchronous counters all flip-flops receive a common simultaneous clock pulse",
      "Synchronous counters cannot count down",
      "Asynchronous counters require software debouncing"
    ],
    correctAnswer: 1,
    explanation: "In synchronous counters, all flip-flops trigger simultaneously on the common clock edge, avoiding cumulative propagation ripple delay and allowing much higher operating speeds."
  },
  {
    id: 19,
    unit: 'Unit V',
    question: "Why does CMOS logic consume far less static power than TTL logic?",
    options: [
      "Because CMOS circuits use copper instead of silicon",
      "Because in any CMOS steady state, one of the complementary transistors (P-MOS or N-MOS) is always OFF, preventing direct current path from Vdd to GND",
      "Because CMOS operates at sub-zero temperatures",
      "Because CMOS gates do not use clock pulses"
    ],
    correctAnswer: 1,
    explanation: "In CMOS gates, P-channel and N-channel MOSFETs are connected in complementary pairs. In either steady logic state (HIGH or LOW), one transistor is completely OFF, resulting in near-zero quiescent DC leakage current."
  },
  {
    id: 20,
    unit: 'Unit V',
    question: "Which type of semiconductor memory uses a 6-transistor cross-coupled bistable flip-flop per bit and does NOT require periodic refresh cycles?",
    options: [
      "Dynamic RAM (DRAM)",
      "Static RAM (SRAM)",
      "Mask ROM",
      "EPROM"
    ],
    correctAnswer: 1,
    explanation: "SRAM stores each bit in a bistable flip-flop latch. It retains data as long as power is applied without needing periodic refresh, making it faster than DRAM."
  }
];
