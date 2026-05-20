import { DiscoveryScreen } from "@/features/explore/discovery-screen";
import { getDiscoveryData } from "@/features/explore/get-discovery-data";

export default async function ExplorePage() {
  const data = await getDiscoveryData();
  return <DiscoveryScreen data={data} />;
}
