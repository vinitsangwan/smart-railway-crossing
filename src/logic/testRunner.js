/**
 * Automated Test Runner for DELD Digital Logic & Sequential FSM
 * Executes real assertions against boolean functions and FSM transition rules.
 */

import { evaluateExpressions, validateSensors } from './booleanFunctions';
import { computeNextState, INITIAL_FSM_STATE, STATES } from './stateMachine';
import { TEST_SCENARIOS } from '../data/testScenarios';

export function runSingleTest(scenario) {
  let simFsm = { ...INITIAL_FSM_STATE };
  
  // Apply scenario initial conditions
  if (scenario.initialConditions.state) {
    simFsm.currentState = scenario.initialConditions.state;
  }
  if (scenario.initialConditions.gate) {
    simFsm.gatePosition = scenario.initialConditions.gate;
    simFsm.gateAngle = scenario.initialConditions.gate === 'CLOSED' ? 0 : 90;
  }

  const stepResults = [];
  let allPassed = true;

  for (const step of scenario.steps) {
    const { inputs, expectedState, expectedW, expectedG, expectedO, expectedGate, expectSensorConflict, note } = step;

    // 1. Evaluate digital logic
    const evalResult = evaluateExpressions(inputs.A || 0, inputs.B || 0, inputs.C || 0, inputs.D || 0);
    const validation = validateSensors(inputs.A || 0, inputs.B || 0, inputs.C || 0, inputs.D || 0);

    // 2. Evaluate FSM step
    simFsm = computeNextState(simFsm, {
      A: inputs.A || 0,
      B: inputs.B || 0,
      C: inputs.C || 0,
      D: inputs.D || 0,
      clearFaultRequested: inputs.clearFault || false
    });

    // 3. Evaluate Assertions
    const assertions = [];

    if (expectedState !== undefined) {
      const match = simFsm.currentState === expectedState;
      assertions.push({
        label: `State == ${expectedState}`,
        expected: expectedState,
        actual: simFsm.currentState,
        passed: match
      });
      if (!match) allPassed = false;
    }

    if (expectedW !== undefined) {
      const match = evalResult.outputs.W === expectedW;
      assertions.push({
        label: `W == ${expectedW}`,
        expected: expectedW,
        actual: evalResult.outputs.W,
        passed: match
      });
      if (!match) allPassed = false;
    }

    if (expectedG !== undefined) {
      const match = evalResult.outputs.G === expectedG;
      assertions.push({
        label: `G == ${expectedG}`,
        expected: expectedG,
        actual: evalResult.outputs.G,
        passed: match
      });
      if (!match) allPassed = false;
    }

    if (expectedO !== undefined) {
      const match = evalResult.outputs.O === expectedO;
      assertions.push({
        label: `O == ${expectedO}`,
        expected: expectedO,
        actual: evalResult.outputs.O,
        passed: match
      });
      if (!match) allPassed = false;
    }

    if (expectedGate !== undefined) {
      const match = simFsm.gatePosition === expectedGate;
      assertions.push({
        label: `Gate == ${expectedGate}`,
        expected: expectedGate,
        actual: simFsm.gatePosition,
        passed: match
      });
      if (!match) allPassed = false;
    }

    if (expectSensorConflict !== undefined) {
      const match = !validation.isValid;
      assertions.push({
        label: `Sensor Conflict Flagged == ${expectSensorConflict}`,
        expected: expectSensorConflict,
        actual: !validation.isValid,
        passed: match
      });
      if (!match) allPassed = false;
    }

    stepResults.push({
      stepNumber: step.step,
      note,
      inputs,
      evalResult: evalResult.outputs,
      fsmState: simFsm.currentState,
      gatePosition: simFsm.gatePosition,
      assertions,
      passed: assertions.every(a => a.passed)
    });
  }

  return {
    scenarioId: scenario.id,
    name: scenario.name,
    category: scenario.category,
    passed: allPassed,
    stepResults
  };
}

export function runAllTests() {
  return TEST_SCENARIOS.map(sc => runSingleTest(sc));
}
