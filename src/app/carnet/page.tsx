import { getAllArtworks } from "@/lib/artworks";
import CarnetGallery from "@/components/carnet/CarnetGallery";

export default async function CarnetPage() {
  const artworks = await getAllArtworks();
  return <CarnetGallery artworks={artworks} year={new Date().getFullYear()} />;
}
