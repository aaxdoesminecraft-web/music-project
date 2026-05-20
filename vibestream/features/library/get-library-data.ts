import { createBackendServices } from "@/lib/server";

export async function getLibraryData(query?: string) {
  const userId = process.env.DEV_USER_ID;

  if (!userId) {
    throw new Error("Missing DEV_USER_ID in .env.local.");
  }

  const { libraryService } = createBackendServices();
  return libraryService.getPageData(userId, {
    query,
    filter: "songs",
  });
}
