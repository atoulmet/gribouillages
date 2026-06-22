/**
 * Pré-build : récupère les œuvres publiées depuis Notion, télécharge leurs
 * photos dans public/artworks/, et écrit un manifeste statique dans
 * src/data/artworks.json (avec des chemins d'images locaux).
 *
 * Lancé automatiquement avant `next dev` et `next build` (voir package.json).
 * Sur Vercel les variables d'env sont injectées au build ; en local elles sont
 * lues depuis .env.local.
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { promises as fs } from "fs";
import path from "path";
import { getPublishedArtworks, type Artwork } from "../src/lib/notion";

const IMAGES_DIR = path.join(process.cwd(), "public", "artworks");
const DATA_FILE = path.join(process.cwd(), "src", "data", "artworks.json");

const EXT_BY_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
};

function extFromUrl(url: string): string {
  try {
    const ext = path.extname(new URL(url).pathname).toLowerCase();
    if (ext && ext.length <= 5) return ext;
  } catch {
    // URL invalide, on retombera sur le content-type
  }
  return "";
}

async function downloadPhoto(
  url: string,
  destNoExt: string,
): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const ext =
      extFromUrl(url) ||
      EXT_BY_CONTENT_TYPE[(res.headers.get("content-type") ?? "").split(";")[0].trim()] ||
      ".jpg";
    const filename = `${path.basename(destNoExt)}${ext}`;
    await fs.writeFile(path.join(IMAGES_DIR, filename), buf);
    return `/artworks/${filename}`;
  } catch (e) {
    console.warn(`  ! échec téléchargement ${url} : ${(e as Error).message}`);
    return null;
  }
}

async function writeManifest(artworks: Artwork[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(artworks, null, 2) + "\n");
}

async function main() {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATASOURCE_ID) {
    console.warn(
      "⚠ NOTION_TOKEN / NOTION_DATASOURCE_ID manquants — manifeste vide.",
    );
    await writeManifest([]);
    return;
  }

  let artworks: Artwork[];
  try {
    artworks = await getPublishedArtworks();
  } catch (e) {
    console.error("⚠ Erreur Notion, manifeste vide :", (e as Error).message);
    await writeManifest([]);
    return;
  }

  // On repart d'un dossier d'images propre pour ne pas garder de fichiers obsolètes.
  await fs.rm(IMAGES_DIR, { recursive: true, force: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });

  let downloaded = 0;
  for (const art of artworks) {
    const localPhotos: string[] = [];
    for (let i = 0; i < art.photos.length; i++) {
      const local = await downloadPhoto(art.photos[i], `${art.id}-${i}`);
      if (local) {
        downloaded++;
        localPhotos.push(local);
      } else {
        // En cas d'échec, on garde l'URL Notion d'origine (valide ~1h).
        localPhotos.push(art.photos[i]);
      }
    }
    art.photos = localPhotos;
  }

  await writeManifest(artworks);
  console.log(
    `✓ ${artworks.length} œuvre(s), ${downloaded} image(s) téléchargée(s) → src/data/artworks.json`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
