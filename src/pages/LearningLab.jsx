import React, { useState } from 'react';
import { SYLLABUS_UNITS } from '../data/syllabusData';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import UnitIWorkbench from '../components/UnitIWorkbench';
import UnitIIWorkbench from '../components/UnitIIWorkbench';
import UnitIIIWorkbench from '../components/UnitIIIWorkbench';
import UnitIVWorkbench from '../components/UnitIVWorkbench';
import UnitVWorkbench from '../components/UnitVWorkbench';

import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  Filter, 
  Layers, 
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LearningLab() {
  const [activeUnit, setActiveUnit] = useState('UNIT_1'); // 'OVERVIEW', 'UNIT_1', 'UNIT_2', 'UNIT_3', 'UNIT_4', 'UNIT_5', 'QUIZ'

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [quizUnitFilter, setQuizUnitFilter] = useState('ALL');

  const filteredQuizQuestions = QUIZ_QUESTIONS.filter(q => {
    if (quizUnitFilter === 'ALL') return true;
    return q.unit === quizUnitFilter;
  });

  const handleSelectOption = (questionId, optionIndex) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleQuizSubmit = () => {
    setSubmitted(true);
    const correctCount = QUIZ_QUESTIONS.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;
    if (correctCount >= 15) {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleQuizReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = filteredQuizQuestions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;

  const UNIT_BUTTONS = [
    { id: 'OVERVIEW', label: 'Syllabus & CO-PO Mapping' },
    { id: 'UNIT_1', label: 'Unit I: Numbers & Codes' },
    { id: 'UNIT_2', label: 'Unit II: Gates & Universal Logic' },
    { id: 'UNIT_3', label: 'Unit III: Combinational Circuits' },
    { id: 'UNIT_4', label: 'Unit IV: Sequential Circuits' },
    { id: 'UNIT_5', label: 'Unit V: Registers & Counters' },
    { id: 'QUIZ', label: '20-Question Exam (Units I-V)' }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Unit Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-railway-border/60">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide font-mono flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-railway-yellow" />
            <span>DELD ACADEMIC CURRICULUM &amp; ENGINEERING LAB</span>
          </h1>
          <p className="text-xs text-railway-muted">
            Aligned with Second Year Engineering 2025 Pattern Syllabus (Dept. of Computer Engineering)
          </p>
        </div>
      </div>

      {/* Engineering Units Navigation Bar */}
      <div className="flex flex-wrap gap-2 border-b border-railway-border/60 pb-3 font-mono text-xs">
        {UNIT_BUTTONS.map(btn => (
          <button
            key={btn.id}
            onClick={() => setActiveUnit(btn.id)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeUnit === btn.id
                ? 'bg-railway-yellow text-black shadow-lg shadow-yellow-500/20'
                : 'bg-railway-card text-slate-300 hover:text-white border border-railway-border hover:bg-railway-panel'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Render Active View */}
      {activeUnit === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-xl space-y-3 font-mono text-xs">
            <div className="flex items-center space-x-2 text-railway-yellow font-bold text-sm">
              <Target className="w-5 h-5 text-cyan-400" />
              <span>Course Outcomes (CO) &amp; Program Outcomes (PO) Mapping</span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              This Smart Railway Crossing Warning System project provides concrete laboratory implementations demonstrating every Course Outcome specified in the SE Engineering syllabus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SYLLABUS_UNITS.map((u, idx) => (
              <div key={idx} className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-lg space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-railway-border/60 font-mono text-xs">
                    <span className="text-railway-yellow font-bold">{u.unit}</span>
                    <span className="text-slate-400">{u.hours}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm mt-2">{u.title}</h3>

                  <div className="mt-3 space-y-2">
                    {u.topics.map((t, tIdx) => (
                      <div key={tIdx} className="text-xs text-slate-300">
                        <strong className="text-cyan-300 block font-mono text-[11px]">• {t.name}</strong>
                        <p className="text-[11px] text-slate-400 font-sans mt-0.5 leading-relaxed">{t.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-railway-border/60 flex items-center justify-between font-mono text-[10px]">
                  <span className="text-emerald-400 font-bold">{u.coMapping}</span>
                  <span className="text-slate-400">POs: {u.poMapping}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeUnit === 'UNIT_1' && <UnitIWorkbench />}
      {activeUnit === 'UNIT_2' && <UnitIIWorkbench />}
      {activeUnit === 'UNIT_3' && <UnitIIIWorkbench />}
      {activeUnit === 'UNIT_4' && <UnitIVWorkbench />}
      {activeUnit === 'UNIT_5' && <UnitVWorkbench />}

      {/* MCQ Examination (Units I to V) */}
      {activeUnit === 'QUIZ' && (
        <div className="bg-railway-card border border-railway-border rounded-xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-railway-border">
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center space-x-2">
                <Award className="w-5 h-5 text-railway-yellow" />
                <span>DELD COMPREHENSIVE CURRICULUM EXAMINATION (UNITS I - V)</span>
              </h2>
              <p className="text-xs text-slate-400">
                20 Multiple Choice Questions mapped directly to syllabus Course Outcomes (CO1 to CO5).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Unit Filter */}
              <div className="flex items-center space-x-1.5 bg-railway-darker px-2.5 py-1.5 rounded-lg border border-railway-border text-xs font-mono">
                <Filter className="w-3.5 h-3.5 text-railway-muted" />
                <select
                  value={quizUnitFilter}
                  onChange={(e) => setQuizUnitFilter(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-railway-card">All 5 Units (20 Qs)</option>
                  <option value="Unit I" className="bg-railway-card">Unit I: Numbers &amp; Codes</option>
                  <option value="Unit II" className="bg-railway-card">Unit II: Gates &amp; Boolean</option>
                  <option value="Unit III" className="bg-railway-card">Unit III: Combinational</option>
                  <option value="Unit IV" className="bg-railway-card">Unit IV: Sequential</option>
                  <option value="Unit V" className="bg-railway-card">Unit V: Registers &amp; ICs</option>
                </select>
              </div>

              {submitted && (
                <div className="px-4 py-1.5 rounded-lg font-mono text-xs font-bold border bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                  SCORE: {score} / {filteredQuizQuestions.length} ({Math.round((score / filteredQuizQuestions.length) * 100)}%)
                </div>
              )}

              {submitted ? (
                <button
                  onClick={handleQuizReset}
                  className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-railway-panel hover:bg-railway-border text-slate-200 border border-railway-border font-mono text-xs font-bold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RETRY EXAM</span>
                </button>
              ) : (
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SUBMIT ANSWERS</span>
                </button>
              )}
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-5">
            {filteredQuizQuestions.map((q, idx) => {
              const selectedOption = selectedAnswers[q.id];
              const isCorrect = selectedOption === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    submitted
                      ? isCorrect
                        ? 'bg-emerald-950/10 border-emerald-500/40'
                        : 'bg-rose-950/20 border-rose-500/40'
                      : 'bg-railway-darker border-railway-border/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold text-white leading-relaxed">
                      <span className="text-cyan-400 font-mono mr-2">Q{idx + 1}.</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-railway-panel text-slate-400 font-mono mr-2">{q.unit}</span>
                      {q.question}
                    </h3>
                    {submitted && (
                      <span className={`text-xs font-mono font-bold shrink-0 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOption === optIdx;
                      const isOptionCorrect = optIdx === q.correctAnswer;

                      let btnStyle = 'bg-railway-panel border-railway-border text-slate-300 hover:border-slate-500';

                      if (submitted) {
                        if (isOptionCorrect) {
                          btnStyle = 'bg-emerald-600/30 text-emerald-300 border-emerald-500 font-bold';
                        } else if (isOptionSelected && !isOptionCorrect) {
                          btnStyle = 'bg-rose-600/30 text-rose-300 border-rose-500 line-through';
                        }
                      } else if (isOptionSelected) {
                        btnStyle = 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`p-2.5 rounded-lg border text-left flex items-center space-x-2 transition-all ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0 font-bold">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="mt-3 p-3 rounded-lg bg-railway-panel/80 border border-railway-border/60 text-xs text-slate-300">
                      <strong className="text-white block font-mono mb-0.5">DELD Explanation:</strong>
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
