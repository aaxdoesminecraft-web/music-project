import type { NextRequest } from "next/server";
import { createBackendServices } from "@/lib/server";
import { handleRouteError, noContent } from "@/lib/server/http/responses";
import { resolveUserId } from "@/lib/server/http/user";
import { toAppArtistId } from "@/lib/utils/music-ids";

type Context = {
  params: Promise<{ artistId: string }>;
};

export async function POST(request: NextRequest, context: Context) {
  try {
    const userId = resolveUserId(request);
    const { artistId } = await context.params;
    const { userLibrary } = createBackendServices();
    await userLibrary.followArtist(userId, toAppArtistId(artistId), artistId);
    return noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const userId = resolveUserId(request);
    const { artistId } = await context.params;
    const { userLibrary } = createBackendServices();
    await userLibrary.unfollowArtist(userId, toAppArtistId(artistId));
    return noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
