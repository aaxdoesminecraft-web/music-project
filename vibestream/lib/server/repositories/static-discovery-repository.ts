import type { DiscoveryRepository } from "@/lib/server/repositories/user-library-repository";
import type { DiscoveryZoneRecord } from "@/lib/types/persistence";

const defaultZones: DiscoveryZoneRecord[] = [
  {
    id: "tokyo-night",
    slug: "tokyo-night",
    label: "Tokyo Pulse",
    headline: "Neon club cuts and precision synth grooves.",
    description: "High-energy electronic tracks for the upper-center pulse point.",
    x: 46,
    y: 24,
    tags: ["electronic", "dance", "synthwave"],
    accentColor: "#4CD6FF",
  },
  {
    id: "sao-paulo-bass",
    slug: "sao-paulo-bass",
    label: "Sao Paulo Bass",
    headline: "Dense rhythm pockets and underground momentum.",
    description: "Bass-heavy selections for the left-side signal cluster.",
    x: 24,
    y: 46,
    tags: ["bass", "electronic", "house"],
    accentColor: "#3EE0FF",
  },
  {
    id: "berlin-dusk",
    slug: "berlin-dusk",
    label: "Berlin Dusk",
    headline: "Moody minimal textures and late-night drive energy.",
    description: "A cooler discovery lane centered on melodic techno and ambient.",
    x: 50,
    y: 54,
    tags: ["techno", "ambient", "electronic"],
    accentColor: "#B88DFF",
  },
  {
    id: "lagos-sun",
    slug: "lagos-sun",
    label: "Lagos Sun",
    headline: "Bright percussive movement with crossover pop edges.",
    description: "A warmer live node pulling globally accessible rhythmic tracks.",
    x: 78,
    y: 38,
    tags: ["pop", "afrobeat", "dance"],
    accentColor: "#FF81C7",
  },
];

export class StaticDiscoveryRepository implements DiscoveryRepository {
  constructor(private readonly zones: DiscoveryZoneRecord[] = defaultZones) {}

  async listZones(): Promise<DiscoveryZoneRecord[]> {
    return this.zones;
  }
}
