create table if not exists profiles (
  id uuid primary key,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists playlists (
  id uuid primary key,
  user_id uuid not null references profiles(id),
  name text not null,
  description text,
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists playlist_tracks (
  playlist_id uuid not null references playlists(id) on delete cascade,
  track_id text not null,
  provider text not null,
  provider_track_id text not null,
  position integer not null,
  added_at timestamptz not null default now(),
  primary key (playlist_id, position)
);

create table if not exists favorites (
  user_id uuid not null references profiles(id) on delete cascade,
  track_id text not null,
  provider text not null,
  provider_track_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, track_id)
);

create table if not exists followed_artists (
  user_id uuid not null references profiles(id) on delete cascade,
  artist_id text not null,
  provider text not null,
  provider_artist_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, artist_id)
);

create table if not exists recently_played (
  user_id uuid not null references profiles(id) on delete cascade,
  track_id text not null,
  provider text not null,
  provider_track_id text not null,
  played_at timestamptz not null default now()
);

create table if not exists playback_queue (
  user_id uuid not null references profiles(id) on delete cascade,
  track_id text not null,
  provider text not null,
  provider_track_id text not null,
  position integer not null,
  added_at timestamptz not null default now(),
  primary key (user_id, position)
);

create index if not exists idx_recently_played_user_time
  on recently_played (user_id, played_at desc);

create index if not exists idx_playlists_user_updated
  on playlists (user_id, updated_at desc);
