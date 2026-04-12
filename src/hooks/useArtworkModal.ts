"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useArtworkModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentId = searchParams.get("artwork");

  const openArtwork = (id: string) => {
    router.push(`/?artwork=${id}`, { scroll: false });
  };

  const closeArtwork = () => {
    router.push("/", { scroll: false });
  };

  return { currentId, openArtwork, closeArtwork };
}
