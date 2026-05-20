"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AppTrack } from "@/lib/types/music";

type PlayerContextValue = {
  queue: AppTrack[];
  currentIndex: number;
  currentTrack: AppTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playTrack: (track: AppTrack, queue?: AppTrack[]) => void;
  playQueue: (queue: AppTrack[], startIndex?: number, autoplay?: boolean) => void;
  togglePlayback: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

function dedupeQueue(queue: AppTrack[]) {
  const seen = new Set<string>();
  return queue.filter((track) => {
    if (seen.has(track.id)) {
      return false;
    }

    seen.add(track.id);
    return true;
  });
}

async function postJson(url: string, payload: unknown) {
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Ignore telemetry failures during local development.
  }
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastRecordedTrackId = useRef<string | null>(null);
  const [queue, setQueue] = useState<AppTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.72);

  const currentTrack = queue[currentIndex] ?? null;

  const queueRef = useRef<AppTrack[]>(queue);
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    queueRef.current = queue;
    currentIndexRef.current = currentIndex;
  }, [queue, currentIndex]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

    const handleEnded = () => {
      setCurrentTime(0);
      setDuration(0);
      setCurrentIndex((index) => {
        if (index < queueRef.current.length - 1) {
          setIsPlaying(true);
          return index + 1;
        }

        setIsPlaying(false);
        return index;
      });
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) {
      return;
    }

    if (audio.src !== currentTrack.audioStreamUrl) {
      audio.src = currentTrack.audioStreamUrl;
      audio.load();
      setCurrentTime(0);
      setDuration(currentTrack.durationSeconds ?? 0);
    }

    if (isPlaying) {
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!currentTrack || lastRecordedTrackId.current === currentTrack.id) {
      return;
    }

    lastRecordedTrackId.current = currentTrack.id;
    void postJson("/api/player/recently-played", {
      providerTrackId: currentTrack.providerTrackId,
    });
  }, [currentTrack]);

  useEffect(() => {
    if (queue.length === 0) {
      return;
    }

    void postJson("/api/player/queue", {
      items: queue.map((track) => ({
        providerTrackId: track.providerTrackId,
      })),
    });
  }, [queue]);

  const value = useMemo<PlayerContextValue>(
    () => ({
      queue,
      currentIndex,
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      playTrack: (track, nextQueue) => {
        const normalizedQueue = dedupeQueue(nextQueue ?? [track]);
        const nextIndex = normalizedQueue.findIndex((item) => item.id === track.id);
        setQueue(normalizedQueue);
        setCurrentIndex(nextIndex === -1 ? 0 : nextIndex);
        setIsPlaying(true);
      },
      playQueue: (nextQueue, startIndex = 0, autoplay = true) => {
        const normalizedQueue = dedupeQueue(nextQueue);
        setQueue(normalizedQueue);
        setCurrentIndex(Math.max(0, Math.min(startIndex, normalizedQueue.length - 1)));
        setIsPlaying(autoplay && normalizedQueue.length > 0);
      },
      togglePlayback: () => {
        const audio = audioRef.current;
        if (!audio || !currentTrack) {
          return;
        }

        if (audio.paused) {
          setIsPlaying(true);
          void audio.play().catch(() => {
            setIsPlaying(false);
          });
        } else {
          audio.pause();
          setIsPlaying(false);
        }
      },
      playNext: () => {
        setCurrentIndex((index) => {
          if (index >= queue.length - 1) {
            return index;
          }

          return index + 1;
        });
        setIsPlaying(true);
      },
      playPrevious: () => {
        const audio = audioRef.current;

        if (audio && audio.currentTime > 5) {
          audio.currentTime = 0;
          setCurrentTime(0);
          return;
        }

        setCurrentIndex((index) => Math.max(0, index - 1));
        setIsPlaying(true);
      },
      seekTo: (seconds) => {
        const audio = audioRef.current;
        if (!audio) {
          return;
        }

        audio.currentTime = seconds;
        setCurrentTime(seconds);
      },
      setVolume: (nextVolume) => {
        const clamped = Math.max(0, Math.min(nextVolume, 1));
        setVolumeState(clamped);
      },
    }),
    [queue, currentIndex, currentTrack, isPlaying, currentTime, duration, volume],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("usePlayer must be used inside PlayerProvider");
  }

  return context;
}
