import type { NextRequest } from "next/server";
import { createBackendServices } from "@/lib/server";
import { handleRouteError, ok } from "@/lib/server/http/responses";
import { resolveUserId } from "@/lib/server/http/user";
import type { LibraryFilterKind } from "@/lib/types/view-models";

export async function GET(request: NextRequest) {
  try {
    const userId = resolveUserId(request);
    const { libraryService } = createBackendServices();
    const query = request.nextUrl.searchParams.get("query") ?? undefined;
    const filter = (request.nextUrl.searchParams.get("filter") ??
      undefined) as LibraryFilterKind | undefined;
    const playlistId = request.nextUrl.searchParams.get("playlistId") ?? undefined;

    return ok(await libraryService.getPageData(userId, { query, filter, playlistId }));
  } catch (error) {
    return handleRouteError(error);
  }
}
