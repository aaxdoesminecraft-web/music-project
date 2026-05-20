import type { NextRequest } from "next/server";
import { createBackendServices } from "@/lib/server";
import { HttpError } from "@/lib/server/http/errors";
import { handleRouteError, noContent } from "@/lib/server/http/responses";
import { resolveUserId } from "@/lib/server/http/user";
import { toAppTrackId } from "@/lib/utils/music-ids";

export async function POST(request: NextRequest) {
  try {
    const userId = resolveUserId(request);
    const body = (await request.json()) as { providerTrackId?: string };

    if (!body.providerTrackId) {
      throw new HttpError(400, "providerTrackId is required.");
    }

    const { userLibrary } = createBackendServices();
    await userLibrary.recordRecentlyPlayed({
      userId,
      trackId: toAppTrackId(body.providerTrackId),
      provider: "jamendo",
      providerTrackId: body.providerTrackId,
      playedAt: new Date().toISOString(),
    });

    return noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
