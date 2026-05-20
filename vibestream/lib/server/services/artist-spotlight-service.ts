import type { MusicCatalogAdapter } from "@/lib/server/music-catalog-adapter";
import type { UserLibraryRepository } from "@/lib/server/repositories/user-library-repository";
import { PlayerService } from "@/lib/server/services/player-service";
import type { ArtistSpotlightPageData } from "@/lib/types/view-models";

export class ArtistSpotlightService {
  constructor(
    private readonly catalog: MusicCatalogAdapter,
    private readonly userLibrary: UserLibraryRepository,
    private readonly playerService = new PlayerService(),
  ) {}

  async getPageData(userId: string, providerArtistId: string): Promise<ArtistSpotlightPageData> {
    const [artist, popularTracksResult, albums, queue, favoriteTrackIds] =
      await Promise.all([
        this.catalog.getArtist(providerArtistId),
        this.catalog.getTracksByArtist(providerArtistId, { limit: 5 }),
        this.catalog.getArtistAlbums(providerArtistId, { limit: 1 }),
        this.userLibrary.getQueue(userId),
        this.userLibrary.listFavoriteTrackIds(userId),
      ]);

    if (!artist) {
      throw new Error(`Artist ${providerArtistId} was not found`);
    }

    const isFollowing = await this.userLibrary.isArtistFollowed(userId, artist.id);
    const playerItems =
      queue.length > 0
        ? queue
        : this.playerService.createPlaybackItems(
            popularTracksResult.items,
            favoriteTrackIds,
          );

    return {
      artist,
      heroImageUrl: artist.coverImageUrl,
      latestRelease: albums[0] ?? null,
      popularTracks: popularTracksResult.items,
      isFollowing,
      player: this.playerService.toPlayerBar({
        items: playerItems,
        currentTrackId: playerItems[0]?.track.id ?? null,
        elapsedSeconds: 0,
        volumePercent: 72,
        isPlaying: false,
      }),
    };
  }
}
