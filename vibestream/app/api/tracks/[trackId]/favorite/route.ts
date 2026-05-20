import type { NextRequest } from "next/server";
import { createBackendServices } from "@/lib/server";
import { handleRouteError, noContent } from "@/lib/server/http/responses";
import { resolveUserId } from "@/lib/server/http/user";
import { toAppTrackId } from "@/lib/utils/music-ids";

type Context = {
  params: Promise<{ trackId: string }>;
};

export async function POST(request: NextRequest, context: Context) {
  try {
    const userId = resolveUserId(request);
    const { trackId } = await context.params;
    const providerTrackId = request.nextUrl.searchParams.get("providerTrackId") ?? trackId;
    const { userLibrary } = createBackendServices();
    await userLibrary.addFavoriteTrack(userId, toAppTrackId(providerTrackId), providerTrackId);
    return noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const userId = resolveUserId(request);
    const { trackId } = await context.params;
    const providerTrackId = request.nextUrl.searchParams.get("providerTrackId") ?? trackId;
    const { userLibrary } = createBackendServices();
    await userLibrary.removeFavoriteTrack(userId, toAppTrackId(providerTrackId));
    return noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
