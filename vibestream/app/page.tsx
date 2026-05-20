import { DashboardScreen } from "@/features/dashboard/dashboard-screen";
import { getDashboardData } from "@/features/dashboard/get-dashboard-data";

export default async function Home() {
  const data = await getDashboardData();

  return <DashboardScreen data={data} />;
}
