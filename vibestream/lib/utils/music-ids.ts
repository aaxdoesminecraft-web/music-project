import type { AppAlbumId, AppArtistId, AppTrackId } from "@/lib/types/music";

export function toAppTrackId(providerTrackId: string): AppTrackId {
  return `jamendo:${providerTrackId}`;
}

export function toAppArtistId(providerArtistId: string): AppArtistId {
  return `jamendo-artist:${providerArtistId}`;
}

export function toAppAlbumId(providerAlbumId: string): AppAlbumId {
  return `jamendo-album:${providerAlbumId}`;
}
