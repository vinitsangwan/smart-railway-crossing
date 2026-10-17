import React, { useState } from 'react';
import LogicGate, { GATE_DEFINITIONS } from '../components/LogicGate';
import CircuitDiagram from '../components/CircuitDiagram';
import { Cpu, Layers, Sparkles } from 'lucide-react';

export default function LogicLab() {
  const [activeTab, setActiveTab] = useState('SCHEMATIC'); // 'SCHEMATIC' or 'GATES'
  const [selectedGate, setSelectedGate] = useState('AND');

  return (
    <div className="space-y-6">
      {/* Title & Section Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-railway-border/60">
        <div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-wide font-mono flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-stone-700 dark:text-stone-300" />
            <span>DIGITAL LOGIC &amp; GATE LABORATORY</span>
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Interactive gate-level simulation and 74-series discrete IC circuit verification
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center space-x-1 bg-railway-panel p-1 rounded-lg border border-railway-border text-xs font-mono">
          <button
            onClick={() => setActiveTab('SCHEMATIC')}
            className={`px-3 py-1.5 rounded font-bold transition-all ${
              activeTab === 'SCHEMATIC'
                ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Railway 74-Series Circuit
          </button>
          <button
            onClick={() => setActiveTab('GATES')}
            className={`px-3 py-1.5 rounded font-bold transition-all ${
              activeTab === 'GATES'
                ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Individual Gate Sandbox (7 Gates)
          </button>
        </div>
      </div>

      {activeTab === 'SCHEMATIC' ? (
        <div className="space-y-6">
          <CircuitDiagram />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Gate Selector Buttons */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(GATE_DEFINITIONS).map((gateKey) => (
              <button
                key={gateKey}
                onClick={() => setSelectedGate(gateKey)}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                  selectedGate === gateKey
                    ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 border-stone-700 dark:border-stone-300 shadow-sm'
                    : 'bg-railway-panel text-stone-800 dark:text-stone-200 border-railway-border hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {gateKey} GATE
              </button>
            ))}
          </div>

          {/* Active Gate Interactive Workbench */}
          <div className="max-w-xl mx-auto">
            <LogicGate gateType={selectedGate} />
          </div>

          {/* All Gates Quick Reference Grid */}
          <div className="mt-8">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50 uppercase tracking-wider font-mono mb-3">
              Standard 74-Series Logic IC Catalog
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-cream-100/60 dark:bg-obsidian-900/60 border border-railway-border">
                <span className="text-stone-900 dark:text-stone-100 font-bold block">74HC08 / 7408</span>
                <span className="text-stone-800 dark:text-stone-200">Quad 2-Input AND Gate</span>
                <p className="text-[10px] text-stone-600 dark:text-stone-400 mt-1">Y = A · B. Used in Safe-to-Open logic.</p>
              </div>
              <div className="p-3 rounded-lg bg-cream-100/60 dark:bg-obsidian-900/60 border border-railway-border">
                <span className="text-amber-500 font-bold block">74HC32 / 7432</span>
                <span className="text-stone-800 dark:text-stone-200">Quad 2-Input OR Gate</span>
                <p className="text-[10px] text-stone-600 dark:text-stone-400 mt-1">Y = A + B. Used in Warning &amp; Gate close.</p>
              </div>
              <div className="p-3 rounded-lg bg-cream-100/60 dark:bg-obsidian-900/60 border border-railway-border">
                <span className="text-stone-700 dark:text-stone-300 font-bold block">74HC04 / 7404</span>
                <span className="text-stone-800 dark:text-stone-200">Hex Inverter (NOT Gate)</span>
                <p className="text-[10px] text-stone-600 dark:text-stone-400 mt-1">Y = A'. Produces inverted sensor terms.</p>
              </div>
              <div className="p-3 rounded-lg bg-cream-100/60 dark:bg-obsidian-900/60 border border-railway-border">
                <span className="text-emerald-500 font-bold block">74HC74 / 7474</span>
                <span className="text-stone-800 dark:text-stone-200">Dual D-Type Flip-Flop</span>
                <p className="text-[10px] text-stone-600 dark:text-stone-400 mt-1">Positive edge-triggered state register.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
