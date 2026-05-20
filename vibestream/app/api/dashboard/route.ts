import type { NextRequest } from "next/server";
import { createBackendServices } from "@/lib/server";
import { handleRouteError, ok } from "@/lib/server/http/responses";
import { resolveUserId } from "@/lib/server/http/user";

export async function GET(request: NextRequest) {
  try {
    const userId = resolveUserId(request);
    const { dashboardService } = createBackendServices();
    return ok(await dashboardService.getPageData(userId));
  } catch (error) {
    return handleRouteError(error);
  }
}
