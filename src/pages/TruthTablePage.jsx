import React, { useState } from 'react';
import TruthTable from '../components/TruthTable';
import BooleanAlgebraLab from '../components/BooleanAlgebraLab';
import { Table, Sparkles } from 'lucide-react';

export default function TruthTablePage({ simState, onToggleSensor }) {
  const [activeTab, setActiveTab] = useState('TRUTH_TABLE'); // 'TRUTH_TABLE' or 'BOOLEAN_ALGEBRA'

  const handleSelectRow = (row) => {
    // If user clicks a row in the truth table, update simulation inputs to match that minterm!
    if (onToggleSensor) {
      if (simState.sensors.A !== row.A) onToggleSensor('A');
      if (simState.sensors.B !== row.B) onToggleSensor('B');
      if (simState.sensors.C !== row.C) onToggleSensor('C');
      if (simState.sensors.D !== row.D) onToggleSensor('D');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Section Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-railway-border/60">
        <div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-wide font-mono flex items-center space-x-2">
            <Table className="w-6 h-6 text-stone-700 dark:text-stone-300" />
            <span>TRUTH TABLES &amp; BOOLEAN ALGEBRAIC REDUCTION</span>
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            16-row combinational evaluation, algebraic proofs, postulate factoring, and De Morgan equivalences
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 bg-railway-panel p-1 rounded-lg border border-railway-border text-xs font-mono">
          <button
            onClick={() => setActiveTab('TRUTH_TABLE')}
            className={`px-3 py-1.5 rounded font-bold transition-all ${
              activeTab === 'TRUTH_TABLE'
                ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            16-Row Truth Table
          </button>
          <button
            onClick={() => setActiveTab('BOOLEAN_ALGEBRA')}
            className={`px-3 py-1.5 rounded font-bold transition-all ${
              activeTab === 'BOOLEAN_ALGEBRA'
                ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Algebraic Reduction &amp; Proofs
          </button>
        </div>
      </div>

      {/* Render selected view */}
      {activeTab === 'TRUTH_TABLE' ? (
        <TruthTable currentInputs={simState.sensors} onSelectRow={handleSelectRow} />
      ) : (
        <BooleanAlgebraLab />
      )}
    </div>
  );
}
