export type JamendoListResponse<T> = {
  headers: {
    status: string;
    code: number;
    error_message: string;
    warnings: string;
    results_count: number;
    results_fullcount?: number;
  };
  results: T[];
};

export type JamendoTrack = {
  id: string | number;
  name?: string;
  duration?: number;
  artist_id?: string | number;
  artist_name?: string;
  album_id?: string | number;
  album_name?: string;
  releasedate?: string;
  image?: string;
  album_image?: string;
  audio?: string;
  audiodownload?: string;
  audiodownload_allowed?: boolean;
  shareurl?: string;
  musicinfo?: {
    lang?: string;
    tags?: {
      genres?: string[];
    };
  };
};

export type JamendoArtist = {
  id: string | number;
  name?: string;
  image?: string;
  shareurl?: string;
};

export type JamendoAlbum = {
  id: string | number;
  name?: string;
  artist_id?: string | number;
  artist_name?: string;
  image?: string;
  releasedate?: string;
};
