import type { AppArtistId, AppTrackId, MusicProvider } from "@/lib/types/music";

export type UserId = string;
export type PlaylistId = string;

export type UserProfile = {
  id: UserId;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
};

export type AppPlaylist = {
  id: PlaylistId;
  userId: UserId;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AppPlaylistTrack = {
  playlistId: PlaylistId;
  trackId: AppTrackId;
  provider: MusicProvider;
  providerTrackId: string;
  position: number;
  addedAt: string;
};

export type FavoriteTrackRecord = {
  userId: UserId;
  trackId: AppTrackId;
  provider: MusicProvider;
  providerTrackId: string;
  createdAt: string;
};

export type FollowedArtistRecord = {
  userId: UserId;
  artistId: AppArtistId;
  provider: MusicProvider;
  providerArtistId: string;
  createdAt: string;
};

export type RecentlyPlayedRecord = {
  userId: UserId;
  trackId: AppTrackId;
  provider: MusicProvider;
  providerTrackId: string;
  playedAt: string;
};

export type DiscoveryZoneRecord = {
  id: string;
  slug: string;
  label: string;
  headline: string;
  description: string;
  x: number;
  y: number;
  tags: string[];
  accentColor: string;
};
