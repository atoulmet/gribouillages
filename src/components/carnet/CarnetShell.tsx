import "./carnet.css";
import { fredoka, caveat, spaceMono, hanken } from "@/lib/fonts";

// Enveloppe commune au design « carnet » : fond beige + polices.
// Utilisée par la page d'accueil et les pages détail.
export default function CarnetShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`cn-page ${fredoka.variable} ${caveat.variable} ${spaceMono.variable} ${hanken.variable}`}
    >
      <div className="cn-shell">{children}</div>
    </div>
  );
}
