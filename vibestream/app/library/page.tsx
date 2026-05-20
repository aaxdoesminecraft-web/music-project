import { getLibraryData } from "@/features/library/get-library-data";
import { LibraryScreen } from "@/features/library/library-screen";

export default async function LibraryPage() {
  const data = await getLibraryData();
  return <LibraryScreen data={data} />;
}
