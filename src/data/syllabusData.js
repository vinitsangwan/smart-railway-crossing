/**
 * University Engineering Syllabus (2025 Pattern)
 * Digital Electronics and Logic Design (DELD)
 * Department of Computer Engineering
 */

export const SYLLABUS_UNITS = [
  {
    unit: 'Unit I',
    title: 'Introduction to Digital Circuits, Number Systems & Codes',
    hours: '08 Hrs',
    coMapping: 'CO1',
    poMapping: 'PO1, PO2, PSO1',
    topics: [
      {
        name: 'Digital vs Analog Signals & Advantages',
        summary: 'Analog signals vary continuously over time. Digital signals operate at discrete voltage thresholds (Logic 0 & Logic 1), providing superior noise immunity, easy storage, error detection, and seamless programmable microcontroller integration in safety-critical railway systems.'
      },
      {
        name: 'Number Systems & Base Conversions',
        summary: 'Decimal (Base-10), Binary (Base-2), Octal (Base-8), and Hexadecimal (Base-16). Hexadecimal is extensively used in embedded railway telemetry for compact byte representations.'
      },
      {
        name: 'Binary Arithmetic (1\'s & 2\'s Complement)',
        summary: 'Subtraction performed via addition. In 2\'s complement, negative numbers are represented by inverting all bits and adding 1. Eliminates separate subtraction hardware in ALUs.'
      },
      {
        name: 'Binary Codes & Error Detection',
        summary: 'BCD (8421), Excess-3 (self-complementing code), Gray code (unit-distance code where only one bit changes per transition, preventing mechanical switch race conditions in railway track position encoders), ASCII, and Parity bit error detection.'
      },
      {
        name: 'Signed Number Representation',
        summary: 'Sign-magnitude, 1\'s complement, and 2\'s complement representations. In 8-bit 2\'s complement, numbers range from -128 to +127.'
      }
    ]
  },
  {
    unit: 'Unit II',
    title: 'Logic Gates, Universal Gates & Boolean Logic',
    hours: '08 Hrs',
    coMapping: 'CO2',
    poMapping: 'PO1, PO2, PO3, PSO1',
    topics: [
      {
        name: 'Standard Logic Gates & Truth Tables',
        summary: 'AND, OR, NOT, NAND, NOR, XOR, XNOR gates with truth tables, IEEE logic symbols, and Boolean operators.'
      },
      {
        name: 'Universal Gates (NAND & NOR)',
        summary: 'NAND and NOR gates are universal because any Boolean function (AND, OR, NOT, XOR) can be realized exclusively using only NAND or only NOR gates.'
      },
      {
        name: 'Boolean Algebra & De Morgan\'s Theorems',
        summary: 'Postulates: Commutative, Associative, Distributive, Identity, Annulment, Idempotent, and Complement laws. De Morgan: (A+B)\' = A\'·B\' and (A·B)\' = A\'+B\'. Proves railway interlock O = C·W\'.'
      },
      {
        name: 'Logic Levels & Digital IC Voltage Standards',
        summary: 'TTL logic levels (Vcc = 5V): V_IL_max = 0.8V, V_IH_min = 2.0V, with 0.8V to 2.0V as the forbidden floating zone. CMOS levels: LOW < 30% Vdd, HIGH > 70% Vdd with superior noise margin.'
      }
    ]
  },
  {
    unit: 'Unit III',
    title: 'Combinational Digital Circuits',
    hours: '08 Hrs',
    coMapping: 'CO3',
    poMapping: 'PO1, PO2, PO3, PO4, PO5, PSO1, PSO2',
    topics: [
      {
        name: 'Introduction to Combinational Logic',
        summary: 'Circuits whose outputs depend solely on the present combination of inputs with no memory feedback. Characterized by truth tables and direct logic equations.'
      },
      {
        name: 'Arithmetic Circuits (Adders & Subtractors)',
        summary: 'Half Adder (Sum = A ⊕ B, Carry = A·B), Full Adder (Sum = A ⊕ B ⊕ Cin, Cout = AB + Cin(A ⊕ B)), Half Subtractor (Diff = A ⊕ B, Borrow = A\'·B), Full Subtractor, and 4-bit Parallel Adder (7483).'
      },
      {
        name: 'Data Routing: Multiplexers & Demultiplexers',
        summary: 'Multiplexer (MUX): Many-to-one data selector (2:1, 4:1, 8:1) using select lines. Demultiplexer (DEMUX): One-to-many data distributor (1:4, 1:8). In railway systems, MUX selects active sensor channels for controller polling.'
      },
      {
        name: 'Encoders, Decoders & Priority Encoders',
        summary: 'Encoders convert 2^n lines to n binary lines. Priority Encoders (e.g. 74148) assign priority to inputs (Emergency line D has highest priority over approach sensors). Decoders (e.g. 3:8 decoder 74138) activate 1-of-N output lines.'
      },
      {
        name: 'Code Converters & Magnitude Comparators',
        summary: 'Binary-to-Gray and Gray-to-Binary converters using XOR gates. Magnitude Comparator (e.g. 7485) comparing two binary numbers A and B to assert A>B, A=B, or A<B for train speed limits.'
      }
    ]
  },
  {
    unit: 'Unit IV',
    title: 'Sequential Digital Circuits & Flip-Flops',
    hours: '08 Hrs',
    coMapping: 'CO4',
    poMapping: 'PO1, PO2, PO3, PO4, PO5, PSO1, PSO2',
    topics: [
      {
        name: 'Combinational vs Sequential Circuits',
        summary: 'Sequential circuits contain memory feedback elements (flip-flops/latches). Output depends on both current inputs and previous state history, synchronized by master clock pulses.'
      },
      {
        name: 'Latches & Flip-Flops (SR, JK, D, T)',
        summary: 'SR Latch (forbidden state S=R=1). D Flip-Flop (Q+ = D, ideal for state registers). JK Flip-Flop (Q+ = J·Q\' + K\'·Q, toggles when J=K=1). T Flip-Flop (Q+ = T ⊕ Q, frequency divider).'
      },
      {
        name: 'Timing Parameters & Race Around Condition',
        summary: 'Propagation delay (t_pd), Setup time (t_su - minimum time input must be stable before active clock edge), Hold time (t_h - minimum time input must stay stable after clock edge). Race around condition in level-triggered JK flip-flops eliminated via Master-Slave configuration or Edge-Triggering.'
      },
      {
        name: 'Applications: Frequency Division & State Registers',
        summary: 'Cascading T or JK flip-flops divides input clock frequency by 2^n. Three D flip-flops (Q2, Q1, Q0) form our 3-bit railway crossing controller state register.'
      }
    ]
  },
  {
    unit: 'Unit V',
    title: 'Registers, Counters & Digital IC Families',
    hours: '08 Hrs',
    coMapping: 'CO5',
    poMapping: 'PO1, PO2, PO3, PO4, PO5, PSO1, PSO2',
    topics: [
      {
        name: 'Shift Registers (SISO, SIPO, PISO, PIPO)',
        summary: 'Cascaded flip-flops for storing and moving binary data. SISO: Serial-In Serial-Out; SIPO: Serial-In Parallel-Out; PISO: Parallel-In Serial-Out; PIPO: Parallel-In Parallel-Out; Universal Shift Register (e.g. 74194).'
      },
      {
        name: 'Asynchronous (Ripple) & Synchronous Counters',
        summary: 'Asynchronous ripple counters: clock ripple propagates through cascaded flip-flops (slower, cumulative propagation delay). Synchronous counters: all flip-flops share a single simultaneous clock pulse. Up, down, and Mod-N counters (e.g. Mod-8 counter for 8 railway sequence states).'
      },
      {
        name: 'Semiconductor Memory Overview',
        summary: 'ROM (Read Only Memory: PROM, EPROM, EEPROM, Flash - holds permanent boot code and state lookup tables). RAM (Random Access Memory: SRAM using flip-flop bistable cells - high speed, no refresh; DRAM using MOS capacitor cells - high density, periodic refresh).'
      },
      {
        name: 'Digital Logic Families & Comparison',
        summary: 'TTL (Transistor-Transistor Logic, 74-series, bipolar junction transistors, 5V) vs CMOS (Complementary Metal Oxide Semiconductor, 4000/74HC-series, MOSFETs, 3V-15V). Comparison: CMOS offers near-zero static power dissipation and highest noise margin; TTL offers high drive current.'
      }
    ]
  }
];
