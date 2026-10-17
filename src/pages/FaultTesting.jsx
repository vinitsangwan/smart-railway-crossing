import React, { useState } from 'react';
import { TEST_SCENARIOS } from '../data/testScenarios';
import { runSingleTest, runAllTests } from '../logic/testRunner';
import { Bug, Play, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';

export default function FaultTesting() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(TEST_SCENARIOS[0].id);
  const [testResults, setTestResults] = useState({});
  const [isRunningAll, setIsRunningAll] = useState(false);

  // Run single test
  const handleRunSingle = (scenario) => {
    const res = runSingleTest(scenario);
    setTestResults(prev => ({ ...prev, [scenario.id]: res }));
  };

  // Run all 10 tests
  const handleRunAll = () => {
    setIsRunningAll(true);
    setTimeout(() => {
      const results = runAllTests();
      const map = {};
      results.forEach(r => { map[r.scenarioId] = r; });
      setTestResults(map);
      setIsRunningAll(false);
    }, 250);
  };

  const activeScenario = TEST_SCENARIOS.find(s => s.id === selectedScenarioId) || TEST_SCENARIOS[0];
  const activeResult = testResults[activeScenario.id];

  // Count passed tests
  const totalRun = Object.keys(testResults).length;
  const passedCount = Object.values(testResults).filter(r => r.passed).length;

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-railway-border/60">
        <div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-wide font-mono flex items-center space-x-2">
            <Bug className="w-6 h-6 text-red-600 dark:text-red-400" />
            <span>FAULT INJECTION, EDGE CASES &amp; AUTOMATED TEST RUNNER</span>
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            10 formal test suites with deterministic mathematical assertions against Boolean logic and FSM transitions
          </p>
        </div>

        {/* Run All Button */}
        <div className="flex items-center space-x-3">
          {totalRun > 0 && (
            <div className="text-xs font-mono px-3 py-1.5 rounded bg-railway-panel border border-railway-border">
              <span className="text-stone-600 dark:text-stone-400">PASSED: </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{passedCount}/{totalRun}</span>
            </div>
          )}

          <button
            onClick={handleRunAll}
            disabled={isRunningAll}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isRunningAll ? "RUNNING..." : "RUN ALL 10 TEST SUITES"}</span>
          </button>
        </div>
      </div>

      {/* Main Test Layout (Split 4 cols / 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 10 Scenarios Navigation List (4 cols) */}
        <div className="lg:col-span-4 bg-railway-card border border-railway-border rounded-xl p-3 shadow-sm space-y-1.5 max-h-[600px] overflow-y-auto">
          <div className="px-2 py-1 text-[11px] font-mono uppercase text-stone-600 dark:text-stone-400 font-semibold">
            Formal Test Suites (10 Scenarios)
          </div>

          {TEST_SCENARIOS.map((sc) => {
            const isSelected = selectedScenarioId === sc.id;
            const res = testResults[sc.id];

            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenarioId(sc.id)}
                className={`w-full p-2.5 rounded-lg text-left transition-all font-mono text-xs border flex items-center justify-between ${
                  isSelected
                    ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-sm border-stone-700 dark:border-stone-300'
                    : 'bg-cream-100/60 dark:bg-obsidian-900/60 text-stone-800 dark:text-stone-200 border-railway-border hover:bg-stone-200/70 dark:hover:bg-stone-800/70'
                }`}
              >
                <div className="space-y-0.5 truncate pr-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-stone-500">{sc.id}</span>
                    <span className="font-bold truncate text-[11px]">{sc.name}</span>
                  </div>
                  <div className="text-[10px] text-stone-500 truncate">{sc.category}</div>
                </div>

                {/* Pass/Fail badge */}
                {res ? (
                  res.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                  )
                ) : (
                  <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Selected Test Details and Execution Assertions (8 cols) */}
        <div className="lg:col-span-8 bg-railway-card border border-railway-border rounded-xl p-5 shadow-sm space-y-5">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-railway-panel border border-railway-border text-stone-900 dark:text-stone-100 font-mono text-xs font-bold">
                  {activeScenario.id}
                </span>
                <span className="text-xs text-stone-600 dark:text-stone-400 font-mono">{activeScenario.category}</span>
              </div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-50 mt-1">{activeScenario.name}</h2>
              <p className="text-xs text-stone-700 dark:text-stone-300 mt-1 leading-relaxed">{activeScenario.description}</p>
            </div>

            <button
              onClick={() => handleRunSingle(activeScenario)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-50 dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 font-mono text-xs font-bold transition-all shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              <span>RUN THIS TEST</span>
            </button>
          </div>

          {/* Initial Conditions */}
          <div className="p-3 rounded-lg bg-cream-100/60 dark:bg-obsidian-900/60 border border-railway-border text-xs font-mono space-y-1">
            <span className="text-stone-600 dark:text-stone-400 text-[11px] block uppercase font-bold">Initial Pre-Conditions:</span>
            <div className="flex flex-wrap gap-3 text-stone-700 dark:text-stone-300">
              <span>Initial State: <strong className="text-stone-900 dark:text-stone-100 font-bold">{activeScenario.initialConditions.state}</strong></span>
              <span>Gate: <strong className="text-stone-900 dark:text-stone-100 font-bold">{activeScenario.initialConditions.gate}</strong></span>
              <span>Sensors: A={activeScenario.initialConditions.A}, B={activeScenario.initialConditions.B}, C={activeScenario.initialConditions.C}, D={activeScenario.initialConditions.D}</span>
            </div>
          </div>

          {/* Assertion Results */}
          <div className="space-y-3 font-mono text-xs">
            <h3 className="font-bold text-stone-900 dark:text-stone-50 text-[11px] uppercase tracking-wider flex items-center justify-between">
              <span>Sequential Test Steps &amp; Assertion Results</span>
              {activeResult && (
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                  activeResult.passed
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
                }`}>
                  {activeResult.passed ? 'ALL ASSERTIONS PASSED' : 'ASSERTION FAILED'}
                </span>
              )}
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {activeScenario.steps.map((st, i) => {
                const stepRes = activeResult?.stepResults?.[i];

                return (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border text-xs transition-colors ${
                      stepRes
                        ? stepRes.passed
                          ? 'bg-emerald-500/5 border-emerald-500/30'
                          : 'bg-red-500/5 border-red-500/30'
                        : 'bg-cream-100/60 dark:bg-obsidian-900/60 border border-railway-border'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-stone-900 dark:text-stone-100">
                      <span>Step {st.step}: {st.note || 'State transition cycle'}</span>
                      {stepRes && (
                        <span className={`text-[10px] font-bold ${stepRes.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                          {stepRes.passed ? '✓ PASSED' : '✗ FAILED'}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 text-[11px] text-stone-600 dark:text-stone-400 flex flex-wrap gap-3">
                      <span>Inputs: A={st.inputs.A || 0}, B={st.inputs.B || 0}, C={st.inputs.C || 0}, D={st.inputs.D || 0}</span>
                      {st.expectedState && <span>Expected State: <strong className="text-stone-900 dark:text-stone-100 font-bold">{st.expectedState}</strong></span>}
                      {st.expectedW !== undefined && <span>Expected W: {st.expectedW}</span>}
                      {st.expectedO !== undefined && <span>Expected O: {st.expectedO}</span>}
                    </div>

                    {/* Evaluated Assertions */}
                    {stepRes && (
                      <div className="mt-2 pt-2 border-t border-railway-border text-[10px] space-y-1">
                        {stepRes.assertions.map((ast, aIdx) => (
                          <div key={aIdx} className="flex items-center space-x-2">
                            <span className={ast.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}>
                              {ast.passed ? '✓' : '✗'}
                            </span>
                            <span className="text-stone-700 dark:text-stone-300">{ast.label}</span>
                            <span className="text-stone-500">(Actual: {String(ast.actual)})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
