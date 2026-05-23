import type { MusicCatalogAdapter } from "@/lib/server/music-catalog-adapter";
import { eq } from "@/lib/server/supabase/supabase-rest-client";
import { SupabaseRestClient } from "@/lib/server/supabase/supabase-rest-client";
import type {
  FavoriteTrackRow,
  FollowedArtistRow,
  PlaybackQueueRow,
  PlaylistRow,
  PlaylistTrackRow,
  RecentlyPlayedRow,
} from "@/lib/server/supabase/types";
import type { UserLibraryRepository } from "@/lib/server/repositories/user-library-repository";
import type {
  AppArtistId,
  AppPlaybackItem,
  AppTrackId,
} from "@/lib/types/music";
import type {
  AppPlaylist,
  AppPlaylistTrack,
  RecentlyPlayedRecord,
  UserId,
} from "@/lib/types/persistence";

const TABLES = {
  favorites: "favorites",
  followedArtists: "followed_artists",
  recentlyPlayed: "recently_played",
  playlists: "playlists",
  playlistTracks: "playlist_tracks",
  playbackQueue: "playback_queue",
} as const;

function mapPlaylist(row: PlaylistRow): AppPlaylist {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPlaylistTrack(row: PlaylistTrackRow): AppPlaylistTrack {
  return {
    playlistId: row.playlist_id,
    trackId: row.track_id as AppTrackId,
    provider: row.provider as "jamendo",
    providerTrackId: row.provider_track_id,
    position: row.position,
    addedAt: row.added_at,
  };
}

function mapRecentlyPlayed(row: RecentlyPlayedRow): RecentlyPlayedRecord {
  return {
    userId: row.user_id,
    trackId: row.track_id as AppTrackId,
    provider: row.provider as "jamendo",
    providerTrackId: row.provider_track_id,
    playedAt: row.played_at,
  };
}

export class SupabaseUserLibraryRepository implements UserLibraryRepository {
  constructor(
    private readonly client: SupabaseRestClient = new SupabaseRestClient(),
    private readonly catalog: MusicCatalogAdapter,
  ) {}

  async listFavoriteTrackIds(userId: UserId): Promise<AppTrackId[]> {
    const rows = await this.client.select<FavoriteTrackRow>(TABLES.favorites, {
      columns: "track_id",
      filters: { user_id: eq(userId) },
      order: { column: "created_at", ascending: false },
    });

    return rows.map((row) => row.track_id as AppTrackId);
  }

  async isTrackFavorited(userId: UserId, trackId: AppTrackId): Promise<boolean> {
    const rows = await this.client.select<FavoriteTrackRow>(TABLES.favorites, {
      columns: "track_id",
      filters: {
        user_id: eq(userId),
        track_id: eq(trackId),
      },
      limit: 1,
    });

    return rows.length > 0;
  }

  async addFavoriteTrack(
    userId: UserId,
    trackId: AppTrackId,
    providerTrackId: string,
  ): Promise<void> {
    await this.client.insert<FavoriteTrackRow>(
      TABLES.favorites,
      {
        user_id: userId,
        track_id: trackId,
        provider: "jamendo",
        provider_track_id: providerTrackId,
        created_at: new Date().toISOString(),
      },
      { upsert: true },
    );
  }

  async removeFavoriteTrack(userId: UserId, trackId: AppTrackId): Promise<void> {
    await this.client.delete(TABLES.favorites, {
      user_id: eq(userId),
      track_id: eq(trackId),
    });
  }

  async listRecentlyPlayed(userId: UserId, limit: number): Promise<RecentlyPlayedRecord[]> {
    const rows = await this.client.select<RecentlyPlayedRow>(TABLES.recentlyPlayed, {
      filters: { user_id: eq(userId) },
      order: { column: "played_at", ascending: false },
      limit,
    });

    console.info("[recently played] fetched rows", {
      userId,
      count: rows.length,
      providerTrackIds: rows.map((row) => row.provider_track_id),
    });

    return rows.map(mapRecentlyPlayed);
  }

  async recordRecentlyPlayed(record: RecentlyPlayedRecord): Promise<void> {
    await this.client.insert<RecentlyPlayedRow>(TABLES.recentlyPlayed, {
      user_id: record.userId,
      track_id: record.trackId,
      provider: record.provider,
      provider_track_id: record.providerTrackId,
      played_at: record.playedAt,
    });

    console.info("[recently played] inserted row", {
      userId: record.userId,
      providerTrackId: record.providerTrackId,
      playedAt: record.playedAt,
    });
  }

  async listPlaylists(userId: UserId): Promise<AppPlaylist[]> {
    const rows = await this.client.select<PlaylistRow>(TABLES.playlists, {
      filters: { user_id: eq(userId) },
      order: { column: "updated_at", ascending: false },
    });

    return rows.map(mapPlaylist);
  }

  async createPlaylist(
    input: Pick<AppPlaylist, "userId" | "name" | "description" | "coverImageUrl">,
  ): Promise<AppPlaylist> {
    const now = new Date().toISOString();
    const playlist: AppPlaylist = {
      id: crypto.randomUUID(),
      userId: input.userId,
      name: input.name,
      description: input.description,
      coverImageUrl: input.coverImageUrl,
      createdAt: now,
      updatedAt: now,
    };

    await this.client.insert<PlaylistRow>(TABLES.playlists, {
      id: playlist.id,
      user_id: playlist.userId,
      name: playlist.name,
      description: playlist.description,
      cover_image_url: playlist.coverImageUrl,
      created_at: playlist.createdAt,
      updated_at: playlist.updatedAt,
    });

    return playlist;
  }

  async listPlaylistTracks(playlistId: string): Promise<AppPlaylistTrack[]> {
    const rows = await this.client.select<PlaylistTrackRow>(TABLES.playlistTracks, {
      filters: { playlist_id: eq(playlistId) },
      order: { column: "position", ascending: true },
    });

    return rows.map(mapPlaylistTrack);
  }

  async addPlaylistTrack(track: Omit<AppPlaylistTrack, "addedAt">): Promise<void> {
    await this.client.insert<PlaylistTrackRow>(TABLES.playlistTracks, {
      playlist_id: track.playlistId,
      track_id: track.trackId,
      provider: track.provider,
      provider_track_id: track.providerTrackId,
      position: track.position,
      added_at: new Date().toISOString(),
    });
  }

  async removePlaylistTrack(playlistId: string, position: number): Promise<void> {
    await this.client.delete(TABLES.playlistTracks, {
      playlist_id: eq(playlistId),
      position: eq(position),
    });
  }

  async isArtistFollowed(userId: UserId, artistId: AppArtistId): Promise<boolean> {
    const rows = await this.client.select<FollowedArtistRow>(TABLES.followedArtists, {
      columns: "artist_id",
      filters: {
        user_id: eq(userId),
        artist_id: eq(artistId),
      },
      limit: 1,
    });

    return rows.length > 0;
  }

  async followArtist(
    userId: UserId,
    artistId: AppArtistId,
    providerArtistId: string,
  ): Promise<void> {
    await this.client.insert<FollowedArtistRow>(
      TABLES.followedArtists,
      {
        user_id: userId,
        artist_id: artistId,
        provider: "jamendo",
        provider_artist_id: providerArtistId,
        created_at: new Date().toISOString(),
      },
      { upsert: true },
    );
  }

  async unfollowArtist(userId: UserId, artistId: AppArtistId): Promise<void> {
    await this.client.delete(TABLES.followedArtists, {
      user_id: eq(userId),
      artist_id: eq(artistId),
    });
  }

  async getQueue(userId: UserId): Promise<AppPlaybackItem[]> {
    const rows = await this.client.select<PlaybackQueueRow>(TABLES.playbackQueue, {
      filters: { user_id: eq(userId) },
      order: { column: "position", ascending: true },
    });

    if (rows.length === 0) {
      return [];
    }

    const [tracks, favoriteTrackIds] = await Promise.all([
      this.catalog.getTracksByIds(rows.map((row) => row.provider_track_id)),
      this.listFavoriteTrackIds(userId),
    ]);

    const likedIds = new Set(favoriteTrackIds);
    const trackByProviderId = new Map(
      tracks.map((track) => [track.providerTrackId, track] as const),
    );

    return rows.flatMap((row) => {
      const track = trackByProviderId.get(row.provider_track_id);

      if (!track) {
        return [];
      }

      return [
        {
          track,
          isLiked: likedIds.has(track.id),
        },
      ];
    });
  }

  async replaceQueue(
    userId: UserId,
    items: Array<{ trackId: AppTrackId; providerTrackId: string; position: number }>,
  ): Promise<void> {
    await this.client.delete(TABLES.playbackQueue, {
      user_id: eq(userId),
    });

    if (items.length === 0) {
      return;
    }

    await this.client.insert<PlaybackQueueRow[]>(
      TABLES.playbackQueue,
      items.map((item) => ({
        user_id: userId,
        track_id: item.trackId,
        provider: "jamendo",
        provider_track_id: item.providerTrackId,
        position: item.position,
        added_at: new Date().toISOString(),
      })),
    );
  }
}
