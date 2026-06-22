import type { Metadata } from "next";
import "./carnet.css";
import { fredoka, caveat, spaceMono, hanken } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Carnet — Gribouillages",
  description: "Galerie carnet de croquis",
};

export default function CarnetLayout({
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
