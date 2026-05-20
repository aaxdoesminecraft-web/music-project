"use client";

import { useEffect } from "react";
import type { AppTrack } from "@/lib/types/music";
import { usePlayer } from "@/components/player/player-provider";

type PlayerQueueSyncProps = {
  tracks: AppTrack[];
  startIndex?: number;
};

export function PlayerQueueSync({
  tracks,
  startIndex = 0,
}: PlayerQueueSyncProps) {
  const { queue, playQueue } = usePlayer();

  useEffect(() => {
    if (queue.length === 0 && tracks.length > 0) {
      playQueue(tracks, startIndex, false);
    }
  }, [queue.length, playQueue, startIndex, tracks]);

  return null;
}
