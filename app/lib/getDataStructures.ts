import { getRepoListDataStructures } from "@/lib/server/repo-list";
import type { DataStructureEntry } from "@/types/repo-list";

/** Data structures from the repo-list (remote index, cached; empty when unconfigured/unreachable). */
export async function getDataStructures(): Promise<DataStructureEntry[]> {
  return getRepoListDataStructures();
}
