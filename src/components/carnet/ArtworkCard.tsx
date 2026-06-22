import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Artwork } from "@/lib/notion";
import { formatFrenchDate } from "@/lib/format";
import { Flower } from "./Decorations";
import { tintFor, hatch } from "./style";

export default function ArtworkCard({
  artwork,
  index,
  rotation,
}: {
  artwork: Artwork;
  index: number;
  rotation: number;
}) {
  const photo = artwork.photos[0];
  const medium = artwork.medium ?? "œuvre";
  const tint = tintFor(medium);
  const sub = [artwork.medium, formatFrenchDate(artwork.date)]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/carnet/${artwork.id}`}
      className="cn-card"
      style={{ "--rot": `${rotation}deg` } as CSSProperties}
    >
      <div className="cn-card__media">
        {photo ? (
          <Image
            src={photo}
            alt={artwork.title}
            fill
            sizes="(max-width:640px) 50vw, 280px"
          />
        ) : (
          <div className="cn-card__hatch" style={{ background: hatch(tint) }}>
            <span style={{ color: tint.text }}>{medium}</span>
          </div>
        )}
      </div>
      <div className="cn-card__body">
        <div>
          <div className="cn-card__title">{artwork.title}</div>
          {sub && <div className="cn-card__date">{sub}</div>}
        </div>
        {index % 4 === 0 && <Flower size={38} />}
      </div>
    </Link>
  );
}
