// Constantes visuelles du design « Carnet » (client-safe).

// Effet collage désordonné : inclinaison et décalage vertical pseudo-aléatoires
// dérivés de l'identifiant de l'œuvre (déterministe → stable entre les rendus,
// mais sans motif régulier visible).
function hash(str: string, salt: number): number {
  let h = (2166136261 ^ salt) >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995) >>> 0;
  h ^= h >>> 15;
  return h >>> 0;
}

function unit(str: string, salt: number): number {
  return hash(str, salt) / 4294967295; // 0..1
}

export function scatterFor(id: string): { angle: number; marginTop: number } {
  let angle = (unit(id, 1) * 2 - 1) * 5; // -5°..+5°
  // Évite les cartes trop droites pour garder le côté « jeté ».
  if (Math.abs(angle) < 1.4) angle += angle >= 0 ? 1.4 : -1.4;
  const marginTop = Math.round(unit(id, 2) * 28); // 0..28px de décalage vertical
  return { angle: +angle.toFixed(2), marginTop };
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
