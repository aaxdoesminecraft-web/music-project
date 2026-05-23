"use client";

import Image from "next/image";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PlayerQueueSync } from "@/components/player/player-queue-sync";
import { usePlayer } from "@/components/player/player-provider";
import type { DiscoveryMapPageData } from "@/lib/types/view-models";

export function DiscoveryScreen({ data }: { data: DiscoveryMapPageData }) {
  const [activeZoneId, setActiveZoneId] = useState(data.zones[0]?.id ?? "");
  const { playTrack } = usePlayer();
  const allTracks = data.zones.flatMap((zone) => zone.previewTracks ?? []);
  const activeZone =
    data.zones.find((zone) => zone.id === activeZoneId) ?? data.zones[0] ?? null;

  return (
    <AppShell>
      <PlayerQueueSync tracks={allTracks} />

      <header className="dashboard-hero discovery-hero">
        <div>
          <h1>{data.title}</h1>
          <p>{data.subtitle}</p>
        </div>
        <div className="discovery-livePill">{data.liveLabel}</div>
      </header>

      <section className="discovery-panel">
        <div className="discovery-wave" />
        <Image
          src="/images/discovery-map.svg"
          alt="Interactive world-inspired discovery map with highlighted music zones"
          width={1200}
          height={700}
          className="discovery-mapImage"
          useMap="#discovery-map"
          priority
        />
        <map name="discovery-map">
          {data.zones.map((zone) => (
            <area
              key={zone.id}
              shape="circle"
              coords={zone.mapCoords}
              href={`#${zone.id}`}
              alt={zone.label}
              onClick={(event) => {
                event.preventDefault();
                setActiveZoneId(zone.id);
                if (zone.previewTracks?.[0]) {
                  playTrack(zone.previewTracks[0], zone.previewTracks);
                }
              }}
            />
          ))}
        </map>
        {data.zones.map((zone) => (
          <button
            key={`${zone.id}-marker`}
            type="button"
            className={`discovery-node${zone.id === activeZoneId ? " is-active" : ""}`}
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              ["--node-color" as string]: zone.accentColor,
            }}
            onClick={() => {
              setActiveZoneId(zone.id);
              if (zone.previewTracks?.[0]) {
                playTrack(zone.previewTracks[0], zone.previewTracks);
              }
            }}
            aria-label={zone.label}
          />
        ))}
      </section>

      {activeZone ? (
        <section className="discovery-zoneCard" id={activeZone.id}>
          <div>
            <span className="discovery-zoneLabel">{activeZone.label}</span>
            <h2>{activeZone.headline}</h2>
            <p>{activeZone.description}</p>
          </div>
          <div className="discovery-zoneTracks">
            {(activeZone.previewTracks ?? []).map((track) => (
              <button
                key={track.id}
                type="button"
                className="discovery-zoneTrack"
                onClick={() =>
                  playTrack(track, activeZone.previewTracks ?? [track])
                }
              >
                <strong>{track.title}</strong>
                <span>{track.artistName}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
