/**
 * Deterministic Railway Simulation Engine
 * Integrates physical train motion, sensor trigger geometries,
 * clock cycles, waveform time series, and event logging.
 */

import { evaluateExpressions, validateSensors } from './booleanFunctions';
import { computeNextState, INITIAL_FSM_STATE, STATES } from './stateMachine';

export const SIMULATION_MODES = {
  AUTO: 'AUTO',
  MANUAL: 'MANUAL',
  VIRTUAL_ARDUINO: 'VIRTUAL_ARDUINO'
};

export const INITIAL_SIM_STATE = {
  mode: SIMULATION_MODES.AUTO,
  isRunning: false,
  speed: 1, // 0.5x, 1x, 2x
  trainPosition: -180, // Pixels along track (crossing center ~400px)
  trainSpeed: 6, // Pixels per tick in auto mode
  trainLength: 260, // Locomotive + 3 carriages
  
  // Physical sensors:
  sensors: {
    A: 0, // Approach sensor
    B: 0, // Crossing center occupancy
    C: 0, // Departure clear sensor
    D: 0  // Emergency / fault line
  },

  // Manual overrides for logic test bench
  manualOverrides: {
    active: false,
    A: 0,
    B: 0,
    C: 0,
    D: 0
  },

  // Evaluated Boolean combinational outputs
  combinational: {
    W: 0,
    G: 0,
    O: 1
  },

  // Sequential FSM state
  fsm: { ...INITIAL_FSM_STATE },

  // Validation / fault flags
  validation: {
    isValid: true,
    hasCriticalFault: false,
    errors: [],
    warnings: []
  },

  // Live digital waveform history (last 50 clock cycles)
  waveforms: [],

  // Event logger
  eventLogs: []
};

/**
 * Calculates sensor trip status based on train geometry along track
 * Track layout:
 * [0px]-----[140px Approach Sensor A]-----[360px..480px Crossing Zone B]-----[580px Departure Sensor C]-----[800px]
 */
export function calculatePhysicalSensors(trainFrontX, trainLength) {
  const trainRearX = trainFrontX - trainLength;

  // Approach zone sensor A is at X = 160
  const A = (trainFrontX >= 120 && trainRearX <= 220) ? 1 : 0;

  // Crossing occupancy sensor B is at X = 420
  const B = (trainFrontX >= 360 && trainRearX <= 480) ? 1 : 0;

  // Departure clear sensor C is at X = 600
  const C = (trainFrontX >= 560 && trainRearX <= 660) ? 1 : 0;

  return { A, B, C };
}

/**
 * Step the simulation forward deterministically by one discrete clock tick
 */
export function stepSimulation(prevState, inputOverrides = {}) {
  let {
    mode,
    isRunning,
    speed,
    trainPosition,
    trainSpeed,
    trainLength,
    sensors,
    manualOverrides,
    fsm,
    waveforms,
    eventLogs
  } = prevState;

  const logs = [...eventLogs];

  // 1. Determine sensor inputs
  let effectiveSensors = { ...sensors };

  if (manualOverrides.active) {
    effectiveSensors = {
      A: manualOverrides.A,
      B: manualOverrides.B,
      C: manualOverrides.C,
      D: manualOverrides.D
    };
  } else {
    // Physical sensors derived from train position
    const physical = calculatePhysicalSensors(trainPosition, trainLength);
    effectiveSensors = {
      A: physical.A,
      B: physical.B,
      C: physical.C,
      D: manualOverrides.D // Emergency can always be manually injected
    };
  }

  // Any single-tick overrides (e.g. from test cases)
  if (inputOverrides.A !== undefined) effectiveSensors.A = inputOverrides.A;
  if (inputOverrides.B !== undefined) effectiveSensors.B = inputOverrides.B;
  if (inputOverrides.C !== undefined) effectiveSensors.C = inputOverrides.C;
  if (inputOverrides.D !== undefined) effectiveSensors.D = inputOverrides.D;

  // 2. Evaluate combinational Boolean expressions
  const combEval = evaluateExpressions(
    effectiveSensors.A,
    effectiveSensors.B,
    effectiveSensors.C,
    effectiveSensors.D
  );

  // 3. Sensor validation and fault analysis
  const validation = validateSensors(
    effectiveSensors.A,
    effectiveSensors.B,
    effectiveSensors.C,
    effectiveSensors.D
  );

  // Log sensor faults if newly detected
  if (!validation.isValid && validation.errors.length > 0) {
    validation.errors.forEach(err => {
      if (!logs.some(l => l.code === err.code && l.cycle === fsm.clockCycle)) {
        logs.unshift({
          id: `${Date.now()}-${Math.random()}`,
          time: new Date().toLocaleTimeString(),
          cycle: fsm.clockCycle,
          type: 'FAULT',
          code: err.code,
          message: `${err.title}: ${err.description}`,
          severity: err.severity
        });
      }
    });
  }

  // 4. Update Sequential State Machine (Clocked Rising Edge)
  const nextFsm = computeNextState(fsm, {
    ...effectiveSensors,
    clearFaultRequested: inputOverrides.clearFault || false
  });

  // Log state transitions
  if (nextFsm.currentState !== fsm.currentState) {
    logs.unshift({
      id: `${Date.now()}-${Math.random()}`,
      time: new Date().toLocaleTimeString(),
      cycle: nextFsm.clockCycle,
      type: 'STATE_TRANSITION',
      message: `State change: ${fsm.currentState} ➔ ${nextFsm.currentState}. Reason: ${nextFsm.transitionReason}`,
      severity: nextFsm.currentState === STATES.EMERGENCY ? 'critical' : 'info'
    });
  }

  // 5. Update Train Physics
  let nextTrainPos = trainPosition;
  if (mode === SIMULATION_MODES.AUTO && isRunning) {
    // Train can only cross the crossing if gate is fully closed and locked, OR if train is not at crossing yet
    const isAtCrossingThreshold = trainPosition >= 320 && trainPosition <= 360;
    const isSafeToCross = nextFsm.gatePosition === 'CLOSED';

    if (isAtCrossingThreshold && !isSafeToCross) {
      // Train halted by signal before crossing!
      if (!logs.some(l => l.code === 'TRAIN_HELD' && l.cycle === nextFsm.clockCycle)) {
        logs.unshift({
          id: `${Date.now()}-${Math.random()}`,
          time: new Date().toLocaleTimeString(),
          cycle: nextFsm.clockCycle,
          type: 'SAFETY_INTERLOCK',
          code: 'TRAIN_HELD',
          message: 'Signal Stop: Train held before crossing until barrier is confirmed CLOSED (0°).',
          severity: 'warning'
        });
      }
    } else {
      nextTrainPos += trainSpeed * speed;
      // Loop track when train has completely traversed off screen (e.g. > 950px)
      if (nextTrainPos > 950) {
        nextTrainPos = -220;
        logs.unshift({
          id: `${Date.now()}-${Math.random()}`,
          time: new Date().toLocaleTimeString(),
          cycle: nextFsm.clockCycle,
          type: 'INFO',
          message: 'Train cleared section. Resetting track approach for next scheduled service.',
          severity: 'info'
        });
      }
    }
  } else if (mode === SIMULATION_MODES.MANUAL) {
    // In manual mode, adjust train position smoothly towards active sensor zone
    let targetX = nextTrainPos;
    if (effectiveSensors.B === 1) {
      targetX = 430; // Centered over crossing B
    } else if (effectiveSensors.A === 1) {
      targetX = 180; // Approaching zone A
    } else if (effectiveSensors.C === 1) {
      targetX = 640; // Departure zone C
    } else {
      // If all sensors low, keep at current or park off-screen if system returned to IDLE/OPEN
      if (nextFsm.currentState === STATES.OPENING || nextFsm.currentState === STATES.IDLE) {
        targetX = -180;
      }
    }

    // Smoothly step towards target position
    if (Math.abs(targetX - nextTrainPos) > 15) {
      nextTrainPos += (targetX > nextTrainPos ? 1 : -1) * 25 * speed;
    } else {
      nextTrainPos = targetX;
    }
  }

  // 6. Record Waveform Sample
  const waveformSample = {
    cycle: nextFsm.clockCycle,
    time: nextFsm.clockCycle,
    A: effectiveSensors.A,
    B: effectiveSensors.B,
    C: effectiveSensors.C,
    D: effectiveSensors.D,
    W: combEval.outputs.W,
    G: combEval.outputs.G,
    O: combEval.outputs.O,
    gateClosed: nextFsm.gatePosition === 'CLOSED' ? 1 : 0,
    gateAngle: nextFsm.gateAngle,
    gateStatusNum: nextFsm.gatePosition === 'OPEN' ? 0 : (nextFsm.gatePosition === 'CLOSING' ? 0.33 : (nextFsm.gatePosition === 'CLOSED' ? 1 : 0.66)),
    warningLights: nextFsm.warningLights ? 1 : 0,
    buzzer: nextFsm.buzzer ? 1 : 0,
    state: nextFsm.currentState,
    Q2: nextFsm.flipFlops.Q2,
    Q1: nextFsm.flipFlops.Q1,
    Q0: nextFsm.flipFlops.Q0,
    clock: (nextFsm.clockCycle % 2 === 0) ? 1 : 0
  };

  const nextWaveforms = [...waveforms.slice(-49), waveformSample];

  // Limit log items to 80
  const trimmedLogs = logs.slice(0, 80);

  return {
    ...prevState,
    trainPosition: nextTrainPos,
    sensors: effectiveSensors,
    combinational: combEval.outputs,
    fsm: nextFsm,
    validation,
    waveforms: nextWaveforms,
    eventLogs: trimmedLogs
  };
}
