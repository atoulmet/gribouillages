// Logo « Gribouillages » avec le blob violet manuscrit derrière.
export default function Logo({ size = 38 }: { size?: number }) {
  return (
    <span className="cn-logo" style={{ fontSize: size }}>
      <span>Gribouillages</span>
    </span>
  );
}
