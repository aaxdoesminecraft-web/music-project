export type FavoriteTrackRow = {
  user_id: string;
  track_id: string;
  provider: string;
  provider_track_id: string;
  created_at: string;
};

export type FollowedArtistRow = {
  user_id: string;
  artist_id: string;
  provider: string;
  provider_artist_id: string;
  created_at: string;
};

export type RecentlyPlayedRow = {
  user_id: string;
  track_id: string;
  provider: string;
  provider_track_id: string;
  played_at: string;
};

export type PlaylistRow = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type PlaylistTrackRow = {
  playlist_id: string;
  track_id: string;
  provider: string;
  provider_track_id: string;
  position: number;
  added_at: string;
};

export type PlaybackQueueRow = {
  user_id: string;
  track_id: string;
  provider: string;
  provider_track_id: string;
  position: number;
  added_at: string;
};
