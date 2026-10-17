import React, { useState } from 'react';
import { Calculator, ArrowRightLeft, Binary, ShieldCheck } from 'lucide-react';

export default function UnitIWorkbench() {
  const [decInput, setDecInput] = useState(25);
  const [signedDec, setSignedDec] = useState(-18);

  // Base conversions
  const safeDec = Math.max(0, Math.min(65535, parseInt(decInput) || 0));
  const binStr = safeDec.toString(2).padStart(8, '0');
  const octStr = safeDec.toString(8);
  const hexStr = safeDec.toString(16).toUpperCase();

  // BCD: Convert each decimal digit to 4-bit binary
  const bcdStr = String(safeDec)
    .split('')
    .map(d => parseInt(d).toString(2).padStart(4, '0'))
    .join(' ');

  // Excess-3: Add 3 (0011) to each decimal digit
  const xs3Str = String(safeDec)
    .split('')
    .map(d => (parseInt(d) + 3).toString(2).padStart(4, '0'))
    .join(' ');

  // Gray code conversion: G = B ^ (B >> 1)
  const grayCode = (safeDec ^ (safeDec >> 1)).toString(2).padStart(binStr.length, '0');

  // Parity bit calculation for 8-bit binary
  const onesCount = binStr.split('').filter(b => b === '1').length;
  const evenParity = onesCount % 2 === 0 ? 0 : 1;
  const oddParity = onesCount % 2 === 0 ? 1 : 0;

  // Signed 8-bit complement calculations
  const safeSigned = Math.max(-128, Math.min(127, parseInt(signedDec) || 0));
  let signMag = '';
  let onesComp = '';
  let twosComp = '';

  if (safeSigned >= 0) {
    const b = safeSigned.toString(2).padStart(8, '0');
    signMag = b;
    onesComp = b;
    twosComp = b;
  } else {
    const absVal = Math.abs(safeSigned);
    const absBin = absVal.toString(2).padStart(7, '0');
    signMag = '1' + absBin;

    // 1's complement: invert all bits of positive 8-bit binary
    const posBin8 = absVal.toString(2).padStart(8, '0');
    onesComp = posBin8.split('').map(b => b === '1' ? '0' : '1').join('');

    // 2's complement: 1's complement + 1 (or 256 + safeSigned in 8-bit)
    twosComp = (256 + safeSigned).toString(2).padStart(8, '0');
  }

  return (
    <div className="space-y-6">
      {/* Tool 1: Base Conversion & Binary Codes */}
      <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-railway-yellow" />
              <span>Number Systems &amp; Base Converter</span>
            </h3>
            <p className="text-xs text-railway-muted">
              Decimal, Binary, Octal, Hexadecimal, BCD, Excess-3, and Gray Code Generator
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-slate-400">Input Decimal:</span>
            <input
              type="number"
              min="0"
              max="65535"
              value={decInput}
              onChange={(e) => setDecInput(e.target.value)}
              className="w-24 px-3 py-1 rounded bg-railway-darker border border-railway-border text-white font-bold text-center focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* 4 Base Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-railway-darker border border-railway-border">
            <span className="text-slate-400 block text-[10px] uppercase">Decimal (Base-10)</span>
            <span className="text-lg font-bold text-white">{safeDec}</span>
          </div>
          <div className="p-3 rounded-lg bg-railway-darker border border-railway-border">
            <span className="text-cyan-400 block text-[10px] uppercase">Binary (Base-2)</span>
            <span className="text-lg font-bold text-cyan-300 break-all">{binStr}</span>
          </div>
          <div className="p-3 rounded-lg bg-railway-darker border border-railway-border">
            <span className="text-amber-400 block text-[10px] uppercase">Octal (Base-8)</span>
            <span className="text-lg font-bold text-amber-300">{octStr}</span>
          </div>
          <div className="p-3 rounded-lg bg-railway-darker border border-railway-border">
            <span className="text-emerald-400 block text-[10px] uppercase">Hexadecimal (Base-16)</span>
            <span className="text-lg font-bold text-emerald-300">0x{hexStr}</span>
          </div>
        </div>

        {/* Codes Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-railway-panel/80 border border-railway-border/60">
            <strong className="text-railway-yellow block">BCD (8421 Code):</strong>
            <span className="text-slate-200 mt-1 block">{bcdStr}</span>
            <span className="text-[10px] text-slate-400">Each digit encoded as 4 bits</span>
          </div>
          <div className="p-3 rounded-lg bg-railway-panel/80 border border-railway-border/60">
            <strong className="text-railway-yellow block">Excess-3 Code (XS-3):</strong>
            <span className="text-slate-200 mt-1 block">{xs3Str}</span>
            <span className="text-[10px] text-slate-400">BCD + 0011 (Self-complementing)</span>
          </div>
          <div className="p-3 rounded-lg bg-railway-panel/80 border border-railway-border/60">
            <strong className="text-railway-yellow block">Gray Code (Unit-Distance):</strong>
            <span className="text-slate-200 mt-1 block">{grayCode}</span>
            <span className="text-[10px] text-slate-400">G = B ⊕ (B &gt;&gt; 1)</span>
          </div>
        </div>

        {/* Parity Bit Verification */}
        <div className="p-3 rounded-lg bg-railway-darker border border-railway-border/60 text-xs font-mono flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-bold">Error Detection (Parity Codes for 8-bit Binary):</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-300">
            <span>Ones count: <strong className="text-white">{onesCount}</strong></span>
            <span>Even Parity Bit: <strong className="text-cyan-300">{evenParity}</strong></span>
            <span>Odd Parity Bit: <strong className="text-cyan-300">{oddParity}</strong></span>
          </div>
        </div>
      </div>

      {/* Tool 2: Signed 8-Bit Number Representation & Complements */}
      <div className="bg-railway-card border border-railway-border rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-railway-border">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center space-x-2">
              <Binary className="w-4 h-4 text-cyan-400" />
              <span>Signed Number Representation &amp; Arithmetic Complements</span>
            </h3>
            <p className="text-xs text-railway-muted">
              8-Bit Sign-Magnitude, 1's Complement, and 2's Complement representation (-128 to +127)
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-slate-400">Signed Decimal:</span>
            <input
              type="number"
              min="-128"
              max="127"
              value={signedDec}
              onChange={(e) => setSignedDec(e.target.value)}
              className="w-24 px-3 py-1 rounded bg-railway-darker border border-railway-border text-white font-bold text-center focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-railway-darker border border-railway-border space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase">Sign-Magnitude (8-Bit)</span>
            <span className="text-base font-bold text-cyan-300">{signMag}</span>
            <span className="text-[10px] text-slate-500 block">MSB is sign (1=Neg, 0=Pos), 7 bits magnitude</span>
          </div>
          <div className="p-3.5 rounded-lg bg-railway-darker border border-railway-border space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase">1's Complement (8-Bit)</span>
            <span className="text-base font-bold text-amber-300">{onesComp}</span>
            <span className="text-[10px] text-slate-500 block">Negative obtained by bitwise inversion</span>
          </div>
          <div className="p-3.5 rounded-lg bg-railway-darker border border-railway-border space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase">2's Complement (8-Bit)</span>
            <span className="text-base font-bold text-emerald-400">{twosComp}</span>
            <span className="text-[10px] text-slate-500 block">1's complement + 1 (Used in CPUs/ALUs)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
