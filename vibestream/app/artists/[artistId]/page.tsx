import { ArtistScreen } from "@/features/artist/artist-screen";
import { getArtistData } from "@/features/artist/get-artist-data";

type ArtistPageProps = {
  params: Promise<{ artistId: string }>;
};

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { artistId } = await params;
  const data = await getArtistData(artistId);
  return <ArtistScreen data={data} />;
}
