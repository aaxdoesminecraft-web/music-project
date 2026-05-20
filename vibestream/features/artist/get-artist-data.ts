import { createBackendServices } from "@/lib/server";

export async function getArtistData(artistId: string) {
  const userId = process.env.DEV_USER_ID;

  if (!userId) {
    throw new Error("Missing DEV_USER_ID in .env.local.");
  }

  const { artistSpotlightService } = createBackendServices();
  return artistSpotlightService.getPageData(userId, artistId);
}
