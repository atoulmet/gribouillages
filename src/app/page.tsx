"use client";

import Image from "next/image";
import { ComponentType, Suspense, SVGProps, useEffect, useState } from "react";
import Card from "@/components/Card";
import ArtworkModal from "@/components/ArtworkModal";
import { useArtworkModal } from "@/hooks/useArtworkModal";
import { Shape1, Shape2, Shape3, Shape4 } from "@/components/shapes";
import type { Artwork } from "@/lib/notion";

const shapes: { Shape: ComponentType<SVGProps<SVGSVGElement>>; color: string }[] = [
  { Shape: Shape1, color: "#FFC107" },
  { Shape: Shape2, color: "#F06120" },
  { Shape: Shape3, color: "#5B6CF5" },
  { Shape: Shape4, color: "#1DAA5C" },
];

const coverColors = [
  "bg-brand-violet",
  "bg-brand-sky",
  "bg-brand-salmon",
  "bg-brand-lavender",
];

function HomeContent() {
  const [phase, setPhase] = useState<"center" | "hiding" | "corner">("center");
  const [visibleCards, setVisibleCards] = useState(0);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const { currentId, openArtwork, closeArtwork } = useArtworkModal();

  // Fetch artworks from Notion
  useEffect(() => {
    fetch("/api/artworks")
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(setArtworks)
      .catch(() => setArtworks([]));
  }, []);

  // Si on arrive avec ?artwork=xxx, passer directement en phase corner
  useEffect(() => {
    if (currentId) {
      setPhase("corner");
    }
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (currentId) return;
      if (e.deltaY > 0 && phase === "center") {
        e.preventDefault();
        setPhase("hiding");
        setTimeout(() => {
          setPhase("corner");
          window.scrollTo(0, 0);
        }, 200);
      } else if (e.deltaY < 0 && phase === "corner") {
        setPhase("center");
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (currentId) return;
      if (
        (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") &&
        phase === "center"
      ) {
        setPhase("hiding");
        setTimeout(() => setPhase("corner"), 200);
      } else if (
        (e.key === "ArrowUp" || e.key === "PageUp") &&
        phase === "corner"
      ) {
        setPhase("center");
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [phase, currentId]);

  useEffect(() => {
    if (phase === "corner") {
      artworks.forEach((_, i) => {
        setTimeout(() => setVisibleCards(i + 1), 400 + i * 150);
      });
    } else {
      setVisibleCards(0);
    }
  }, [phase, artworks]);

  return (
    <>
      <div className="fixed inset-0 bg-[url('/background.svg')] bg-cover bg-center bg-no-repeat -z-10" />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 min-h-screen">
        {/* Logo centré */}
        <div
          className={`transition-all duration-200 [transition-timing-function:cubic-bezier(0.7,0,1,0.3)] hover:-translate-y-2 ${
            phase === "center"
              ? "scale-100 opacity-100"
              : "scale-0 opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src="/logo.svg"
            alt="Gribouillages"
            width={576}
            height={154}
            priority
          />
        </div>

        {/* Logo en haut à gauche */}
        <div
          className={`fixed top-4 left-4 z-50 transition-all duration-200 [transition-timing-function:cubic-bezier(0,0.7,0.3,1)] origin-top-left hover:-translate-y-1 ${
            phase === "corner"
              ? "scale-100 opacity-100"
              : "scale-0 opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src="/logo.svg"
            alt="Gribouillages"
            width={288}
            height={77}
          />
        </div>

        <p
          className={`mt-4 text-lg text-zinc-500 dark:text-zinc-400 bg-white px-3 py-1 rounded transition-opacity duration-200 ${
            phase === "center" ? "opacity-100" : "opacity-0"
          }`}
        >
          Mes derniers projets créatifs
        </p>

        {/* Cards grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 w-full max-w-[1200px] mx-[54px] ${
          phase !== "corner" ? "absolute opacity-0 pointer-events-none" : ""
        }`}>
          {artworks.map((artwork, i) => {
            const shape = shapes[i % shapes.length];
            const hasPhoto = artwork.photos.length > 0;
            return (
              <div
                key={artwork.id}
                className={`cursor-pointer transition-all duration-300 [transition-timing-function:cubic-bezier(0,0.7,0.3,1)] ${
                  i < visibleCards
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-6 scale-95 pointer-events-none"
                }`}
                onClick={() => openArtwork(artwork.id)}
              >
                <Card
                  cover={hasPhoto ? artwork.photos[0] : coverColors[i % coverColors.length]}
                  title={artwork.title}
                  date={artwork.date ?? ""}
                  Shape={shape.Shape}
                  shapeColor={shape.color}
                />
              </div>
            );
          })}
        </div>
      </main>

      {/* Modale */}
      {currentId && (
        <ArtworkModal id={currentId} onClose={closeArtwork} />
      )}
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
