import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllArtworks } from "@/lib/artworks";
import { formatFrenchDate } from "@/lib/format";
import Logo from "@/components/carnet/Logo";
import { BlueStar } from "@/components/carnet/Decorations";
import { tintFor, hatch } from "@/components/carnet/style";

export async function generateStaticParams() {
  const artworks = await getAllArtworks();
  return artworks.map((a) => ({ id: a.id }));
}

export default async function ArtworkDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artworks = await getAllArtworks();
  const idx = artworks.findIndex((a) => a.id === id);
  if (idx === -1) notFound();

  const art = artworks[idx];
  const prev = artworks[(idx - 1 + artworks.length) % artworks.length];
  const next = artworks[(idx + 1) % artworks.length];
  const tint = tintFor(art.medium ?? "œuvre");
  const cover = art.photos[0];

  return (
    <div className="cn-panel">
      <span className="cn-deco cn-floaty" style={{ right: 36, top: 30 }}>
        <BlueStar size={34} />
      </span>

      {/* Barre du haut */}
      <div className="cn-topbar">
        <Link href="/carnet" className="cn-back">
          ← Retour à la galerie
        </Link>
        <Logo size={24} />
      </div>

      <div className="cn-detail">
        {/* Colonne image */}
        <div className="cn-detail__imgcol">
          <span className="cn-tape" />
          <div className="cn-frame">
            <div className="cn-frame__media">
              {cover ? (
                <Image
                  src={cover}
                  alt={art.title}
                  fill
                  sizes="(max-width:860px) 90vw, 520px"
                  priority
                />
              ) : (
                <div
                  className="cn-card__hatch"
                  style={{ background: hatch(tint) }}
                >
                  <span style={{ color: tint.text }}>{art.medium ?? ""}</span>
                </div>
              )}
            </div>
            <div className="cn-frame__cap">
              planche — {art.title.toLowerCase()}
            </div>
          </div>

          {art.photos.length > 1 && (
            <div className="cn-thumbs">
              {art.photos.map((p, i) => (
                <div key={i} className="cn-thumb">
                  <Image src={p} alt={`${art.title} ${i + 1}`} fill sizes="74px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Colonne texte */}
        <div className="cn-detail__textcol">
          <span className="cn-deco" style={{ right: -8, top: -14 }}>
            <BlueStar size={40} />
          </span>

          {art.medium && <span className="cn-badge">{art.medium}</span>}
          <h1 className="cn-title">{art.title}</h1>
          <div className="cn-date">{formatFrenchDate(art.date)}</div>

          {art.description && <p className="cn-desc">{art.description}</p>}

          <div className="cn-meta">
            {art.medium && <Row k="Médium" v={art.medium} />}
            {art.tags.length > 0 && <Row k="Catégories" v={art.tags.join(", ")} />}
            <Row
              k="Photos"
              v={`${art.photos.length} image${art.photos.length > 1 ? "s" : ""}`}
            />
          </div>

          {/* Navigation */}
          <div className="cn-pager">
            <Link
              href={`/carnet/${prev.id}`}
              className="cn-nav-btn"
              aria-label="Œuvre précédente"
            >
              ←
            </Link>
            <Link
              href={`/carnet/${next.id}`}
              className="cn-nav-btn cn-nav-btn--filled"
              aria-label="Œuvre suivante"
            >
              →
            </Link>
            <span className="cn-pager__count">
              œuvre {idx + 1} sur {artworks.length}
            </span>
          </div>
        </div>
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
