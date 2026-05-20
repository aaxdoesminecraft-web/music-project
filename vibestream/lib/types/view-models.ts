import type {
  AppAlbum,
  AppArtist,
  AppPlaybackItem,
  AppTrack,
  AppTrackId,
} from "@/lib/types/music";

export type PlayerBarViewModel = {
  current: AppPlaybackItem | null;
  queueLength: number;
  elapsedSeconds: number;
  durationSeconds: number | null;
  volumePercent: number;
  isPlaying: boolean;
};

export type DashboardCard = {
  id: string;
  title: string;
  subtitle: string;
  description?: string | null;
  imageUrl: string | null;
  href: string;
  track?: AppTrack | null;
};

export type DashboardPageData = {
  greeting: string;
  subtitle: string;
  recentlyPlayed: DashboardCard[];
  forYou: DashboardCard[];
  player: PlayerBarViewModel;
};

export type LibraryFilterKind = "playlists" | "songs" | "albums" | "artists";

export type LibraryTrackRow = {
  order: number;
  track: AppTrack;
  dateAddedLabel: string;
  isCurrent: boolean;
};

export type LibraryPageData = {
  title: string;
  statsLabel: string;
  searchPlaceholder: string;
  activeFilter: LibraryFilterKind;
  rows: LibraryTrackRow[];
  player: PlayerBarViewModel;
};

export type ArtistSpotlightPageData = {
  artist: AppArtist;
  heroImageUrl: string | null;
  latestRelease: AppAlbum | null;
  popularTracks: AppTrack[];
  isFollowing: boolean;
  player: PlayerBarViewModel;
};

export type DiscoveryZoneViewModel = {
  id: string;
  label: string;
  headline: string;
  description: string;
  x: number;
  y: number;
  accentColor: string;
  previewTrackIds: AppTrackId[];
  previewTracks?: AppTrack[];
};

export type DiscoveryMapPageData = {
  title: string;
  subtitle: string;
  liveLabel: string;
  zones: DiscoveryZoneViewModel[];
  highlightedTrack: AppTrack | null;
  player: PlayerBarViewModel;
};
