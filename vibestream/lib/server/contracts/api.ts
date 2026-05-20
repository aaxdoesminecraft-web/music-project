import type {
  ArtistSpotlightPageData,
  DashboardPageData,
  DiscoveryMapPageData,
  LibraryPageData,
} from "@/lib/types/view-models";

export type ApiEnvelope<T> = {
  data: T;
  meta?: Record<string, string | number | boolean | null>;
};

export type DashboardResponse = ApiEnvelope<DashboardPageData>;
export type LibraryResponse = ApiEnvelope<LibraryPageData>;
export type ArtistSpotlightResponse = ApiEnvelope<ArtistSpotlightPageData>;
export type DiscoveryMapResponse = ApiEnvelope<DiscoveryMapPageData>;
