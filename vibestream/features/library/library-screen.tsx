"use client";

import Image from "next/image";
import { AppShell } from "@/components/layout/app-shell";
import { PlayerQueueSync } from "@/components/player/player-queue-sync";
import { usePlayer } from "@/components/player/player-provider";
import type { LibraryPageData } from "@/lib/types/view-models";

export function LibraryScreen({ data }: { data: LibraryPageData }) {
  const { playQueue, playTrack } = usePlayer();
  const queue = data.rows.map((row) => row.track);

  return (
    <AppShell>
      <PlayerQueueSync tracks={queue} />

      <header className="dashboard-hero library-hero">
        <div>
          <h1>{data.title}</h1>
          <p>{data.statsLabel} • 68 Hours</p>
        </div>
        <div className="library-heroActions">
          <button
            type="button"
            className="library-actionButton is-primary"
            onClick={() => playQueue(queue, 0, true)}
          >
            ▶ Play All
          </button>
          <button type="button" className="library-actionButton">
            Shuffle
          </button>
        </div>
      </header>

      <section className="library-panel">
        <div className="library-toolbar">
          <div className="library-search">{data.searchPlaceholder}</div>
          <div className="library-filters">
            <span>Playlists</span>
            <span className="is-active">Songs</span>
            <span>Albums</span>
            <span>Artists</span>
          </div>
        </div>

        <div className="library-tableWrap">
          <table className="library-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Artist</th>
                <th>Album</th>
                <th>Date Added</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, index) => (
                <tr key={row.track.id}>
                  <td>{row.order}</td>
                  <td>
                    <button
                      type="button"
                      className={`library-trackButton${row.isCurrent ? " is-current" : ""}`}
                      onClick={() => playTrack(row.track, queue)}
                    >
                      <span className="library-trackArtwork">
                        {row.track.coverImageUrl ? (
                          <Image
                            src={row.track.coverImageUrl}
                            alt=""
                            width={56}
                            height={56}
                            className="library-trackArtworkImage"
                          />
                        ) : null}
                      </span>
                      <span className="library-trackMeta">
                        <strong>{row.track.title}</strong>
                      </span>
                    </button>
                  </td>
                  <td>{row.track.artistName}</td>
                  <td>{row.track.albumTitle ?? "Single"}</td>
                  <td>{index === 0 ? "Oct 12, 2023" : index === 1 ? "Oct 15, 2023" : "Sep 28, 2023"}</td>
                  <td>
                    {Math.floor((row.track.durationSeconds ?? 0) / 60)}:
                    {String((row.track.durationSeconds ?? 0) % 60).padStart(2, "0")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
