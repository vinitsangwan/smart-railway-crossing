/**
 * Clock-Controlled Finite-State Machine (FSM)
 * Sequential Logic Controller with 3-bit D Flip-Flop State Register Encoding
 */

export const STATES = {
  IDLE: 'IDLE',
  APPROACHING: 'APPROACHING',
  CLOSING: 'CLOSING',
  CROSSING_OCCUPIED: 'CROSSING_OCCUPIED',
  CLEARING: 'CLEARING',
  OPENING: 'OPENING',
  EMERGENCY: 'EMERGENCY'
};

// 3-bit binary encoding for hardware D Flip-Flop representation (Q2 Q1 Q0)
export const STATE_ENCODING = {
  IDLE: { code: '000', Q2: 0, Q1: 0, Q0: 0, decimal: 0 },
  APPROACHING: { code: '001', Q2: 0, Q1: 0, Q0: 1, decimal: 1 },
  CLOSING: { code: '010', Q2: 0, Q1: 1, Q0: 0, decimal: 2 },
  CROSSING_OCCUPIED: { code: '011', Q2: 0, Q1: 1, Q0: 1, decimal: 3 },
  CLEARING: { code: '100', Q2: 1, Q1: 0, Q0: 0, decimal: 4 },
  OPENING: { code: '101', Q2: 1, Q1: 0, Q0: 1, decimal: 5 },
  EMERGENCY: { code: '110', Q2: 1, Q1: 1, Q0: 0, decimal: 6 }
};

export const INITIAL_FSM_STATE = {
  currentState: STATES.IDLE,
  previousState: null,
  clockCycle: 0,
  warningCounter: 0,      // Timer counter for approach advance warning
  gatePosition: 'OPEN',   // 'OPEN', 'CLOSING', 'CLOSED', 'OPENING'
  gateAngle: 90,          // 90 deg = open, 0 deg = closed
  warningLights: false,
  warningFlashPhase: 0,   // Alternates 0 and 1 between red LED 1 and LED 2
  buzzer: false,
  gateCloseCommand: false,
  safeToOpenCommand: false,
  faultDetected: false,
  faultReason: null,
  recoveryPending: false
};

/**
 * Computes Next State and Hardware Flip-Flop Next-State Inputs (D2, D1, D0)
 * Evaluates combinational logic fed into D-type flip-flop inputs at rising clock edge.
 */
export function computeNextState(state, inputs) {
  const { A, B, C, D } = inputs;
  const current = state.currentState;
  let next = current;
  let newWarningCounter = state.warningCounter;
  let newGatePosition = state.gatePosition;
  let newGateAngle = state.gateAngle;
  let newWarningLights = false;
  let newBuzzer = false;
  let newGateCloseCmd = false;
  let newSafeToOpenCmd = false;
  let transitionReason = '';

  // 1. High-Priority Asynchronous/Synchronous Emergency Interlock
  if (D === 1) {
    next = STATES.EMERGENCY;
    newWarningLights = true;
    newBuzzer = true;
    newGateCloseCmd = true;
    newGatePosition = state.gateAngle > 0 ? 'CLOSING' : 'CLOSED';
    newGateAngle = Math.max(0, state.gateAngle - 15);
    transitionReason = 'Emergency line D=1 asserted. Fail-safe barrier shutdown.';
    return packageNextState(state, next, newWarningCounter, newGatePosition, newGateAngle, newWarningLights, newBuzzer, newGateCloseCmd, newSafeToOpenCmd, transitionReason, true, 'Emergency stop signal asserted');
  }

  // 2. Normal Sequential State Transitions
  switch (current) {
    case STATES.IDLE:
      newGatePosition = 'OPEN';
      newGateAngle = 90;
      newWarningLights = false;
      newBuzzer = false;
      newGateCloseCmd = false;
      newSafeToOpenCmd = true;
      newWarningCounter = 0;

      if (A === 1) {
        next = STATES.APPROACHING;
        newWarningLights = true;
        newBuzzer = true;
        newGateCloseCmd = true;
        newSafeToOpenCmd = false;
        newWarningCounter = 1;
        transitionReason = 'Approach sensor A tripped (1). Pre-warning bells and flashers engaged.';
      } else if (B === 1) {
        // Unexpected occupancy without approach: immediate closing
        next = STATES.CLOSING;
        newWarningLights = true;
        newBuzzer = true;
        newGateCloseCmd = true;
        transitionReason = 'Direct crossing occupancy B tripped without advance approach.';
      }
      break;

    case STATES.APPROACHING:
      newWarningLights = true;
      newBuzzer = true;
      newGateCloseCmd = true;
      newSafeToOpenCmd = false;

      // In manual mode, if user de-asserts approach sensor before descent begins
      if (A === 0 && B === 0 && C === 0) {
        next = STATES.IDLE;
        newWarningLights = false;
        newBuzzer = false;
        newGateCloseCmd = false;
        newSafeToOpenCmd = true;
        newWarningCounter = 0;
        transitionReason = 'Approach sensor released before barrier descent. System returned to IDLE.';
        break;
      }

      // Allow 3 clock cycles of advance flasher warning before barrier descent begins
      if (state.warningCounter >= 3 || B === 1) {
        next = STATES.CLOSING;
        newGatePosition = 'CLOSING';
        newWarningCounter = 0;
        transitionReason = 'Advance warning interval satisfied (3 clock ticks). Barrier motor activated.';
      } else {
        newWarningCounter = state.warningCounter + 1;
        transitionReason = `Advance warning countdown tick ${newWarningCounter}/3`;
      }
      break;

    case STATES.CLOSING:
      newWarningLights = true;
      newBuzzer = true;
      newGateCloseCmd = true;
      newSafeToOpenCmd = false;

      // Lower barrier smoothly
      if (newGateAngle > 0) {
        newGateAngle = Math.max(0, state.gateAngle - 30);
        newGatePosition = newGateAngle === 0 ? 'CLOSED' : 'CLOSING';
        transitionReason = `Barrier lowering: ${newGateAngle}°`;
      }

      if (newGateAngle === 0) {
        newGatePosition = 'CLOSED';
        if (B === 1) {
          next = STATES.CROSSING_OCCUPIED;
          transitionReason = 'Barrier fully lowered (0°). Train now occupying crossing zone.';
        } else if (C === 1 && A === 0) {
          next = STATES.CLEARING;
          newWarningCounter = 0;
          transitionReason = 'Barrier lowered; train reached departure sensor C.';
        } else if (A === 0 && B === 0 && C === 0) {
          next = STATES.OPENING;
          newGatePosition = 'OPENING';
          transitionReason = 'All sensors clear (A=0, B=0, C=0). Reopening barrier.';
        } else {
          transitionReason = 'Barrier locked down. Waiting for train center sensor B.';
        }
      }
      break;

    case STATES.CROSSING_OCCUPIED:
      newWarningLights = true;
      newBuzzer = true;
      newGateCloseCmd = true;
      newGatePosition = 'CLOSED';
      newGateAngle = 0;
      newSafeToOpenCmd = false;

      // If center sensor B clears and departure sensor C triggers
      if (B === 0 && C === 1) {
        next = STATES.CLEARING;
        newWarningCounter = 0;
        transitionReason = 'Center occupancy B cleared (0), Departure sensor C confirmed (1).';
      } else if (B === 0 && C === 0 && A === 0) {
        next = STATES.OPENING;
        newGatePosition = 'OPENING';
        transitionReason = 'Crossing cleared. Reopening barrier safely.';
      } else {
        transitionReason = 'Train occupying crossing. Signals locked in closed state.';
      }
      break;

    case STATES.CLEARING:
      newWarningLights = true;
      newBuzzer = true;
      newGateCloseCmd = true;
      newGatePosition = 'CLOSED';
      newGateAngle = 0;

      // Validate Safe-to-Open equation: O = C · A' · B' · D'
      const isOTrue = (C === 1 && A === 0 && B === 0 && D === 0);
      
      // Delay 2 clock cycles to ensure whole train has cleared safe buffer zone
      if (isOTrue) {
        if (state.warningCounter >= 2) {
          next = STATES.OPENING;
          newGatePosition = 'OPENING';
          newWarningCounter = 0;
          newSafeToOpenCmd = true;
          transitionReason = "Safe-to-Open condition O=1 verified (C·A'·B'·D') with buffer delay. Opening gate.";
        } else {
          newWarningCounter = state.warningCounter + 1;
          transitionReason = `Safety validation hold: verifying tail buffer clear (${newWarningCounter}/2)`;
        }
      } else if (A === 0 && B === 0 && C === 0 && D === 0) {
        next = STATES.OPENING;
        newGatePosition = 'OPENING';
        newWarningCounter = 0;
        newSafeToOpenCmd = true;
        transitionReason = 'Track sensors cleared. Opening barrier safely.';
      } else {
        transitionReason = 'Validation incomplete: Waiting for approach or occupancy lines to remain low.';
      }
      break;

    case STATES.OPENING:
      newGateCloseCmd = false;
      newSafeToOpenCmd = true;

      // Raise barrier smoothly
      if (newGateAngle < 90) {
        newGateAngle = Math.min(90, state.gateAngle + 30);
        newGatePosition = newGateAngle === 90 ? 'OPEN' : 'OPENING';
        newWarningLights = false;
        newBuzzer = false;
        transitionReason = `Barrier lifting: ${newGateAngle}°`;
      }

      if (newGateAngle >= 90) {
        next = STATES.IDLE;
        newGatePosition = 'OPEN';
        newGateAngle = 90;
        newWarningLights = false;
        newBuzzer = false;
        transitionReason = 'Barrier fully vertical (90°). System returned to IDLE.';
      }
      break;

    case STATES.EMERGENCY:
      newWarningLights = true;
      newBuzzer = true;
      newGateCloseCmd = true;
      newSafeToOpenCmd = false;

      // Close barrier if not closed
      if (newGateAngle > 0) {
        newGateAngle = Math.max(0, state.gateAngle - 30);
        newGatePosition = newGateAngle === 0 ? 'CLOSED' : 'CLOSING';
      } else {
        newGatePosition = 'CLOSED';
      }

      if (D === 0 && inputs.clearFaultRequested) {
        // Recovery permitted only if sensor conflict resolved and explicit reset
        if (A === 0 && B === 0) {
          next = STATES.OPENING;
          newGatePosition = 'OPENING';
          transitionReason = 'Emergency cleared and recovery authorized. Restoring safe operations.';
        } else {
          transitionReason = 'Emergency released, but sensors still active. Awaiting clear track.';
        }
      } else {
        transitionReason = 'Emergency locked. Gate secured in closed state.';
      }
      break;

    default:
      next = STATES.IDLE;
      break;
  }

  return packageNextState(state, next, newWarningCounter, newGatePosition, newGateAngle, newWarningLights, newBuzzer, newGateCloseCmd, newSafeToOpenCmd, transitionReason, false, null);
}

function packageNextState(state, nextState, warningCounter, gatePosition, gateAngle, warningLights, buzzer, gateCloseCommand, safeToOpenCommand, transitionReason, faultDetected, faultReason) {
  const enc = STATE_ENCODING[nextState];
  const flashPhase = (state.warningFlashPhase + 1) % 2;

  return {
    currentState: nextState,
    previousState: state.currentState,
    clockCycle: state.clockCycle + 1,
    warningCounter,
    gatePosition,
    gateAngle,
    warningLights,
    warningFlashPhase: flashPhase,
    buzzer,
    gateCloseCommand,
    safeToOpenCommand,
    faultDetected,
    faultReason,
    transitionReason,
    flipFlops: {
      // D Flip-Flop excitation inputs equal to the next state bits: D_i = Q_i^+
      D2: enc.Q2,
      D1: enc.Q1,
      D0: enc.Q0,
      // Current state outputs of flip-flops Q2, Q1, Q0
      Q2: STATE_ENCODING[state.currentState]?.Q2 ?? 0,
      Q1: STATE_ENCODING[state.currentState]?.Q1 ?? 0,
      Q0: STATE_ENCODING[state.currentState]?.Q0 ?? 0
    }
  };
}
