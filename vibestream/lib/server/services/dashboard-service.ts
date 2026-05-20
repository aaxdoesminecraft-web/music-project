import type { MusicCatalogAdapter } from "@/lib/server/music-catalog-adapter";
import type { UserLibraryRepository } from "@/lib/server/repositories/user-library-repository";
import { PlayerService } from "@/lib/server/services/player-service";
import type { DashboardCard, DashboardPageData } from "@/lib/types/view-models";

export class DashboardService {
  constructor(
    private readonly catalog: MusicCatalogAdapter,
    private readonly userLibrary: UserLibraryRepository,
    private readonly playerService = new PlayerService(),
  ) {}

  async getPageData(userId: string): Promise<DashboardPageData> {
    const [recentRecords, queue, favoriteTrackIds, recommendationResult] =
      await Promise.all([
        this.userLibrary.listRecentlyPlayed(userId, 4),
        this.userLibrary.getQueue(userId),
        this.userLibrary.listFavoriteTrackIds(userId),
        this.getRecommendations(),
      ]);

    const recentTracks = await this.catalog.getTracksByIds(
      recentRecords.map((record) => record.providerTrackId),
    );

    const playerItems =
      queue.length > 0
        ? queue
        : this.playerService.createPlaybackItems(
            recentTracks.length > 0 ? recentTracks : recommendationResult.items,
            favoriteTrackIds,
          );

    return {
      greeting: "Good Evening",
      subtitle: "Ready to find your vibe?",
      recentlyPlayed: recentTracks.map((track) =>
        this.toCard({ ...track, track }, "/library"),
      ),
      forYou: recommendationResult.items.map((track) =>
        this.toCard(
          { ...track, track },
          `/artists/${track.providerArtistId ?? ""}`,
        ),
      ),
      player: this.playerService.toPlayerBar({
        items: playerItems,
        currentTrackId: playerItems[0]?.track.id ?? null,
        elapsedSeconds: 0,
        volumePercent: 60,
        isPlaying: false,
      }),
    };
  }

  private async getRecommendations() {
    const attempts = [
      {
        label: "fuzzyTags-electronic-chill-rock",
        fuzzyTags: ["electronic", "chill", "rock"],
        limit: 4,
        order: "popularity" as const,
      },
      {
        label: "featured-electronic",
        tags: ["electronic"],
        featured: true,
        limit: 4,
        order: "popularity" as const,
      },
      {
        label: "featured-rock",
        tags: ["rock"],
        featured: true,
        limit: 4,
        order: "popularity" as const,
      },
      {
        label: "search-electronic",
        search: "electronic",
        limit: 4,
        order: "popularity" as const,
      },
      {
        label: "featured-any",
        featured: true,
        limit: 4,
        order: "popularity" as const,
      },
    ];

    for (const query of attempts) {
      try {
        const result = await this.catalog.searchTracks(query);

        console.info("[dashboard recommendations]", {
          attempt: query.label,
          returned: result.items.length,
          total: result.total,
          sampleTitles: result.items.slice(0, 3).map((item) => item.title),
        });

        if (result.items.length > 0) {
          return result;
        }
      } catch (error) {
        console.error("[dashboard recommendations]", {
          attempt: query.label,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    console.warn("[dashboard recommendations] exhausted all recommendation attempts");

    return {
      items: [],
      total: 0,
      nextOffset: null,
    };
  }

  private toCard(
    track: {
      title: string;
      artistName: string;
      coverImageUrl: string | null;
      track?: DashboardCard["track"];
    },
    href: string,
  ): DashboardCard {
    return {
      id: `${track.title}:${track.artistName}`,
      title: track.title,
      subtitle: track.artistName,
      description: null,
      imageUrl: track.coverImageUrl,
      href,
      track: track.track ?? null,
    };
  }
}
