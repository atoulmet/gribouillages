import { getAllArtworks } from "@/lib/artworks";
import HomeClient from "@/components/HomeClient";

// Ancienne page d'accueil (animation logo + grille + modale).
export default async function OldHome() {
  const artworks = await getAllArtworks();
  return <HomeClient artworks={artworks} />;
}
