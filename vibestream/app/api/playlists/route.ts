import type { NextRequest } from "next/server";
import { createBackendServices } from "@/lib/server";
import { HttpError } from "@/lib/server/http/errors";
import { created, handleRouteError, ok } from "@/lib/server/http/responses";
import { resolveUserId } from "@/lib/server/http/user";

export async function GET(request: NextRequest) {
  try {
    const userId = resolveUserId(request);
    const { userLibrary } = createBackendServices();
    return ok(await userLibrary.listPlaylists(userId));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = resolveUserId(request);
    const body = (await request.json()) as {
      name?: string;
      description?: string | null;
      coverImageUrl?: string | null;
    };

    if (!body.name?.trim()) {
      throw new HttpError(400, "Playlist name is required.");
    }

    const { userLibrary } = createBackendServices();
    const playlist = await userLibrary.createPlaylist({
      userId,
      name: body.name.trim(),
      description: body.description ?? null,
      coverImageUrl: body.coverImageUrl ?? null,
    });

    return created(playlist);
  } catch (error) {
    return handleRouteError(error);
  }
}
