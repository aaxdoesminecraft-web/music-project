import type {
  AppAlbum,
  AppArtist,
  AppTrack,
  TrackSearchQuery,
  TrackSearchResult,
} from "@/lib/types/music";

export interface MusicCatalogAdapter {
  searchTracks(query: TrackSearchQuery): Promise<TrackSearchResult>;
  getTrack(providerTrackId: string): Promise<AppTrack | null>;
  getTracksByIds(providerTrackIds: string[]): Promise<AppTrack[]>;
  getTracksByArtist(
    providerArtistId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<TrackSearchResult>;
  getTracksByAlbum(
    providerAlbumId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<TrackSearchResult>;
  getArtist(providerArtistId: string): Promise<AppArtist | null>;
  getArtistAlbums(
    providerArtistId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<AppAlbum[]>;
}
