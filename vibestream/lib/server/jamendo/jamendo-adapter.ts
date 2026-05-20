import type { AppAlbum, AppArtist, AppTrack, TrackSearchQuery, TrackSearchResult } from "@/lib/types/music";
import type { MusicCatalogAdapter } from "@/lib/server/music-catalog-adapter";
import { getJamendoConfig, type JamendoConfig } from "@/lib/server/config";
import { toAppAlbumId, toAppArtistId, toAppTrackId } from "@/lib/utils/music-ids";
import type {
  JamendoAlbum,
  JamendoArtist,
  JamendoListResponse,
  JamendoTrack,
} from "@/lib/server/jamendo/types";

function asString(value: string | number | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return String(value);
}

function mapTrack(raw: JamendoTrack): AppTrack {
  const providerTrackId = String(raw.id);
  const providerArtistId = asString(raw.artist_id);
  const providerAlbumId = asString(raw.album_id);

  return {
    id: toAppTrackId(providerTrackId),
    provider: "jamendo",
    providerTrackId,
    title: raw.name ?? "",
    artistName: raw.artist_name ?? "",
    artistId: providerArtistId ? toAppArtistId(providerArtistId) : undefined,
    providerArtistId,
    albumTitle: raw.album_name ?? null,
    albumId: providerAlbumId ? toAppAlbumId(providerAlbumId) : undefined,
    providerAlbumId: providerAlbumId ?? null,
    coverImageUrl: raw.image || raw.album_image || null,
    audioStreamUrl: raw.audio ?? "",
    shareUrl: raw.shareurl ?? null,
    durationSeconds: typeof raw.duration === "number" ? raw.duration : null,
    genreTags: raw.musicinfo?.tags?.genres ?? [],
    language: raw.musicinfo?.lang ?? null,
    releaseDate: raw.releasedate ?? null,
    streamable: Boolean(raw.audio),
  };
}

function mapArtist(raw: JamendoArtist): AppArtist {
  const providerArtistId = String(raw.id);

  return {
    id: toAppArtistId(providerArtistId),
    provider: "jamendo",
    providerArtistId,
    name: raw.name ?? "",
    imageUrl: raw.image ?? null,
    coverImageUrl: raw.image ?? null,
    shareUrl: raw.shareurl ?? null,
    verified: false,
    monthlyListeners: null,
    bio: null,
  };
}

function mapAlbum(raw: JamendoAlbum): AppAlbum {
  const providerAlbumId = String(raw.id);
  const providerArtistId = asString(raw.artist_id);

  return {
    id: toAppAlbumId(providerAlbumId),
    provider: "jamendo",
    providerAlbumId,
    title: raw.name ?? "",
    artistName: raw.artist_name ?? "",
    artistId: providerArtistId ? toAppArtistId(providerArtistId) : undefined,
    coverImageUrl: raw.image ?? null,
    releaseDate: raw.releasedate ?? null,
  };
}

export class JamendoAdapter implements MusicCatalogAdapter {
  private readonly config: JamendoConfig;

  constructor(config: JamendoConfig = getJamendoConfig()) {
    this.config = config;
  }

  async searchTracks(query: TrackSearchQuery): Promise<TrackSearchResult> {
    const response = await this.getList<JamendoTrack>("tracks", {
      namesearch: query.text,
      search: query.search,
      tags: query.tags?.join(","),
      fuzzytags: query.fuzzyTags?.join(","),
      featured: query.featured ? "1" : undefined,
      artist_id: query.artistId,
      album_id: query.albumId,
      limit: String(query.limit ?? 20),
      offset: String(query.offset ?? 0),
      order: this.mapTrackOrder(query.order),
    });

    return this.toTrackSearchResult(response, query.offset ?? 0, query.limit ?? 20);
  }

  async getTrack(providerTrackId: string): Promise<AppTrack | null> {
    const response = await this.getList<JamendoTrack>("tracks", {
      id: providerTrackId,
      limit: "1",
    });

    return response.results[0] ? mapTrack(response.results[0]) : null;
  }

  async getTracksByIds(providerTrackIds: string[]): Promise<AppTrack[]> {
    if (providerTrackIds.length === 0) {
      return [];
    }

    const response = await this.getList<JamendoTrack>("tracks", {
      id: providerTrackIds.join(","),
      limit: String(providerTrackIds.length),
    });

    return response.results.map(mapTrack);
  }

  async getTracksByArtist(
    providerArtistId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<TrackSearchResult> {
    const limit = options?.limit ?? 10;
    const offset = options?.offset ?? 0;
    const response = await this.getList<JamendoTrack>("artists/tracks", {
      id: providerArtistId,
      limit: String(limit),
      offset: String(offset),
      order: "popularity_total_desc",
    });

    return this.toTrackSearchResult(response, offset, limit);
  }

  async getTracksByAlbum(
    providerAlbumId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<TrackSearchResult> {
    const limit = options?.limit ?? 10;
    const offset = options?.offset ?? 0;
    const response = await this.getList<JamendoTrack>("albums/tracks", {
      id: providerAlbumId,
      limit: String(limit),
      offset: String(offset),
    });

    return this.toTrackSearchResult(response, offset, limit);
  }

  async getArtist(providerArtistId: string): Promise<AppArtist | null> {
    const response = await this.getList<JamendoArtist>("artists", {
      id: providerArtistId,
      limit: "1",
    });

    return response.results[0] ? mapArtist(response.results[0]) : null;
  }

  async getArtistAlbums(
    providerArtistId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<AppAlbum[]> {
    const response = await this.getList<JamendoAlbum>("artists/albums", {
      id: providerArtistId,
      limit: String(options?.limit ?? 10),
      offset: String(options?.offset ?? 0),
      order: "album_releasedate_desc",
    });

    return response.results.map(mapAlbum);
  }

  private async getList<T>(
    path: string,
    params: Record<string, string | undefined>,
  ): Promise<JamendoListResponse<T>> {
    if (!this.config.clientId) {
      throw new Error("Missing JAMENDO_CLIENT_ID");
    }

    const normalizedBase = this.config.baseUrl.endsWith("/")
      ? this.config.baseUrl
      : `${this.config.baseUrl}/`;
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    const url = new URL(normalizedPath, normalizedBase);
    url.searchParams.set("client_id", this.config.clientId);
    url.searchParams.set("format", "json");
    url.searchParams.set("audioformat", this.config.audioFormat);
    url.searchParams.set("imagesize", String(this.config.imageSize));
    url.searchParams.set("include", "musicinfo");

    for (const [key, value] of Object.entries(params)) {
      if (value) {
        url.searchParams.set(key, value);
      }
    }

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Jamendo request failed with status ${response.status}`);
    }

    return (await response.json()) as JamendoListResponse<T>;
  }

  private toTrackSearchResult(
    response: JamendoListResponse<JamendoTrack>,
    offset: number,
    limit: number,
  ): TrackSearchResult {
    const total = response.headers.results_fullcount ?? null;
    const nextOffset =
      total !== null && offset + response.results.length < total
        ? offset + limit
        : null;

    return {
      items: response.results.map(mapTrack),
      total,
      nextOffset,
    };
  }

  private mapTrackOrder(order: TrackSearchQuery["order"]): string | undefined {
    switch (order) {
      case "duration":
        return "duration_desc";
      case "latest":
        return "releasedate_desc";
      case "name":
        return "name_asc";
      case "popularity":
        return "popularity_total_desc";
      default:
        return undefined;
    }
  }
}
