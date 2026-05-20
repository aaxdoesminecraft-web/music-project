"use client";

import Image from "next/image";
import { usePlayer } from "@/components/player/player-provider";

function formatDuration(totalSeconds: number | null) {
  if (!Number.isFinite(totalSeconds) || totalSeconds === null) {
    return "--:--";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayback,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
  } = usePlayer();

  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <footer className="playerBar">
      <div className="playerBar-track">
        <div className="playerBar-coverShell">
          {currentTrack?.coverImageUrl ? (
            <Image
              src={currentTrack.coverImageUrl}
              alt=""
              width={96}
              height={96}
              className="playerBar-coverImage"
            />
          ) : (
            <div className="playerBar-cover" />
          )}
        </div>
        <div className="playerBar-meta">
          <strong>{currentTrack?.title ?? "Select a track"}</strong>
          <span>{currentTrack?.artistName ?? "Music will appear here when you play something"}</span>
        </div>
        <button type="button" className="playerBar-heart" aria-label="Favorite track">
          ♥
        </button>
      </div>

      <div className="playerBar-center">
        <div className="playerBar-controls">
          <button type="button" aria-label="Shuffle">
            ↻
          </button>
          <button type="button" aria-label="Previous" onClick={playPrevious}>
            ◀
          </button>
          <button
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
            className="playerBar-playButton"
            onClick={togglePlayback}
          >
            <span className={`playerBar-playIcon${isPlaying ? " is-paused" : ""}`}>
              {isPlaying ? "❚❚" : "▶"}
            </span>
          </button>
          <button type="button" aria-label="Next" onClick={playNext}>
            ▶
          </button>
          <button type="button" aria-label="Repeat">
            ↺
          </button>
        </div>

        <div className="playerBar-progress">
          <span>{formatDuration(currentTime)}</span>
          <label className="playerBar-progressTrack">
            <span style={{ width: `${progress}%` }} />
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={1}
              value={Math.min(currentTime, duration || 0)}
              onChange={(event) => seekTo(Number(event.target.value))}
              aria-label="Seek playback"
            />
          </label>
          <span>{formatDuration(duration || currentTrack?.durationSeconds || null)}</span>
        </div>
      </div>

      <div className="playerBar-volume">
        <button type="button" aria-label="Queue">
          ☰
        </button>
        <button type="button" aria-label="Devices">
          ⌁
        </button>
        <button type="button" aria-label="Volume">
          🔊
        </button>
        <label className="playerBar-volumeTrack">
          <span style={{ width: `${volume * 100}%` }} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            aria-label="Set volume"
          />
        </label>
      </div>
    </footer>
  );
}
