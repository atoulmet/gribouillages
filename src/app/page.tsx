import { getAllArtworks } from "@/lib/artworks";
import CarnetShell from "@/components/carnet/CarnetShell";
import CarnetGallery from "@/components/carnet/CarnetGallery";

export default async function Home() {
  const artworks = await getAllArtworks();
  return (
    <CarnetShell>
      <CarnetGallery artworks={artworks} year={new Date().getFullYear()} />
    </CarnetShell>
  );
}
