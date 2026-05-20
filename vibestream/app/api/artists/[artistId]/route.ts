import type { NextRequest } from "next/server";
import { createBackendServices } from "@/lib/server";
import { handleRouteError, ok } from "@/lib/server/http/responses";
import { resolveUserId } from "@/lib/server/http/user";

type Context = {
  params: Promise<{ artistId: string }>;
};

export async function GET(request: NextRequest, context: Context) {
  try {
    const userId = resolveUserId(request);
    const { artistId } = await context.params;
    const { artistSpotlightService } = createBackendServices();
    return ok(await artistSpotlightService.getPageData(userId, artistId));
  } catch (error) {
    return handleRouteError(error);
  }
}
