import type { NextRequest } from "next/server";
import { HttpError } from "@/lib/server/http/errors";

export function resolveUserId(request: NextRequest): string {
  const fromHeader = request.headers.get("x-user-id");
  const fromQuery = request.nextUrl.searchParams.get("userId");
  const fallback = process.env.DEV_USER_ID;
  const userId = fromHeader || fromQuery || fallback;

  if (!userId) {
    throw new HttpError(
      400,
      "Missing user id. Provide x-user-id header or DEV_USER_ID in the environment.",
    );
  }

  return userId;
}
