"use client";

import Image from "next/image";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PlayerQueueSync } from "@/components/player/player-queue-sync";
import { usePlayer } from "@/components/player/player-provider";
import type { ArtistSpotlightPageData } from "@/lib/types/view-models";

export function ArtistScreen({ data }: { data: ArtistSpotlightPageData }) {
  const [isFollowing, setIsFollowing] = useState(data.isFollowing);
  const { playTrack, playQueue } = usePlayer();
  const queue = data.popularTracks;

  async function toggleFollow() {
    const method = isFollowing ? "DELETE" : "POST";
    await fetch(`/api/artists/${data.artist.providerArtistId}/follow`, { method });
    setIsFollowing((value) => !value);
  }

  return (
    <AppShell>
      <PlayerQueueSync tracks={queue} />

      <section
        className="artist-heroPanel"
        style={
          data.heroImageUrl
            ? { backgroundImage: `linear-gradient(180deg, rgba(9,13,26,0.45), rgba(9,13,26,0.92)), url(${data.heroImageUrl})` }
            : undefined
        }
      >
        <div className="artist-heroContent">
          <span className="artist-eyebrow">Verified Artist</span>
          <h1>{data.artist.name}</h1>
          <p>
            {data.artist.bio ??
              "Pioneering the intersection of synth-wave and deep house."}
          </p>
        </div>
        <div className="artist-heroActions">
          <button
            type="button"
            className="artist-playButton"
            onClick={() => playQueue(queue, 0, true)}
          >
            ▶
          </button>
          <button
            type="button"
            className="artist-followButton"
            onClick={toggleFollow}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </section>

      <section className="artist-grid">
        <div className="artist-panel">
          <div className="dashboard-sectionHeader">
            <h2>Popular</h2>
          </div>
          <div className="artist-trackList">
            {data.popularTracks.map((track, index) => (
              <button
                key={track.id}
                type="button"
                className="artist-trackRow"
                onClick={() => playTrack(track, queue)}
              >
                <span>{index + 1}</span>
                <div className="artist-trackMeta">
                  <strong>{track.title}</strong>
                  <small>{track.artistName}</small>
                </div>
                <span>
                  {Math.floor((track.durationSeconds ?? 0) / 60)}:
                  {String((track.durationSeconds ?? 0) % 60).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="artist-panel">
          <div className="dashboard-sectionHeader">
            <h2>Latest Release</h2>
          </div>
          {data.latestRelease ? (
            <article className="artist-releaseCard">
              {data.latestRelease.coverImageUrl ? (
                <Image
                  src={data.latestRelease.coverImageUrl}
                  alt=""
                  width={480}
                  height={480}
                  className="artist-releaseImage"
                />
              ) : null}
              <strong>{data.latestRelease.title}</strong>
              <span>{data.latestRelease.artistName}</span>
            </article>
          ) : (
            <div className="dashboard-emptyShelf">
              <strong>No release data yet</strong>
              <p>Jamendo did not return an album for this artist.</p>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
