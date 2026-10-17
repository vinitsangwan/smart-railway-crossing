/**
 * DIGITAL ELECTRONICS & LOGIC DESIGN (DELD)
 * Core Boolean Logic Engine & Signal Processing Functions
 */

// Fundamental Gate Functions
export const AND = (...inputs) => inputs.reduce((acc, val) => acc && (val ? 1 : 0), 1);
export const OR = (...inputs) => inputs.reduce((acc, val) => acc || (val ? 1 : 0), 0);
export const NOT = (a) => (a ? 0 : 1);
export const NAND = (...inputs) => NOT(AND(...inputs));
export const NOR = (...inputs) => NOT(OR(...inputs));
export const XOR = (a, b) => ((a ? 1 : 0) ^ (b ? 1 : 0)) ? 1 : 0;
export const XNOR = (a, b) => NOT(XOR(a, b));

/**
 * Standard Project Teaching Expressions:
 * W = A + B + D (Warning request: Approach OR Occupied OR Emergency)
 * G = A + B + D (Gate-close request: Approach OR Occupied OR Emergency)
 * O = C · A' · B' · D' (Safe-to-open request: Clear AND NOT Approach AND NOT Occupied AND NOT Emergency)
 */

export function evaluateExpressions(A, B, C, D) {
  const a = A ? 1 : 0;
  const b = B ? 1 : 0;
  const c = C ? 1 : 0;
  const d = D ? 1 : 0;

  // Intermediate Terms
  const notA = NOT(a);
  const notB = NOT(b);
  const notD = NOT(d);

  // Combinational Outputs
  const W = OR(a, b, d);
  const G = OR(a, b, d);
  const O = AND(c, notA, notB, notD);

  return {
    inputs: { A: a, B: b, C: c, D: d },
    intermediates: { notA, notB, notD },
    outputs: {
      W,
      G,
      O
    },
    equations: {
      W: 'W = A + B + D',
      G: 'G = A + B + D',
      O: "O = C · A' · B' · D'"
    },
    humanReadable: {
      W: `Warning is ACTIVE (${W}) because ${[a && 'Train Approaching (A)', b && 'Crossing Occupied (B)', d && 'Emergency Signal (D)'].filter(Boolean).join(' OR ') || 'No warning condition active'}`,
      G: `Gate Close is COMMANDED (${G}) because ${[a && 'Train Approaching (A)', b && 'Crossing Occupied (B)', d && 'Emergency Signal (D)'].filter(Boolean).join(' OR ') || 'Normal clear condition'}`,
      O: `Safe to Open is ${O ? 'GRANTED (1)' : 'DENIED (0)'}: Requires Clear=1 (${c}), Approach=0 (A'=${notA}), Occupied=0 (B'=${notB}), Emergency=0 (D'=${notD})`
    }
  };
}

/**
 * Sensor Validation and Fault / Conflict Analysis
 * In physical railway systems, redundant sensors cannot be in impossible states.
 */
export function validateSensors(A, B, C, D) {
  const a = Boolean(A);
  const b = Boolean(B);
  const c = Boolean(C);
  const d = Boolean(D);

  const errors = [];
  const warnings = [];

  // Critical Emergency
  if (d) {
    errors.push({
      code: 'FAULT_EMERGENCY',
      title: 'Emergency Signal Asserted',
      description: 'Emergency stop or circuit fault line D=1. System forced to fail-safe closed state.',
      severity: 'critical'
    });
  }

  // Sensor conflict: Train cannot be simultaneously Approaching (A) and Cleared (C) without Occupancy (B)
  if (a && c && !b) {
    errors.push({
      code: 'CONFLICT_A_AND_C',
      title: 'Sensor Conflict: A=1 and C=1 while B=0',
      description: 'Simultaneous entry and exit triggers detected with clear center sensor. Indicates optical/inductive sensor malfunction.',
      severity: 'high'
    });
  }

  // Warning: Both A and B are active (valid during transition, but flagged if prolonged)
  if (a && b) {
    warnings.push({
      code: 'TRANSITION_A_B',
      title: 'Zone Overlap (A=1, B=1)',
      description: 'Train front is at crossing while approach detector is still active. Normal for long trainsets.',
      severity: 'info'
    });
  }

  // Warning: Both B and C are active
  if (b && c) {
    warnings.push({
      code: 'TRANSITION_B_C',
      title: 'Exit Zone Overlap (B=1, C=1)',
      description: 'Train rear is clearing crossing while front has tripped departure sensor.',
      severity: 'info'
    });
  }

  return {
    isValid: errors.length === 0,
    hasCriticalFault: errors.some(e => e.severity === 'critical' || e.severity === 'high'),
    errors,
    warnings
  };
}
