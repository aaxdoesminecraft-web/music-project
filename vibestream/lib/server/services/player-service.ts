import type { AppPlaybackItem, AppTrack } from "@/lib/types/music";
import type { PlayerBarViewModel } from "@/lib/types/view-models";

export type PlaybackSnapshot = {
  items: AppPlaybackItem[];
  currentTrackId: string | null;
  elapsedSeconds: number;
  volumePercent: number;
  isPlaying: boolean;
};

export class PlayerService {
  toPlayerBar(snapshot: PlaybackSnapshot): PlayerBarViewModel {
    const current =
      snapshot.items.find((item) => item.track.id === snapshot.currentTrackId) ??
      null;

    return {
      current,
      queueLength: snapshot.items.length,
      elapsedSeconds: snapshot.elapsedSeconds,
      durationSeconds: current?.track.durationSeconds ?? null,
      volumePercent: snapshot.volumePercent,
      isPlaying: snapshot.isPlaying,
    };
  }

  createPlaybackItems(tracks: AppTrack[], favoriteTrackIds: string[]): AppPlaybackItem[] {
    const likedIds = new Set(favoriteTrackIds);

    return tracks.map((track) => ({
      track,
      isLiked: likedIds.has(track.id),
    }));
  }
}
