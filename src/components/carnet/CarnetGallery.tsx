"use client";

import { useMemo, useState } from "react";
import type { Artwork } from "@/lib/notion";
import ArtworkCard from "./ArtworkCard";
import Logo from "./Logo";
import { BlueStar } from "./Decorations";

export default function CarnetGallery({
  artworks,
  year,
}: {
  artworks: Artwork[];
  year: number;
}) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    artworks.forEach((a) => {
      if (a.medium) set.add(a.medium);
    });
    return Array.from(set);
  }, [artworks]);

  const [active, setActive] = useState<string>("Tout");
  const filtered =
    active === "Tout" ? artworks : artworks.filter((a) => a.medium === active);

  return (
    <div className="cn-panel">
      <span className="cn-deco cn-floaty" style={{ right: 30, top: 26 }}>
        <BlueStar size={34} />
      </span>
      <span
        className="cn-deco cn-floaty"
        style={{ left: 18, bottom: 140, animationDelay: ".6s" }}
      >
        <BlueStar size={22} />
      </span>

      {/* Nav */}
      <div className="cn-nav">
        <Logo size={38} />
        <div className="cn-nav__links">
          <span>Galerie</span>
          <span className="muted">À propos</span>
          <span className="muted">Contact</span>
          <span className="cn-count">
            {artworks.length} œuvre{artworks.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Sous-titre + filtres */}
      <div className="cn-head">
        <div className="cn-sub">mes dernières œuvres d&apos;art ✦</div>
        {categories.length > 0 && (
          <div className="cn-filters">
            <Pill
              label="Tout"
              active={active === "Tout"}
              onClick={() => setActive("Tout")}
            />
            {categories.map((c) => (
              <Pill
                key={c}
                label={c}
                active={active === c}
                onClick={() => setActive(c)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Grille */}
      {filtered.length > 0 ? (
        <div className="cn-grid">
          {filtered.map((a, i) => (
            <ArtworkCard key={a.id} artwork={a} index={i} />
          ))}
        </div>
      ) : (
        <div className="cn-empty">
          Aucune œuvre pour l&apos;instant. Ajoute-en dans Notion ✦
        </div>
      )}

      {/* Footer */}
      <div className="cn-footer">
        <span>fait à la main, à Paris ♥</span>
        <span className="mono">© Gribouillages {year}</span>
      </div>
    </div>
  );
}

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cn-pill ${active ? "cn-pill--active" : ""}`.trim()}
    >
      {label}
    </button>
  );
}
