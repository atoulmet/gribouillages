"use client";

import { useEffect, useState, useCallback } from "react";
import type { Artwork } from "@/lib/notion";

interface ArtworkModalProps {
  artwork: Artwork | undefined;
  onClose: () => void;
}

export default function ArtworkModal({ artwork, onClose }: ArtworkModalProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  // Animate in on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  // ESC to close + navigation clavier dans le carrousel
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (!artwork?.photos.length) return;
      if (e.key === "ArrowLeft") setPhotoIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight")
        setPhotoIndex((i) => Math.min(artwork.photos.length - 1, i + 1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose, artwork]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-200 ${
        visible ? "bg-black/50 backdrop-blur-sm" : "bg-black/0 backdrop-blur-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white border-[6px] border-brand-black w-full max-w-2xl mx-6 max-h-[85vh] overflow-y-auto transition-all duration-200 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {artwork ? (
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-display text-[36px] font-medium leading-tight">
                  {artwork.title}
                </h2>
                <p className="text-[24px] text-zinc-400">{artwork.date}</p>
              </div>
              <button
                onClick={handleClose}
                className="text-zinc-400 hover:text-brand-black transition-colors text-2xl leading-none p-1"
              >
                &times;
              </button>
            </div>

            {/* Carrousel */}
            {artwork.photos.length > 0 && (
              <div className="relative mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artwork.photos[photoIndex]}
                  alt={`${artwork.title} - ${photoIndex + 1}`}
                  className="w-full aspect-[4/3] object-cover"
                />
                {artwork.photos.length > 1 && (
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => setPhotoIndex((i) => Math.max(0, i - 1))}
                      disabled={photoIndex === 0}
                      className="text-sm text-zinc-400 hover:text-brand-black disabled:opacity-30"
                    >
                      &larr; Précédent
                    </button>
                    <span className="text-sm text-zinc-400">
                      {photoIndex + 1} / {artwork.photos.length}
                    </span>
                    <button
                      onClick={() =>
                        setPhotoIndex((i) =>
                          Math.min(artwork.photos.length - 1, i + 1)
                        )
                      }
                      disabled={photoIndex === artwork.photos.length - 1}
                      className="text-sm text-zinc-400 hover:text-brand-black disabled:opacity-30"
                    >
                      Suivant &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Medium badge */}
            {artwork.medium && (
              <span className="inline-block bg-brand-lavender text-brand-black text-sm px-3 py-1 mb-4">
                {artwork.medium}
              </span>
            )}

            {/* Tags */}
            {artwork.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {artwork.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm text-zinc-500 border border-zinc-200 px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-zinc-600 leading-relaxed">
              {artwork.description}
            </p>
          </div>
        ) : (
          <div className="p-8 text-zinc-400">Œuvre introuvable.</div>
        )}
      </div>
    </div>
  );
}
