import type { MusicCatalogAdapter } from "@/lib/server/music-catalog-adapter";
import type { DiscoveryRepository, UserLibraryRepository } from "@/lib/server/repositories/user-library-repository";
import { PlayerService } from "@/lib/server/services/player-service";
import type { DiscoveryMapPageData } from "@/lib/types/view-models";

export class DiscoveryMapService {
  constructor(
    private readonly catalog: MusicCatalogAdapter,
    private readonly discoveryRepository: DiscoveryRepository,
    private readonly userLibrary: UserLibraryRepository,
    private readonly playerService = new PlayerService(),
  ) {}

  async getPageData(userId: string): Promise<DiscoveryMapPageData> {
    const [zones, queue, favoriteTrackIds] = await Promise.all([
      this.discoveryRepository.listZones(),
      this.userLibrary.getQueue(userId),
      this.userLibrary.listFavoriteTrackIds(userId),
    ]);

    const zoneResults = await Promise.all(
      zones.map((zone) =>
        this.catalog.searchTracks({
          fuzzyTags: zone.tags,
          limit: 3,
          order: "popularity",
        }),
      ),
    );

    const highlightedTrack = zoneResults.flatMap((result) => result.items)[0] ?? null;
    const playerItems =
      queue.length > 0
        ? queue
        : this.playerService.createPlaybackItems(
            highlightedTrack ? [highlightedTrack] : [],
            favoriteTrackIds,
          );

    return {
      title: "Global Frequencies",
      subtitle: "Explore hyper-local sounds and trending genres across the world.",
      liveLabel: "Live Discovery Active",
      zones: zones.map((zone, index) => ({
        id: zone.id,
        label: zone.label,
        headline: zone.headline,
        description: zone.description,
        x: zone.x,
        y: zone.y,
        mapCoords: this.toMapCoords(zone.x, zone.y),
        accentColor: zone.accentColor,
        previewTrackIds: zoneResults[index].items.map((track) => track.id),
        previewTracks: zoneResults[index].items,
      })),
      highlightedTrack,
      player: this.playerService.toPlayerBar({
        items: playerItems,
        currentTrackId: playerItems[0]?.track.id ?? null,
        elapsedSeconds: 0,
        volumePercent: 64,
        isPlaying: true,
      }),
    };
  }

  private toMapCoords(xPercent: number, yPercent: number) {
    const imageWidth = 1200;
    const imageHeight = 700;
    const centerX = Math.round((xPercent / 100) * imageWidth);
    const centerY = Math.round((yPercent / 100) * imageHeight);
    const radius = 42;

    return `${centerX},${centerY},${radius}`;
  }
}
