import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArtworks } from "@/lib/artworks";
import Logo from "@/components/carnet/Logo";
import { BlueStar } from "@/components/carnet/Decorations";
import ArtworkDetailView from "@/components/carnet/ArtworkDetailView";

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
  const art = artworks.find((a) => a.id === id);
  if (!art) notFound();

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

      <ArtworkDetailView artwork={art} />
    </div>
  );
}
