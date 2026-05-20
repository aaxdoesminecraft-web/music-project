"use client";

import Image from "next/image";
import { AppShell } from "@/components/layout/app-shell";
import { PlayerQueueSync } from "@/components/player/player-queue-sync";
import { usePlayer } from "@/components/player/player-provider";
import type { AppTrack } from "@/lib/types/music";
import type { DashboardPageData } from "@/lib/types/view-models";

type DashboardScreenProps = {
  data: DashboardPageData;
};

function DashboardCard({
  title,
  subtitle,
  description,
  imageUrl,
  track,
  queue,
  onPlay,
}: DashboardPageData["recentlyPlayed"][number] & {
  queue: AppTrack[];
  onPlay: (track: AppTrack, queue: AppTrack[]) => void;
}) {
  return (
    <article className="dashboard-card">
      <button
        type="button"
        className="dashboard-cardAction"
        onClick={() => track && onPlay(track, queue)}
        disabled={!track}
      >
        <div className="dashboard-cardArtwork">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              width={240}
              height={240}
              className="dashboard-cardImage"
            />
          ) : (
            <div className="dashboard-cardPlaceholder" />
          )}
          <span className="dashboard-cardPlay">▶</span>
        </div>
        <div className="dashboard-cardBody">
          <strong>{title}</strong>
          <span>{subtitle}</span>
          {description ? <p>{description}</p> : null}
        </div>
      </button>
    </article>
  );
}

function EmptyShelf({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <article className="dashboard-emptyShelf">
      <strong>{title}</strong>
      <p>{message}</p>
    </article>
  );
}

export function DashboardScreen({ data }: DashboardScreenProps) {
  const { playTrack } = usePlayer();
  const recentQueue = data.recentlyPlayed.flatMap((card) => (card.track ? [card.track] : []));
  const forYouQueue = data.forYou.flatMap((card) => (card.track ? [card.track] : []));
  const seedQueue = recentQueue.length > 0 ? recentQueue : forYouQueue;

  return (
    <AppShell>
      <PlayerQueueSync tracks={seedQueue} />

      <header className="dashboard-hero">
        <h1>{data.greeting}</h1>
        <p>{data.subtitle}</p>
      </header>

      <section className="dashboard-section">
        <div className="dashboard-sectionHeader">
          <h2>Recently Played</h2>
        </div>
        <div className="dashboard-grid dashboard-grid--wide">
          {data.recentlyPlayed.length > 0 ? (
            data.recentlyPlayed.map((card) => (
              <DashboardCard
                key={card.id}
                {...card}
                queue={recentQueue}
                onPlay={playTrack}
              />
            ))
          ) : (
            <EmptyShelf
              title="No recent sessions yet"
              message="As tracks are played, this shelf will populate from the recently played backend table."
            />
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-sectionHeader">
          <h2>For You</h2>
          <button type="button" className="dashboard-linkButton">
            See All
          </button>
        </div>
        <div className="dashboard-grid">
          {data.forYou.length > 0 ? (
            data.forYou.map((card) => (
              <DashboardCard
                key={card.id}
                {...card}
                queue={forYouQueue}
                onPlay={playTrack}
              />
            ))
          ) : (
            <EmptyShelf
              title="No recommendations found yet"
              message="The current discovery query returned no matching tracks. Try broadening the Jamendo recommendation filters."
            />
          )}
        </div>
      </section>
    </AppShell>
  );
}
