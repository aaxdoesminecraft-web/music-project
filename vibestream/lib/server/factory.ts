import { JamendoAdapter } from "@/lib/server/jamendo/jamendo-adapter";
import { StaticDiscoveryRepository } from "@/lib/server/repositories/static-discovery-repository";
import { SupabaseUserLibraryRepository } from "@/lib/server/repositories/supabase-user-library-repository";
import { ArtistSpotlightService } from "@/lib/server/services/artist-spotlight-service";
import { DashboardService } from "@/lib/server/services/dashboard-service";
import { DiscoveryMapService } from "@/lib/server/services/discovery-map-service";
import { LibraryService } from "@/lib/server/services/library-service";

export function createBackendServices() {
  const catalog = new JamendoAdapter();
  const userLibrary = new SupabaseUserLibraryRepository(undefined, catalog);
  const discoveryRepository = new StaticDiscoveryRepository();

  return {
    catalog,
    userLibrary,
    discoveryRepository,
    dashboardService: new DashboardService(catalog, userLibrary),
    libraryService: new LibraryService(catalog, userLibrary),
    artistSpotlightService: new ArtistSpotlightService(catalog, userLibrary),
    discoveryMapService: new DiscoveryMapService(
      catalog,
      discoveryRepository,
      userLibrary,
    ),
  };
}
