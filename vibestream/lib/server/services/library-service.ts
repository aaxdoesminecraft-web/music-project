import type { MusicCatalogAdapter } from "@/lib/server/music-catalog-adapter";
import type { UserLibraryRepository } from "@/lib/server/repositories/user-library-repository";
import { PlayerService } from "@/lib/server/services/player-service";
import type { LibraryFilterKind, LibraryPageData } from "@/lib/types/view-models";

export class LibraryService {
  constructor(
    private readonly catalog: MusicCatalogAdapter,
    private readonly userLibrary: UserLibraryRepository,
    private readonly playerService = new PlayerService(),
  ) {}

  async getPageData(
    userId: string,
    input: {
      query?: string;
      filter?: LibraryFilterKind;
      playlistId?: string;
    },
  ): Promise<LibraryPageData> {
    const filter = input.filter ?? "songs";

    const playlistTracks =
      input.playlistId && filter === "playlists"
        ? await this.userLibrary.listPlaylistTracks(input.playlistId)
        : [];

    const trackIds =
      playlistTracks.length > 0
        ? playlistTracks.map((track) => track.providerTrackId)
        : [];

    const [searchResult, queue, favoriteTrackIds] = await Promise.all([
      trackIds.length > 0
        ? this.catalog.getTracksByIds(trackIds).then((items) => ({
            items,
            total: items.length,
            nextOffset: null,
          }))
        : this.catalog.searchTracks({
            text: input.query,
            limit: 25,
            order: "popularity",
          }),
      this.userLibrary.getQueue(userId),
      this.userLibrary.listFavoriteTrackIds(userId),
    ]);

    const playerItems =
      queue.length > 0
        ? queue
        : this.playerService.createPlaybackItems(searchResult.items, favoriteTrackIds);

    return {
      title: "Your Library",
      statsLabel: `${searchResult.total ?? searchResult.items.length} Songs`,
      searchPlaceholder: "Search in library...",
      activeFilter: filter,
      rows: searchResult.items.map((track, index) => ({
        order: index + 1,
        track,
        dateAddedLabel: "Pending sync",
        isCurrent: playerItems[0]?.track.id === track.id,
      })),
      player: this.playerService.toPlayerBar({
        items: playerItems,
        currentTrackId: playerItems[0]?.track.id ?? null,
        elapsedSeconds: 0,
        volumePercent: 68,
        isPlaying: false,
      }),
    };
  }

  async getSidebarCounts(userId: string): Promise<{ playlists: number }> {
    const playlists = await this.userLibrary.listPlaylists(userId);
    return { playlists: playlists.length };
  }
}
