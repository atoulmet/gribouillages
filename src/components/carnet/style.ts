// Constantes visuelles du design « Carnet » (client-safe).

// Rotation des cartes : le sens alterne d'un rang à l'autre (zigzag),
// avec une légère variation d'intensité par colonne pour l'effet scrapbook.
const MAGNITUDES = [2.6, 2, 3.2, 2.2, 2.8, 1.8];
export function rotationFor(index: number, cols: number): number {
  const c = Math.max(1, cols);
  const row = Math.floor(index / c);
  const col = index % c;
  const sign = row % 2 === 0 ? -1 : 1; // rang 1 vers la gauche, rang 2 vers la droite…
  return +(sign * MAGNITUDES[col % MAGNITUDES.length]).toFixed(2);
}

// Teintes des aplats hachurés (cartes sans photo), dérivées du médium.
const TINTS: { base: string; light: string; text: string }[] = [
  { base: "#cfe0ec", light: "#e7f0f6", text: "#79899a" },
  { base: "#f0d6cf", light: "#f8e8e2", text: "#b07a68" },
  { base: "#e9e2cf", light: "#f3eede", text: "#9a8e63" },
  { base: "#d3e6df", light: "#e6f1ec", text: "#5d9384" },
  { base: "#e3d8ef", light: "#efe7f6", text: "#8b6fc7" },
  { base: "#cfd9ec", light: "#e6ecf6", text: "#6f82a8" },
];

export function tintFor(key: string): { base: string; light: string; text: string } {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return TINTS[h % TINTS.length];
}

export function hatch(t: { base: string; light: string }): string {
  return `repeating-linear-gradient(135deg,${t.base},${t.base} 14px,${t.light} 14px,${t.light} 28px)`;
}
