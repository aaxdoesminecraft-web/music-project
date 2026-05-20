import { headers } from "next/headers";
import { createBackendServices } from "@/lib/server";

export async function getDashboardData() {
  const headerStore = await headers();
  const headerUserId = headerStore.get("x-user-id");
  const userId = headerUserId || process.env.DEV_USER_ID;

  if (!userId) {
    throw new Error(
      "Missing user id. Set DEV_USER_ID in .env.local or provide x-user-id.",
    );
  }

  const { dashboardService } = createBackendServices();
  return dashboardService.getPageData(userId);
}
