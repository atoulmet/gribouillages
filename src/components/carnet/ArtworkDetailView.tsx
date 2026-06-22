"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { Artwork } from "@/lib/notion";
import { formatFrenchDate } from "@/lib/format";
import { BlueStar } from "./Decorations";
import { tintFor, hatch } from "./style";

export default function ArtworkDetailView({ artwork }: { artwork: Artwork }) {
  const photos = artwork.photos;
  const count = photos.length;
  const hasCarousel = count > 1;
  const [i, setI] = useState(0);

  const go = useCallback(
    (delta: number) => {
      if (count === 0) return;
      setI((p) => (p + delta + count) % count);
    },
    [count],
  );

  // Flèches du clavier pour défiler les photos du projet.
  useEffect(() => {
    if (!hasCarousel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, hasCarousel]);

  const tint = tintFor(artwork.medium ?? "œuvre");
  const current = photos[i];

  return (
    <div className="cn-detail">
      {/* Colonne image */}
      <div className="cn-detail__imgcol">
        <span className="cn-tape" />
        <div className="cn-frame">
          <div className="cn-frame__media">
            {current ? (
              <Image
                src={current}
                alt={`${artwork.title} — photo ${i + 1}`}
                fill
                sizes="(max-width:860px) 90vw, 520px"
                priority
              />
            ) : (
              <div className="cn-card__hatch" style={{ background: hatch(tint) }}>
                <span style={{ color: tint.text }}>{artwork.medium ?? ""}</span>
              </div>
            )}
          </div>
          <div className="cn-frame__cap">
            planche — {artwork.title.toLowerCase()}
          </div>
        </div>

        {hasCarousel && (
          <div className="cn-thumbs">
            {photos.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setI(idx)}
                className={`cn-thumb ${idx === i ? "cn-thumb--active" : ""}`.trim()}
                aria-label={`Voir la photo ${idx + 1}`}
                aria-current={idx === i}
              >
                <Image src={p} alt={`${artwork.title} ${idx + 1}`} fill sizes="74px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Colonne texte */}
      <div className="cn-detail__textcol">
        <span className="cn-deco" style={{ right: -8, top: -14 }}>
          <BlueStar size={40} />
        </span>

        {artwork.medium && <span className="cn-badge">{artwork.medium}</span>}
        <h1 className="cn-title">{artwork.title}</h1>
        <div className="cn-date">{formatFrenchDate(artwork.date)}</div>

        {artwork.description && <p className="cn-desc">{artwork.description}</p>}

        <div className="cn-meta">
          {artwork.medium && <Row k="Médium" v={artwork.medium} />}
          {artwork.tags.length > 0 && (
            <Row k="Catégories" v={artwork.tags.join(", ")} />
          )}
          <Row
            k="Photos"
            v={`${count} image${count > 1 ? "s" : ""}`}
          />
        </div>

        {/* Carrousel : défile les photos de CE projet */}
        {hasCarousel && (
          <div className="cn-pager">
            <button
              type="button"
              onClick={() => go(-1)}
              className="cn-nav-btn"
              aria-label="Photo précédente"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="cn-nav-btn cn-nav-btn--filled"
              aria-label="Photo suivante"
            >
              →
            </button>
            <span className="cn-pager__count">
              photo {i + 1} sur {count}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="cn-meta__row">
      <span className="cn-meta__k">{k}</span>
      <span className="cn-meta__v">{v}</span>
    </div>
  );
}
