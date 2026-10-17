/**
 * 10 Formal Test Scenarios and Automated Assertion Suites
 */

export const TEST_SCENARIOS = [
  {
    id: 'TEST_01',
    name: 'Normal Train Approach and Passage',
    category: 'Nominal Operations',
    description: 'Verifies sequential transition IDLE ➔ APPROACHING ➔ CLOSING ➔ CROSSING_OCCUPIED ➔ CLEARING ➔ OPENING ➔ IDLE.',
    initialConditions: { state: 'IDLE', A: 0, B: 0, C: 0, D: 0, gate: 'OPEN' },
    steps: [
      { step: 1, inputs: { A: 1, B: 0, C: 0, D: 0 }, expectedState: 'APPROACHING', expectedW: 1, expectedG: 1, note: 'Train trips approach sensor A' },
      { step: 2, inputs: { A: 1, B: 0, C: 0, D: 0 }, expectedState: 'APPROACHING', expectedW: 1, expectedG: 1, note: 'Advance flasher countdown' },
      { step: 3, inputs: { A: 1, B: 0, C: 0, D: 0 }, expectedState: 'APPROACHING', expectedW: 1, expectedG: 1, note: 'Countdown tick 3' },
      { step: 4, inputs: { A: 0, B: 1, C: 0, D: 0 }, expectedState: 'CLOSING', expectedW: 1, expectedG: 1, note: 'Barrier closing command' },
      { step: 5, inputs: { A: 0, B: 1, C: 0, D: 0 }, expectedState: 'CROSSING_OCCUPIED', expectedW: 1, expectedG: 1, note: 'Train occupies crossing' },
      { step: 6, inputs: { A: 0, B: 0, C: 1, D: 0 }, expectedState: 'CLEARING', expectedO: 1, note: 'Train trips clear sensor C' },
      { step: 7, inputs: { A: 0, B: 0, C: 1, D: 0 }, expectedState: 'CLEARING', expectedO: 1, note: 'Safe buffer validation' },
      { step: 8, inputs: { A: 0, B: 0, C: 1, D: 0 }, expectedState: 'OPENING', expectedW: 0, note: 'Gate opening sequence starts' }
    ]
  },
  {
    id: 'TEST_02',
    name: 'Slow Train Approach',
    category: 'Timing & Delay',
    description: 'Ensures the advance warning interval holds warning signals active and does not prematurely open the gate if train travels slowly.',
    initialConditions: { state: 'IDLE', A: 0, B: 0, C: 0, D: 0, gate: 'OPEN' },
    steps: [
      { step: 1, inputs: { A: 1, B: 0, C: 0, D: 0 }, expectedState: 'APPROACHING', expectedW: 1 },
      { step: 2, inputs: { A: 1, B: 0, C: 0, D: 0 }, expectedState: 'APPROACHING', expectedW: 1 },
      { step: 3, inputs: { A: 1, B: 0, C: 0, D: 0 }, expectedState: 'APPROACHING', expectedW: 1 },
      { step: 4, inputs: { A: 1, B: 0, C: 0, D: 0 }, expectedState: 'CLOSING', expectedG: 1 },
      { step: 5, inputs: { A: 0, B: 0, C: 0, D: 0 }, expectedState: 'CLOSING', expectedG: 1, note: 'Sensor A cleared but train slow to hit B' }
    ]
  },
  {
    id: 'TEST_03',
    name: 'Extended Crossing Occupancy',
    category: 'Safety Interlocks',
    description: 'Tests that a stopped or slow freight train keeping B=1 prevents gate reopening regardless of any elapsed time.',
    initialConditions: { state: 'CROSSING_OCCUPIED', A: 0, B: 1, C: 0, D: 0, gate: 'CLOSED' },
    steps: [
      { step: 1, inputs: { A: 0, B: 1, C: 0, D: 0 }, expectedState: 'CROSSING_OCCUPIED', expectedGate: 'CLOSED', expectedW: 1 },
      { step: 2, inputs: { A: 0, B: 1, C: 0, D: 0 }, expectedState: 'CROSSING_OCCUPIED', expectedGate: 'CLOSED', expectedW: 1 },
      { step: 3, inputs: { A: 0, B: 1, C: 0, D: 0 }, expectedState: 'CROSSING_OCCUPIED', expectedGate: 'CLOSED', expectedW: 1 },
      { step: 4, inputs: { A: 0, B: 1, C: 0, D: 0 }, expectedState: 'CROSSING_OCCUPIED', expectedGate: 'CLOSED', expectedW: 1 }
    ]
  },
  {
    id: 'TEST_04',
    name: 'Emergency Activation (D=1)',
    category: 'Emergency Handling',
    description: 'Verifies instantaneous override into EMERGENCY state, assertion of warnings (W=1, G=1), and immediate barrier lock down.',
    initialConditions: { state: 'IDLE', A: 0, B: 0, C: 0, D: 0, gate: 'OPEN' },
    steps: [
      { step: 1, inputs: { A: 0, B: 0, C: 0, D: 1 }, expectedState: 'EMERGENCY', expectedW: 1, expectedG: 1, expectedO: 0, note: 'Emergency line D asserted' },
      { step: 2, inputs: { A: 1, B: 1, C: 1, D: 1 }, expectedState: 'EMERGENCY', expectedW: 1, expectedG: 1, expectedO: 0, note: 'Other sensor changes ignored' }
    ]
  },
  {
    id: 'TEST_05',
    name: 'Train-Clear Sensor Stuck Inactive (C=0 Failure)',
    category: 'Fault Injection',
    description: 'If sensor C fails to detect train exit, controller must never assert O=1 or return to IDLE, keeping road traffic safe.',
    initialConditions: { state: 'CROSSING_OCCUPIED', A: 0, B: 1, C: 0, D: 0, gate: 'CLOSED' },
    steps: [
      { step: 1, inputs: { A: 0, B: 0, C: 0, D: 0 }, expectedState: 'CROSSING_OCCUPIED', expectedO: 0, note: 'Train clears B, but C fails to assert' },
      { step: 2, inputs: { A: 0, B: 0, C: 0, D: 0 }, expectedState: 'CROSSING_OCCUPIED', expectedO: 0, note: 'Controller refuses to transition to CLEARING' }
    ]
  },
  {
    id: 'TEST_06',
    name: 'Conflicting Sensor Inputs (A=1 and C=1 with B=0)',
    category: 'Fault Injection',
    description: 'Simultaneous entry and departure signals with clear center track indicates optical sensor failure or wire break.',
    initialConditions: { state: 'IDLE', A: 0, B: 0, C: 0, D: 0, gate: 'OPEN' },
    steps: [
      { step: 1, inputs: { A: 1, B: 0, C: 1, D: 0 }, expectSensorConflict: true, note: 'Both A and C asserted simultaneously' }
    ]
  },
  {
    id: 'TEST_07',
    name: 'Sensor Signal Stuck Active (A=1 Jammed)',
    category: 'Fault Injection',
    description: 'Verifies that if approach sensor A remains stuck HIGH, safe-to-open equation O = C · A\' · B\' · D\' evaluates to 0, preventing gate opening.',
    initialConditions: { state: 'CLEARING', A: 1, B: 0, C: 1, D: 0, gate: 'CLOSED' },
    steps: [
      { step: 1, inputs: { A: 1, B: 0, C: 1, D: 0 }, expectedO: 0, expectedGate: 'CLOSED', note: "A=1 makes A'=0, driving O=0" }
    ]
  },
  {
    id: 'TEST_08',
    name: 'Repeated Approach Detection (Second Train Approaching)',
    category: 'Real-world Edge Cases',
    description: 'If a second train triggers A=1 while first train is in CLEARING or OPENING phase, system must abort opening and re-lock immediately.',
    initialConditions: { state: 'CLEARING', A: 0, B: 0, C: 1, D: 0, gate: 'CLOSED' },
    steps: [
      { step: 1, inputs: { A: 1, B: 0, C: 1, D: 0 }, expectedW: 1, expectedG: 1, note: 'New approach detected: W and G assert' }
    ]
  },
  {
    id: 'TEST_09',
    name: 'Reset During Active Crossing',
    category: 'Fault Recovery',
    description: 'Verifies that manual controller reset when track is occupied safely evaluates sensor B and commands barrier closed rather than opening.',
    initialConditions: { state: 'CROSSING_OCCUPIED', A: 0, B: 1, C: 0, D: 0, gate: 'CLOSED' },
    steps: [
      { step: 1, inputs: { A: 0, B: 1, C: 0, D: 0, reset: true }, expectedW: 1, expectedG: 1, note: 'Reset with B=1 maintains warning and closure' }
    ]
  },
  {
    id: 'TEST_10',
    name: 'Recovery After Fault Resolution',
    category: 'Fault Recovery',
    description: 'Tests return to service: Emergency D line released (0), clear track verified, explicit operator recovery sequence performed.',
    initialConditions: { state: 'EMERGENCY', A: 0, B: 0, C: 0, D: 1, gate: 'CLOSED' },
    steps: [
      { step: 1, inputs: { A: 0, B: 0, C: 0, D: 0 }, expectedState: 'EMERGENCY', note: 'Emergency released, system remains locked' },
      { step: 2, inputs: { A: 0, B: 0, C: 0, D: 0, clearFault: true }, expectedState: 'OPENING', expectedSafeToOpen: true, note: 'Authorized recovery acknowledged' }
    ]
  }
];
