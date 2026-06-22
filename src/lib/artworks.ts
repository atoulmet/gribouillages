import { promises as fs } from "fs";
import path from "path";
import type { Artwork } from "./notion";

// Lit le manifeste statique généré au build par scripts/fetch-content.ts.
// Côté serveur uniquement (utilise fs).
export async function getAllArtworks(): Promise<Artwork[]> {
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
