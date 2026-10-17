import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, ChevronRight, Binary, FileText } from 'lucide-react';

export default function BooleanAlgebraLab() {
  const [selectedTopic, setSelectedTopic] = useState('WARNING_PROOF'); // 'WARNING_PROOF', 'SAFE_PROOF', 'AXIOMS'

  const BOOLEAN_LAWS = [
    { name: 'Identity Law', orForm: 'A + 0 = A', andForm: 'A · 1 = A', note: 'Adding 0 or ANDing with 1 preserves the variable.' },
    { name: 'Annulment (Null) Law', orForm: 'A + 1 = 1', andForm: 'A · 0 = 0', note: 'Dominant elements: 1 in OR, 0 in AND.' },
    { name: 'Idempotent Law', orForm: 'A + A = A', andForm: 'A · A = A', note: 'Duplicate literals can be combined without changing truth value.' },
    { name: 'Complement Law', orForm: "A + A' = 1", andForm: "A · A' = 0", note: 'A variable combined with its negation.' },
    { name: 'Involution (Double Negation)', orForm: "(A')' = A", andForm: "(A')' = A", note: 'Inverting a signal twice restores original value.' },
    { name: 'Commutative Law', orForm: 'A + B = B + A', andForm: 'A · B = B · A', note: 'Order of input variables does not alter gate output.' },
    { name: 'Associative Law', orForm: '(A + B) + C = A + (B + C)', andForm: '(A · B) · C = A · (B · C)', note: 'Grouping order is irrelevant for uniform gates.' },
    { name: 'Distributive Law 1', orForm: 'A · (B + C) = A · B + A · C', andForm: 'Standard expansion of product over sum.', note: 'Crucial for factoring algebraic terms.' },
    { name: 'Distributive Law 2', orForm: 'A + (B · C) = (A + B) · (A + C)', andForm: 'Dual distributive law unique to Boolean algebra.', note: 'Used for POS factorization.' },
    { name: 'Absorption Law', orForm: 'A + (A · B) = A', andForm: 'A · (A + B) = A', note: 'Redundant term A·B is absorbed by single literal A.' },
    { name: "De Morgan's Theorem 1", orForm: "(A + B)' = A' · B'", andForm: "NOR is equivalent to bubbled AND.", note: 'Complemented OR equals product of complemented terms.' },
    { name: "De Morgan's Theorem 2", orForm: "(A · B)' = A' + B'", andForm: "NAND is equivalent to bubbled OR.", note: 'Complemented AND equals sum of complemented terms.' }
  ];

  return (
    <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-sm flex flex-col space-y-5">
      {/* Header and Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
        <div>
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-50 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-stone-700 dark:text-stone-300" />
            <span>BOOLEAN ALGEBRA SIMPLIFICATION &amp; POSTULATE PROOFS</span>
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Formal algebraic reduction, canonical SOP expansion, and De Morgan's theorems without graphic maps
          </p>
        </div>

        {/* Topic Switcher */}
        <div className="flex items-center space-x-1 bg-railway-panel p-1 rounded-lg border border-railway-border text-xs font-mono">
          <button
            onClick={() => setSelectedTopic('WARNING_PROOF')}
            className={`px-3 py-1.5 rounded font-bold transition-all ${
              selectedTopic === 'WARNING_PROOF'
                ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Algebraic Reduction: W = A + B + D
          </button>
          <button
            onClick={() => setSelectedTopic('SAFE_PROOF')}
            className={`px-3 py-1.5 rounded font-bold transition-all ${
              selectedTopic === 'SAFE_PROOF'
                ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Safe-to-Open &amp; De Morgan Proof
          </button>
          <button
            onClick={() => setSelectedTopic('AXIOMS')}
            className={`px-3 py-1.5 rounded font-bold transition-all ${
              selectedTopic === 'AXIOMS'
                ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Boolean Laws Table
          </button>
        </div>
      </div>

      {/* Content Section 1: Algebraic Proof of W = A + B + D */}
      {selectedTopic === 'WARNING_PROOF' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-cream-100/60 dark:bg-obsidian-900/60 p-5 rounded-xl border border-railway-border space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50 uppercase tracking-wider flex items-center space-x-2">
              <Binary className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>Step-by-Step Algebraic Reduction of Warning Function (W)</span>
            </h3>

            <div className="space-y-3 text-stone-800 dark:text-stone-200">
              <div className="p-3 rounded-lg bg-white dark:bg-obsidian-800 border border-railway-border">
                <span className="text-[11px] text-stone-600 dark:text-stone-400 block font-sans font-bold">1. Initial Canonical Sum-of-Products (SOP) Formulation:</span>
                <p className="text-stone-900 dark:text-stone-100 font-bold text-xs mt-1 leading-relaxed">
                  W = Σ m(1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)
                </p>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 font-sans">
                  From the 16-row truth table, output W is 1 in exactly 14 minterms. The only minterms where W = 0 are m0 (0000) and m2 (0010).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-obsidian-800 border border-railway-border space-y-2">
                <span className="text-[11px] text-stone-600 dark:text-stone-400 block font-sans font-bold">2. Algebraic Factoring Using Distributive &amp; Complement Laws:</span>
                
                <div className="space-y-2 text-[11px]">
                  <div>
                    <strong className="text-amber-700 dark:text-amber-400 block font-semibold">A. Factoring all minterms containing literal A:</strong>
                    <span>All 8 minterms with A=1 (m8 through m15) expand to:</span>
                    <p className="text-stone-900 dark:text-stone-100 mt-0.5 pl-2 border-l-2 border-amber-500 font-mono">
                      A·B'·C'·D' + A·B'·C'·D + A·B'·C·D + A·B'·C·D' + A·B·C'·D' + A·B·C'·D + A·B·C·D + A·B·C·D'
                    </p>
                    <p className="text-stone-600 dark:text-stone-400 mt-0.5">
                      = A · [B'C'(D'+D) + B'C(D'+D) + BC'(D'+D) + BC(D'+D)] <br />
                      Applying Complement Law (D + D' = 1): <br />
                      = A · [B'C' + B'C + BC' + BC] = A · [B'(C'+C) + B(C'+C)] = A · [B' + B] = <strong className="text-stone-900 dark:text-white">A</strong>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-railway-border">
                    <strong className="text-stone-900 dark:text-stone-100 block font-semibold">B. Factoring all minterms containing literal B:</strong>
                    <span>Similarly, by Idempotent Law (X + X = X), we reuse shared terms with B=1 (m4, m5, m6, m7, m12, m13, m14, m15):</span>
                    <p className="text-stone-900 dark:text-stone-100 mt-0.5 pl-2 border-l-2 border-stone-500 font-mono">
                      B · [A'C'(D'+D) + A'C(D'+D) + AC'(D'+D) + AC(D'+D)] = B · [A'(1) + A(1)] = <strong className="text-stone-900 dark:text-white">B</strong>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-railway-border">
                    <strong className="text-rose-700 dark:text-rose-400 block font-semibold">C. Factoring all remaining minterms containing literal D:</strong>
                    <span>Reusing terms where D=1 (m1, m3, m5, m7, m9, m11, m13, m15):</span>
                    <p className="text-stone-900 dark:text-stone-100 mt-0.5 pl-2 border-l-2 border-rose-500 font-mono">
                      D · [A'B'(C'+C) + A'B(C'+C) + AB'(C'+C) + AB(C'+C)] = D · [1] = <strong className="text-stone-900 dark:text-white">D</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-sans font-bold">3. Final Minimal Sum-of-Products Expression:</span>
                <p className="text-lg font-bold text-stone-900 dark:text-white mt-1">
                  W = A + B + D
                </p>
                <p className="text-[11px] text-stone-700 dark:text-stone-300 mt-1 font-sans">
                  The warning request simplifies purely through Boolean algebra down to a single 3-input OR disjunction.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Section 2: Safe-to-Open & De Morgan Proof */}
      {selectedTopic === 'SAFE_PROOF' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-cream-100/60 dark:bg-obsidian-900/60 p-5 rounded-xl border border-railway-border space-y-4">
            <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Safe-to-Open Algebraic Derivation &amp; De Morgan Equivalence</span>
            </h3>

            <div className="space-y-3 text-stone-800 dark:text-stone-200">
              <div className="p-3 rounded-lg bg-white dark:bg-obsidian-800 border border-railway-border">
                <span className="text-[11px] text-stone-600 dark:text-stone-400 block font-sans font-bold">1. Truth Table Minterm Identification:</span>
                <p className="text-stone-900 dark:text-stone-100 font-bold text-xs mt-1">
                  O = Σ m(2)
                </p>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 font-sans">
                  Only minterm m2 (A=0, B=0, C=1, D=0) grants safe barrier opening. Writing this minterm in canonical form:
                </p>
                <p className="text-stone-900 dark:text-white text-sm font-bold mt-1 bg-railway-panel p-2 rounded">
                  O = A' · B' · C · D'
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-obsidian-800 border border-railway-border space-y-2">
                <span className="text-[11px] text-stone-600 dark:text-stone-400 block font-sans font-bold">2. Algebraic Transformation via De Morgan's Law:</span>
                <p className="text-stone-700 dark:text-stone-300 font-sans text-xs">
                  Commutative rearrangement:
                </p>
                <p className="text-amber-700 dark:text-amber-400 font-bold">
                  O = C · (A' · B' · D')
                </p>
                <p className="text-stone-600 dark:text-stone-400 font-sans text-[11px] mt-1">
                  Recall De Morgan's First Law for 3 variables: <strong>(X + Y + Z)' = X' · Y' · Z'</strong>.
                </p>
                <p className="text-stone-700 dark:text-stone-300 font-sans text-xs">
                  Applying this in reverse to (A' · B' · D'):
                </p>
                <p className="text-stone-900 dark:text-stone-100 font-bold text-sm bg-railway-panel p-2 rounded border border-railway-border">
                  A' · B' · D' = (A + B + D)'
                </p>
                <p className="text-stone-600 dark:text-stone-400 font-sans text-[11px] mt-1">
                  Since W = A + B + D, we have:
                </p>
                <p className="text-emerald-700 dark:text-emerald-400 font-bold text-sm bg-railway-panel p-2 rounded border border-emerald-500/40">
                  A' · B' · D' = W' &nbsp;(Complement of Warning)
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-sans font-bold">3. Engineering Conclusion:</span>
                <p className="text-lg font-bold text-stone-900 dark:text-white mt-1">
                  O = C · W'
                </p>
                <p className="text-[11px] text-stone-700 dark:text-stone-300 mt-1 font-sans leading-relaxed">
                  This algebraic proof demonstrates the safety interlock: Safe-to-Open (O) is granted <strong>if and only if</strong> Departure Clear sensor is active (C = 1) <strong>AND</strong> the master warning condition is strictly inactive (W' = 1, meaning W = 0).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Section 3: Boolean Laws Reference Table */}
      {selectedTopic === 'AXIOMS' && (
        <div className="overflow-x-auto rounded-lg border border-railway-border font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-cream-200/80 dark:bg-obsidian-700 text-stone-800 dark:text-stone-200 uppercase text-[11px] border-b border-railway-border">
              <tr>
                <th className="py-2.5 px-3">Law / Postulate</th>
                <th className="py-2.5 px-3 text-amber-700 dark:text-amber-400">OR Form (Disjunction)</th>
                <th className="py-2.5 px-3 text-stone-800 dark:text-stone-200">AND Form (Conjunction)</th>
                <th className="py-2.5 px-3">Logic Role &amp; Application</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-railway-border text-stone-800 dark:text-stone-200">
              {BOOLEAN_LAWS.map((law, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-cream-50/50 dark:bg-obsidian-900/40' : 'bg-white dark:bg-obsidian-800'}>
                  <td className="py-2 px-3 font-bold text-stone-900 dark:text-white">{law.name}</td>
                  <td className="py-2 px-3 text-amber-700 dark:text-amber-400 font-bold">{law.orForm}</td>
                  <td className="py-2 px-3 text-stone-900 dark:text-stone-100 font-bold">{law.andForm}</td>
                  <td className="py-2 px-3 text-stone-600 dark:text-stone-400 text-[11px]">{law.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
