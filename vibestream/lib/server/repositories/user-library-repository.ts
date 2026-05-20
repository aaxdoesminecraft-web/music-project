import type {
  AppPlaylist,
  AppPlaylistTrack,
  DiscoveryZoneRecord,
  RecentlyPlayedRecord,
  UserId,
} from "@/lib/types/persistence";
import type { AppArtistId, AppPlaybackItem, AppTrackId } from "@/lib/types/music";

export interface UserLibraryRepository {
  listFavoriteTrackIds(userId: UserId): Promise<AppTrackId[]>;
  isTrackFavorited(userId: UserId, trackId: AppTrackId): Promise<boolean>;
  addFavoriteTrack(
    userId: UserId,
    trackId: AppTrackId,
    providerTrackId: string,
  ): Promise<void>;
  removeFavoriteTrack(userId: UserId, trackId: AppTrackId): Promise<void>;
  listRecentlyPlayed(userId: UserId, limit: number): Promise<RecentlyPlayedRecord[]>;
  recordRecentlyPlayed(record: RecentlyPlayedRecord): Promise<void>;
  listPlaylists(userId: UserId): Promise<AppPlaylist[]>;
  createPlaylist(
    input: Pick<AppPlaylist, "userId" | "name" | "description" | "coverImageUrl">,
  ): Promise<AppPlaylist>;
  listPlaylistTracks(playlistId: string): Promise<AppPlaylistTrack[]>;
  addPlaylistTrack(track: Omit<AppPlaylistTrack, "addedAt">): Promise<void>;
  removePlaylistTrack(playlistId: string, position: number): Promise<void>;
  isArtistFollowed(userId: UserId, artistId: AppArtistId): Promise<boolean>;
  followArtist(userId: UserId, artistId: AppArtistId, providerArtistId: string): Promise<void>;
  unfollowArtist(userId: UserId, artistId: AppArtistId): Promise<void>;
  getQueue(userId: UserId): Promise<AppPlaybackItem[]>;
  replaceQueue(
    userId: UserId,
    items: Array<{ trackId: AppTrackId; providerTrackId: string; position: number }>,
  ): Promise<void>;
}

export interface DiscoveryRepository {
  listZones(): Promise<DiscoveryZoneRecord[]>;
}
