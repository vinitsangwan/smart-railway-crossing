/**
 * Karnaugh Map (K-Map) Solver and Visualizer
 * Implements 4-Variable (A, B, C, D) and 2-Variable (A, B) K-Maps
 * Standard Gray code sequences: [00, 01, 11, 10]
 */

export const GRAY_CODE_2BIT = ['00', '01', '11', '10'];

// Mapping grid coordinates [row][col] to minterm indices m0..m15
// Row index corresponds to AB: 0->00, 1->01, 2->11, 3->10
// Col index corresponds to CD: 0->00, 1->01, 2->11, 3->10
export const KMAP_4VAR_CELLS = [
  // AB = 00
  [{ m: 0, A: 0, B: 0, C: 0, D: 0 }, { m: 1, A: 0, B: 0, C: 0, D: 1 }, { m: 3, A: 0, B: 0, C: 1, D: 1 }, { m: 2, A: 0, B: 0, C: 1, D: 0 }],
  // AB = 01
  [{ m: 4, A: 0, B: 1, C: 0, D: 0 }, { m: 5, A: 0, B: 1, C: 0, D: 1 }, { m: 7, A: 0, B: 1, C: 1, D: 1 }, { m: 6, A: 0, B: 1, C: 1, D: 0 }],
  // AB = 11
  [{ m: 12, A: 1, B: 1, C: 0, D: 0 }, { m: 13, A: 1, B: 1, C: 0, D: 1 }, { m: 15, A: 1, B: 1, C: 1, D: 1 }, { m: 14, A: 1, B: 1, C: 1, D: 0 }],
  // AB = 10
  [{ m: 8, A: 1, B: 0, C: 0, D: 0 }, { m: 9, A: 1, B: 0, C: 0, D: 1 }, { m: 11, A: 1, B: 0, C: 1, D: 1 }, { m: 10, A: 1, B: 0, C: 1, D: 0 }]
];

export const KMAP_CONFIGS = {
  W: {
    name: 'Warning Request (W)',
    targetOutput: 'W',
    originalExpr: 'W = A + B + D',
    minterms: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    dontCares: [],
    maxterms: [0, 2],
    sopNotation: 'Σ m(1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)',
    posNotation: 'Π M(0, 2)',
    simplifiedSOP: 'W = A + B + D',
    groups: [
      {
        id: 'group_A',
        term: 'A',
        description: 'Octet (8-cell group): Rows AB=11 & AB=10 across all 4 columns',
        color: 'border-yellow-500 bg-yellow-500/20 text-yellow-300',
        cells: [8, 9, 10, 11, 12, 13, 14, 15]
      },
      {
        id: 'group_B',
        term: 'B',
        description: 'Octet (8-cell group): Rows AB=01 & AB=11 across all 4 columns',
        color: 'border-blue-500 bg-blue-500/20 text-blue-300',
        cells: [4, 5, 6, 7, 12, 13, 14, 15]
      },
      {
        id: 'group_D',
        term: 'D',
        description: 'Octet (8-cell group): Columns CD=01 & CD=11 across all 4 rows',
        color: 'border-red-500 bg-red-500/20 text-red-300',
        cells: [1, 3, 5, 7, 9, 11, 13, 15]
      }
    ],
    derivationSteps: [
      'Step 1: Plot all 14 1s into the 4×4 Karnaugh map matrix corresponding to truth table rows where W=1.',
      'Step 2: Identify largest power-of-two groupings (Octets = 8 adjacent cells).',
      'Step 3: Group A: Rows 3 & 4 (AB=11, 10) form an 8-cell block. In this block, A remains 1, while B, C, D vary between 0 and 1 -> Eliminates B, C, D -> Term: A.',
      'Step 4: Group B: Rows 2 & 3 (AB=01, 11) form an 8-cell block. Here, B remains 1, while A, C, D vary -> Eliminates A, C, D -> Term: B.',
      'Step 5: Group D: Columns 2 & 3 (CD=01, 11) form an 8-cell vertical block. Here, D remains 1, while A, B, C vary -> Eliminates A, B, C -> Term: D.',
      'Step 6: Combine prime implicants using OR: W = A + B + D (Minimal Sum of Products form).'
    ],
    deMorganNote: "Dual POS Form: Since W' = A'·B'·D', applying De Morgan's Law gives W = (A'·B'·D')' = A + B + D."
  },

  O: {
    name: 'Safe-to-Open Request (O)',
    targetOutput: 'O',
    originalExpr: "O = C · A' · B' · D'",
    minterms: [2],
    dontCares: [],
    maxterms: [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    sopNotation: 'Σ m(2)',
    posNotation: 'Π M(0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15)',
    simplifiedSOP: "O = A' · B' · C · D'",
    groups: [
      {
        id: 'group_single_m2',
        term: "A' · B' · C · D'",
        description: 'Single isolated 1-cell (no power-of-two adjacency with other 1s): Cell m2 (AB=00, CD=10)',
        color: 'border-emerald-500 bg-emerald-500/20 text-emerald-300',
        cells: [2]
      }
    ],
    derivationSteps: [
      'Step 1: Plot truth table outputs into K-map. Only 1 appears at cell m2 (A=0, B=0, C=1, D=0). All other 15 cells are 0.',
      'Step 2: Check for adjacent 1s. None exist, so cell m2 cannot be grouped into a pair, quad, or octet.',
      'Step 3: The essential prime implicant is the single minterm itself: A=0 (A\'), B=0 (B\'), C=1 (C), D=0 (D\').',
      "Step 4: Resulting expression: O = A' · B' · C · D' = C · A' · B' · D'."
    ],
    deMorganNote: "De Morgan's Equivalence: Notice that A' · B' · D' = (A + B + D)' = W'. Therefore, O = C · W' (Safe to Open iff Clear=1 AND Warning=0)."
  }
};
