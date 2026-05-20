export type MusicProvider = "jamendo";

export type AppTrackId = `${MusicProvider}:${string}`;
export type AppArtistId = `${MusicProvider}-artist:${string}`;
export type AppAlbumId = `${MusicProvider}-album:${string}`;

export type AppTrack = {
  id: AppTrackId;
  provider: MusicProvider;
  providerTrackId: string;
  title: string;
  artistName: string;
  artistId?: AppArtistId;
  providerArtistId?: string;
  albumTitle?: string | null;
  albumId?: AppAlbumId;
  providerAlbumId?: string | null;
  coverImageUrl: string | null;
  audioStreamUrl: string;
  shareUrl: string | null;
  durationSeconds: number | null;
  genreTags: string[];
  language: string | null;
  releaseDate: string | null;
  streamable: boolean;
};

export type AppArtist = {
  id: AppArtistId;
  provider: MusicProvider;
  providerArtistId: string;
  name: string;
  imageUrl: string | null;
  coverImageUrl: string | null;
  shareUrl: string | null;
  verified: boolean;
  monthlyListeners?: number | null;
  bio?: string | null;
};

export type AppAlbum = {
  id: AppAlbumId;
  provider: MusicProvider;
  providerAlbumId: string;
  title: string;
  artistName: string;
  artistId?: AppArtistId;
  coverImageUrl: string | null;
  releaseDate: string | null;
};

export type AppPlaybackItem = {
  track: AppTrack;
  isLiked: boolean;
};

export type AppQueue = {
  currentTrackId: AppTrackId | null;
  items: AppPlaybackItem[];
};

export type TrackSearchQuery = {
  text?: string;
  search?: string;
  tags?: string[];
  fuzzyTags?: string[];
  featured?: boolean;
  artistId?: string;
  albumId?: string;
  limit?: number;
  offset?: number;
  order?: "popularity" | "latest" | "duration" | "name";
};

export type TrackSearchResult = {
  items: AppTrack[];
  total: number | null;
  nextOffset: number | null;
};
