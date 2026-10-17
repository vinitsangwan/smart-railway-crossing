import React, { useState } from 'react';
import { KMAP_CONFIGS, KMAP_4VAR_CELLS, GRAY_CODE_2BIT } from '../logic/karnaughMapSolver';
import { Layers, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';

export default function KarnaughMap() {
  const [selectedOutput, setSelectedOutput] = useState('W'); // 'W' or 'O'
  const config = KMAP_CONFIGS[selectedOutput];

  return (
    <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-2xl flex flex-col space-y-5">
      {/* Header and Output Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-railway-yellow" />
            <span>KARNAUGH MAP (K-MAP) &amp; BOOLEAN ALGEBRA MINIMIZER</span>
          </h2>
          <p className="text-xs text-railway-muted">
            4-Variable Gray Code Grid [AB \ CD] with Power-of-Two Cell Grouping
          </p>
        </div>

        {/* Function Selector Switcher */}
        <div className="flex items-center space-x-2 bg-railway-darker p-1 rounded-lg border border-railway-border">
          <button
            onClick={() => setSelectedOutput('W')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              selectedOutput === 'W'
                ? 'bg-railway-yellow text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Warning Request: W = A + B + D
          </button>
          <button
            onClick={() => setSelectedOutput('O')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              selectedOutput === 'O'
                ? 'bg-emerald-500 text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Safe to Open: O = C · A' · B' · D'
          </button>
        </div>
      </div>

      {/* Main K-Map Grid & Simplification Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 4x4 Karnaugh Map Matrix (7 Cols) */}
        <div className="lg:col-span-7 bg-railway-darker p-5 rounded-xl border border-railway-border flex flex-col items-center">
          <div className="text-xs font-mono text-cyan-400 font-bold mb-3 flex items-center justify-between w-full">
            <span>4-VARIABLE MATRIX: AB \ CD</span>
            <span className="text-slate-400 font-normal">Gray Code: 00 ➔ 01 ➔ 11 ➔ 10</span>
          </div>

          <div className="overflow-x-auto w-full flex justify-center py-2">
            <div className="inline-block font-mono text-xs">
              {/* Top CD Column Headers */}
              <div className="flex items-center">
                <div className="w-16 h-10 flex items-center justify-center font-bold text-slate-400 border-b border-r border-railway-border">
                  AB \ CD
                </div>
                {GRAY_CODE_2BIT.map(cd => (
                  <div key={cd} className="w-16 h-10 flex items-center justify-center font-bold text-cyan-300 border-b border-railway-border bg-railway-panel/40">
                    {cd}
                  </div>
                ))}
              </div>

              {/* Rows: AB = 00, 01, 11, 10 */}
              {KMAP_4VAR_CELLS.map((row, rIdx) => {
                const abLabel = GRAY_CODE_2BIT[rIdx];
                return (
                  <div key={abLabel} className="flex items-center">
                    {/* Left AB Row Header */}
                    <div className="w-16 h-16 flex items-center justify-center font-bold text-cyan-300 border-r border-b border-railway-border bg-railway-panel/40">
                      {abLabel}
                    </div>

                    {/* 4 Cells per row */}
                    {row.map((cell) => {
                      const isOne = config.minterms.includes(cell.m);

                      // Check which groups this cell belongs to
                      const cellGroups = config.groups.filter(g => g.cells.includes(cell.m));
                      const activeGroup = cellGroups[0];

                      return (
                        <div
                          key={cell.m}
                          className={`w-16 h-16 border-r border-b border-railway-border/60 p-1 flex flex-col justify-between transition-all relative ${
                            isOne
                              ? activeGroup
                                ? `${activeGroup.color} font-bold`
                                : 'bg-railway-panel/60 text-white font-bold'
                              : 'bg-railway-darker text-slate-600'
                          }`}
                        >
                          {/* Minterm subscript number */}
                          <div className="flex justify-between items-center text-[9px] text-slate-400">
                            <span>m{cell.m}</span>
                            <span className="text-[8px] opacity-70">{cell.A}{cell.B}{cell.C}{cell.D}</span>
                          </div>

                          {/* Cell Value: 1 or 0 */}
                          <div className="text-center text-xl font-bold font-mono">
                            {isOne ? '1' : '0'}
                          </div>

                          {/* Tiny group indicator dot */}
                          <div className="text-[8px] text-center opacity-75">
                            {cellGroups.map(g => g.term).join(', ')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group Color Legend */}
          <div className="mt-4 w-full flex flex-wrap gap-2 text-xs font-mono">
            {config.groups.map(group => (
              <div key={group.id} className={`px-2.5 py-1 rounded border flex items-center space-x-1.5 ${group.color}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-current"></span>
                <span>Term: <strong>{group.term}</strong> ({group.cells.length} cells)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Algebraic Simplification & De Morgan Analysis (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Canonical Forms Card */}
          <div className="bg-railway-darker p-4 rounded-xl border border-railway-border space-y-3 font-mono text-xs">
            <h3 className="font-bold text-railway-yellow flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-railway-yellow" />
              <span>CANONICAL FORMS</span>
            </h3>

            <div>
              <span className="text-slate-400 block text-[11px]">Sum of Products (SOP / Minterms):</span>
              <p className="text-cyan-300 bg-railway-panel p-2 rounded border border-railway-border/60 text-xs overflow-x-auto">
                {config.sopNotation}
              </p>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Product of Sums (POS / Maxterms):</span>
              <p className="text-slate-300 bg-railway-panel p-2 rounded border border-railway-border/60 text-xs overflow-x-auto">
                {config.posNotation}
              </p>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Minimal Simplified Boolean Expression:</span>
              <p className="text-lg font-bold text-emerald-400 bg-emerald-950/20 p-2.5 rounded border border-emerald-500/30">
                {config.simplifiedSOP}
              </p>
            </div>
          </div>

          {/* De Morgan's Law Proof Card */}
          <div className="bg-railway-darker p-4 rounded-xl border border-railway-border space-y-2 text-xs">
            <h3 className="font-bold text-white flex items-center space-x-1.5 font-mono">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>DE MORGAN'S THEOREM PROOF</span>
            </h3>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {config.deMorganNote}
            </p>
            <div className="bg-railway-panel p-2.5 rounded border border-railway-border/60 font-mono text-slate-300 text-[11px] space-y-1">
              <div>Rule 1: (X + Y)' = X' · Y'</div>
              <div>Rule 2: (X · Y)' = X' + Y'</div>
              <div className="text-emerald-400 font-bold">W' = (A + B + D)' = A' · B' · D'</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Derivation Procedure */}
      <div className="bg-railway-darker p-4 rounded-xl border border-railway-border text-xs">
        <h3 className="font-bold text-white font-mono flex items-center space-x-1.5 mb-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>STEP-BY-STEP MAP SIMPLIFICATION PROCEDURE:</span>
        </h3>
        <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
          {config.derivationSteps.map((step, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <span className="text-railway-yellow font-bold shrink-0">[{idx + 1}]</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
