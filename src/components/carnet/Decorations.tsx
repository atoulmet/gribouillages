import type { CSSProperties } from "react";

// Petite fleur jaune (4 cercles + losange blanc), comme dans la maquette.
export function Flower({ size = 40 }: { size?: number }) {
  const d = size * 0.6;
  const dot = (extra: CSSProperties) => (
    <span
      style={{
        position: "absolute",
        width: d,
        height: d,
        borderRadius: "50%",
        background: "#f4b41a",
        ...extra,
      }}
    />
  );
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
        flex: "none",
      }}
    >
      {dot({ top: 0, left: 0 })}
      {dot({ top: 0, right: 0 })}
      {dot({ bottom: 0, left: 0 })}
      {dot({ bottom: 0, right: 0 })}
      <span
        style={{
          position: "absolute",
          width: size * 0.28,
          height: size * 0.28,
          background: "#fff",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%) rotate(45deg)",
        }}
      />
    </span>
  );
}

// Étoile / diamant bleu (clip-path), décoration flottante.
export function BlueStar({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`cn-star ${className}`.trim()}
      style={{ display: "inline-block", width: size, height: size }}
    />
  );
}
