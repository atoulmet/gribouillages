import { promises as fs } from "fs";
import path from "path";
import HomeClient from "@/components/HomeClient";
import type { Artwork } from "@/lib/notion";

// Données générées au build par scripts/fetch-content.ts.
async function getArtworks(): Promise<Artwork[]> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "src", "data", "artworks.json"),
      "utf-8",
    );
    return JSON.parse(raw) as Artwork[];
  } catch {
    return [];
  }
}

export default async function Home() {
  const artworks = await getArtworks();
  return <HomeClient artworks={artworks} />;
}
