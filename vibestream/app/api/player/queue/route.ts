import type { NextRequest } from "next/server";
import { createBackendServices } from "@/lib/server";
import { HttpError } from "@/lib/server/http/errors";
import { handleRouteError, noContent, ok } from "@/lib/server/http/responses";
import { resolveUserId } from "@/lib/server/http/user";
import { toAppTrackId } from "@/lib/utils/music-ids";

export async function GET(request: NextRequest) {
  try {
    const userId = resolveUserId(request);
    const { userLibrary } = createBackendServices();
    return ok(await userLibrary.getQueue(userId));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = resolveUserId(request);
    const body = (await request.json()) as {
      items?: Array<{ providerTrackId: string }>;
    };

    if (!body.items || !Array.isArray(body.items)) {
      throw new HttpError(400, "items array is required.");
    }

    const { userLibrary } = createBackendServices();
    await userLibrary.replaceQueue(
      userId,
      body.items.map((item, index) => ({
        trackId: toAppTrackId(item.providerTrackId),
        providerTrackId: item.providerTrackId,
        position: index + 1,
      })),
    );

    return noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
