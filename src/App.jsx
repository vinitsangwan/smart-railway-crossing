import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import RailwaySimulation from './pages/RailwaySimulation';
import LogicLab from './pages/LogicLab';
import VirtualCircuit from './pages/VirtualCircuit';
import TruthTablePage from './pages/TruthTablePage';
import TimingPage from './pages/TimingPage';
import StateMachinePage from './pages/StateMachinePage';
import FaultTesting from './pages/FaultTesting';

import { INITIAL_SIM_STATE, stepSimulation, SIMULATION_MODES } from './logic/simulationEngine';
import { STATES } from './logic/stateMachine';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [simState, setSimState] = useState(INITIAL_SIM_STATE);
  const [theme, setTheme] = useState(() => {
    // Default to simple clean human UI (light)
    return 'light';
  });

  // Keep html element in sync with theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      document.documentElement.setAttribute('data-theme', next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  }, []);

  // Simulation tick loop interval
  const timerRef = useRef(null);

  // Single Clock Step
  const handleStep = useCallback((overrides = {}) => {
    setSimState(prev => stepSimulation(prev, overrides));
  }, []);

  // Start Simulation
  const handleStart = useCallback(() => {
    setSimState(prev => ({ ...prev, isRunning: true }));
  }, []);

  // Pause Simulation
  const handlePause = useCallback(() => {
    setSimState(prev => ({ ...prev, isRunning: false }));
  }, []);

  // Reset Simulation
  const handleReset = useCallback(() => {
    setSimState({
      ...INITIAL_SIM_STATE,
      eventLogs: [
        {
          id: `${Date.now()}`,
          time: new Date().toLocaleTimeString(),
          cycle: 0,
          type: 'SYSTEM',
          message: 'System reset to quiescent IDLE state (000). All sensors initialized to 0.',
          severity: 'info'
        }
      ]
    });
  }, []);

  // Toggle Auto vs Manual Mode
  const handleToggleMode = useCallback((mode) => {
    setSimState(prev => ({
      ...prev,
      mode,
      isRunning: true, // Keep clock running so manual inputs and gate servo animate smoothly
      manualOverrides: {
        ...prev.manualOverrides,
        active: mode === SIMULATION_MODES.MANUAL
      }
    }));
  }, []);

  // Speed Adjustment
  const handleSetSpeed = useCallback((speed) => {
    setSimState(prev => ({ ...prev, speed }));
  }, []);

  // Toggle Sensor Input (A, B, C, D)
  const handleToggleSensor = useCallback((sensorKey) => {
    setSimState(prev => {
      const currentVal = prev.manualOverrides.active ? prev.manualOverrides[sensorKey] : prev.sensors[sensorKey];
      const newVal = currentVal ? 0 : 1;

      const nextOverrides = {
        ...prev.manualOverrides,
        active: true, // Switch to manual override when user explicitly flips a switch
        [sensorKey]: newVal
      };

      const nextSim = stepSimulation({
        ...prev,
        isRunning: true,
        mode: SIMULATION_MODES.MANUAL,
        manualOverrides: nextOverrides
      });

      return {
        ...nextSim,
        isRunning: true,
        mode: SIMULATION_MODES.MANUAL
      };
    });
  }, []);

  // One-click scenario preset for quick logic verification in manual mode
  const handleSetScenario = useCallback((scenario) => {
    setSimState(prev => {
      let overrides = { A: 0, B: 0, C: 0, D: 0, active: true };
      if (scenario === 'approach') {
        overrides.A = 1;
      } else if (scenario === 'crossing') {
        overrides.B = 1;
      } else if (scenario === 'depart') {
        overrides.C = 1;
      } else if (scenario === 'emergency') {
        overrides.D = 1;
      } else if (scenario === 'fault') {
        overrides.A = 1;
        overrides.C = 1; // Contradiction fault
      }

      const nextSim = stepSimulation({
        ...prev,
        isRunning: true,
        mode: SIMULATION_MODES.MANUAL,
        manualOverrides: overrides
      });

      return {
        ...nextSim,
        isRunning: true,
        mode: SIMULATION_MODES.MANUAL
      };
    });
  }, []);

  // Emergency Stop Toggle
  const handleEmergencyToggle = useCallback(() => {
    setSimState(prev => {
      const isEmergency = prev.fsm.currentState === STATES.EMERGENCY || prev.sensors.D === 1;
      if (isEmergency) {
        // Recovery request: clear D and command recovery
        return stepSimulation(prev, { D: 0, clearFault: true });
      } else {
        // Trigger Emergency
        return stepSimulation(prev, { D: 1 });
      }
    });
  }, []);

  // Clear Fault
  const handleClearFault = useCallback(() => {
    setSimState(prev => stepSimulation(prev, { D: 0, clearFault: true }));
  }, []);

  // Clear Event Logs
  const handleClearLogs = useCallback(() => {
    setSimState(prev => ({ ...prev, eventLogs: [] }));
  }, []);

  // Master Clock Loop when running
  useEffect(() => {
    if (simState.isRunning) {
      const intervalMs = Math.max(80, 200 / simState.speed);
      timerRef.current = setInterval(() => {
        setSimState(prev => stepSimulation(prev));
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [simState.isRunning, simState.speed]);

  // Render Active Page
  const renderPage = () => {
    const commonProps = {
      simState,
      onStart: handleStart,
      onPause: handlePause,
      onStep: handleStep,
      onReset: handleReset,
      onToggleMode: handleToggleMode,
      onSetSpeed: handleSetSpeed,
      onToggleSensor: handleToggleSensor,
      onSetScenario: handleSetScenario,
      onEmergencyToggle: handleEmergencyToggle,
      onClearFault: handleClearFault,
      onClearLogs: handleClearLogs,
      setActivePage
    };

    switch (activePage) {
      case 'dashboard':
        return <Dashboard {...commonProps} />;
      case 'simulation':
        return <RailwaySimulation {...commonProps} />;
      case 'logic-lab':
        return <LogicLab />;
      case 'virtual-circuit':
      case 'virtual-arduino':
        return <VirtualCircuit simState={simState} onToggleSensor={handleToggleSensor} />;
      case 'truth-table':
        return <TruthTablePage simState={simState} onToggleSensor={handleToggleSensor} />;
      case 'timing':
        return <TimingPage {...commonProps} />;
      case 'state-machine':
        return <StateMachinePage simState={simState} onStep={handleStep} />;
      case 'fault-testing':
        return <FaultTesting />;
      default:
        return <Dashboard {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-railway-darker text-railway-text flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        simState={simState}
        onEmergencyToggle={handleEmergencyToggle}
        onReset={handleReset}
        activePage={activePage}
        setActivePage={setActivePage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="no-print h-full">
          <Sidebar activePage={activePage} setActivePage={setActivePage} />
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
