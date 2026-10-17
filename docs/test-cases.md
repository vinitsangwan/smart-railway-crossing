# TEST CASES & AUTOMATED VALIDATION SUITE

## Smart Railway Crossing Warning System

This document outlines the 10 formal test scenarios implemented in the automated test runner (`src/logic/testRunner.js`) and accessible on the dashboard under **Fault Injection & Testing**.

| Test ID | Scenario Name | Category | Injected Signal Sequence | Expected State Transitions | Expected Outputs |
|---|---|---|---|---|---|
| **TEST_01** | Normal Train Approach & Passage | Nominal Operations | A=1 ➔ B=1 ➔ C=1 ➔ C=0 | IDLE ➔ APPROACHING ➔ CLOSING ➔ OCCUPIED ➔ CLEARING ➔ OPENING ➔ IDLE | W=1, G=1, then O=1, then Safe |
| **TEST_02** | Slow Train Approach | Timing & Delay | A=1 sustained over multiple ticks | APPROACHING held for 3 ticks ➔ CLOSING | W=1, G=1 held safely |
| **TEST_03** | Extended Crossing Occupancy | Safety Interlock | B=1 maintained continuously | Held in CROSSING_OCCUPIED | Gate locked CLOSED (0°), W=1 |
| **TEST_04** | Emergency Activation | Emergency Handling | D=1 asserted asynchronously | Immediate jump to EMERGENCY | W=1, G=1, O=0, Gate forced CLOSED |
| **TEST_05** | Train-Clear Sensor Stuck Inactive | Fault Injection | B clears (0), but C remains 0 | Stays in CROSSING_OCCUPIED; refuses CLEARING | O=0, Gate remains locked down |
| **TEST_06** | Conflicting Sensor Inputs | Sensor Validation | A=1 and C=1 active simultaneously with B=0 | Critical sensor conflict flagged | System declares fault; restricts opening |
| **TEST_07** | Sensor Signal Stuck Active | Sensor Validation | A=1 jammed HIGH during clearing | Safe-to-Open evaluates O=0 due to A'=0 | Reopening inhibited |
| **TEST_08** | Repeated Approach Detection | Real-World Edge Case | A=1 tripped while previous train in CLEARING | Abort opening ➔ re-lock CLOSING | W=1, G=1 asserted immediately |
| **TEST_09** | Reset During Active Crossing | Fault Recovery | System reset while B=1 | Direct evaluate ➔ CLOSING/OCCUPIED | Barrier secured against road traffic |
| **TEST_10** | Recovery After Fault Resolution | Fault Recovery | D=0 released followed by authorized reset | EMERGENCY ➔ OPENING ➔ IDLE | Safe operation restored |
