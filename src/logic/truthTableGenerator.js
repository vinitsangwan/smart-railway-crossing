/**
 * Truth Table Generator for 4-Variable DELD System (A, B, C, D)
 * Evaluates W = A + B + D, G = A + B + D, O = C · A' · B' · D'
 */

import { evaluateExpressions } from './booleanFunctions';

export function generateTruthTable() {
  const rows = [];

  for (let i = 0; i < 16; i++) {
    // 4-bit binary representation: A B C D (MSB to LSB)
    const A = (i >> 3) & 1;
    const B = (i >> 2) & 1;
    const C = (i >> 1) & 1;
    const D = i & 1;

    const evaluation = evaluateExpressions(A, B, C, D);

    // Minterm designation m0 to m15
    const minterm = `m${i}`;
    const binary = `${A}${B}${C}${D}`;

    // Operating condition explanation
    let description = 'Idle / Quiescent';
    if (D === 1) description = 'Emergency / Fault Active';
    else if (B === 1) description = 'Crossing Occupied';
    else if (A === 1 && C === 1) description = 'Conflicting Approach + Clear';
    else if (A === 1) description = 'Train Approaching';
    else if (C === 1) description = 'Train Clear Safe Condition';

    rows.push({
      index: i,
      minterm,
      binary,
      A,
      B,
      C,
      D,
      W: evaluation.outputs.W,
      G: evaluation.outputs.G,
      O: evaluation.outputs.O,
      description,
      isSafeToOpen: evaluation.outputs.O === 1,
      isWarningActive: evaluation.outputs.W === 1,
      isGateCloseReq: evaluation.outputs.G === 1
    });
  }

  return rows;
}

export const generateFullTruthTable = generateTruthTable;

export function exportTruthTableToCSV(tableData) {
  const headers = ['Minterm', 'Binary (ABCD)', 'A (Approach)', 'B (Occupied)', 'C (Clear)', 'D (Emergency)', 'W (Warning)', 'G (Gate Close)', 'O (Safe Open)', 'Condition'];
  const csvRows = [headers.join(',')];

  tableData.forEach(row => {
    csvRows.push([
      row.minterm,
      `"${row.binary}"`,
      row.A,
      row.B,
      row.C,
      row.D,
      row.W,
      row.G,
      row.O,
      `"${row.description}"`
    ].join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'railway_crossing_truth_table.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
