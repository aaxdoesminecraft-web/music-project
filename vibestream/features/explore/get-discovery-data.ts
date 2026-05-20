import { createBackendServices } from "@/lib/server";

export async function getDiscoveryData() {
  const userId = process.env.DEV_USER_ID;

  if (!userId) {
    throw new Error("Missing DEV_USER_ID in .env.local.");
  }

  const { discoveryMapService } = createBackendServices();
  return discoveryMapService.getPageData(userId);
}
