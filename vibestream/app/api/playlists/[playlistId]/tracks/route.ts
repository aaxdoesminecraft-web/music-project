import type { NextRequest } from "next/server";
import { createBackendServices } from "@/lib/server";
import { HttpError } from "@/lib/server/http/errors";
import { handleRouteError, noContent, ok } from "@/lib/server/http/responses";
import { toAppTrackId } from "@/lib/utils/music-ids";

type Context = {
  params: Promise<{ playlistId: string }>;
};

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { playlistId } = await context.params;
    const { userLibrary, catalog } = createBackendServices();
    const playlistTracks = await userLibrary.listPlaylistTracks(playlistId);
    const tracks = await catalog.getTracksByIds(
      playlistTracks.map((track) => track.providerTrackId),
    );

    return ok(
      playlistTracks.map((playlistTrack) => ({
        ...playlistTrack,
        track:
          tracks.find((track) => track.providerTrackId === playlistTrack.providerTrackId) ??
          null,
      })),
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest, context: Context) {
  try {
    const { playlistId } = await context.params;
    const body = (await request.json()) as {
      providerTrackId?: string;
      position?: number;
    };

    if (!body.providerTrackId) {
      throw new HttpError(400, "providerTrackId is required.");
    }

    const { userLibrary } = createBackendServices();
    const existing = await userLibrary.listPlaylistTracks(playlistId);
    const position = body.position ?? existing.length + 1;

    await userLibrary.addPlaylistTrack({
      playlistId,
      trackId: toAppTrackId(body.providerTrackId),
      provider: "jamendo",
      providerTrackId: body.providerTrackId,
      position,
    });

    return noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const { playlistId } = await context.params;
    const position = Number(request.nextUrl.searchParams.get("position"));

    if (!Number.isFinite(position)) {
      throw new HttpError(400, "position query param is required.");
    }

    const { userLibrary } = createBackendServices();
    await userLibrary.removePlaylistTrack(playlistId, position);
    return noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
