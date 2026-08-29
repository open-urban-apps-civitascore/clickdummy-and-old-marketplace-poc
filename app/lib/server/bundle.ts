import { z } from "zod";

import { parseUrn } from "@/lib/urn";
import type { UseCase } from "@/types/use-cases";

/**
 * Fetches a use-case bundle (CORE-IR files) straight from its git artifact repo
 * — the M3 install source. The bundle is the single source of the use case's
 * content; nothing is shipped with the app.
 *
 * Layout convention (matches commune-musterhausen-trafficcounter):
 *   core-ir/dataset.json          — the DataSet manifest (entry point)
 *   core-ir/<ElementName>.schema.json — one JSON-Schema file per element,
 *                                       named after the URN's name segment
 *
 * `dataset.json.dataStructureRefs` drives which elements are fetched and in what
 * order (dependency order: a referenced element comes before its user).
 *
 * The ref is any git identifier (branch/tag/commit hash); pinning a commit hash
 * gives integrity — the marketplace installs exactly the reviewed content.
 */

export class BundleError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "BundleError";
  }
}

const FETCH_TIMEOUT_MS = 5000;

const datasetManifestSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  version: z.string().optional(),
  dataStructureRefs: z.array(z.string()),
});

export interface UseCaseBundle {
  dataset: z.infer<typeof datasetManifestSchema>;
  /** Element JSON Schemas, in `dataStructureRefs` (dependency) order. */
  elements: { ref: string; schema: Record<string, unknown> }[];
  deploymentRef: NonNullable<UseCase["deploymentRef"]>;
  /**
   * The pipeline flow graph (the React-Flow model the portal pipeline editor
   * produces), from `core-ir/pipeline.json`. Optional: a bundle without it installs
   * with an empty placeholder model (→ the release saga compensates to READY). Its
   * datasource/datasink node `entityId`s are re-bound to this instance's freshly
   * created ids at install time (see the mapper), so any ids recorded in the file
   * are irrelevant.
   */
  pipeline?: Record<string, unknown>;
}

// GitLab-style raw file URL for a path at a pinned ref, mirroring how the
// repo-list itself is fetched (…/-/raw/<ref>/<path>).
function rawUrl(repoUrl: string, ref: string, path: string): string {
  return `${repoUrl.replace(/\/+$/, "")}/-/raw/${encodeURIComponent(ref)}/${path}`;
}

/**
 * `deploymentRef.path` is the folder inside the repo holding the package — `.`
 * for the root, a subfolder for monorepos that carry several catalog entries.
 */
function packagePath(path: string, file: string): string {
  const folder = path.replace(/^\.?\/*/, "").replace(/\/+$/, "");
  return folder ? `${folder}/${file}` : file;
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  }).catch((error) => {
    throw new BundleError(
      `Bundle fetch failed: ${error instanceof Error ? error.message : url}`,
      502,
    );
  });

  if (response.status === 404) {
    throw new BundleError(`Bundle file not found: ${url}`, 424);
  }
  if (!response.ok) {
    throw new BundleError(`Bundle fetch returned ${response.status} for ${url}`, 502);
  }
  return response.json().catch(() => {
    throw new BundleError(`Bundle file is not valid JSON: ${url}`, 502);
  });
}

/**
 * Like {@link fetchJson} but a missing file (`404`) resolves to `undefined` instead
 * of throwing — for optional bundle parts (e.g. the pipeline model).
 */
async function fetchOptionalJson(url: string): Promise<Record<string, unknown> | undefined> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  }).catch((error) => {
    throw new BundleError(
      `Bundle fetch failed: ${error instanceof Error ? error.message : url}`,
      502,
    );
  });
  if (response.status === 404) return undefined;
  if (!response.ok) {
    throw new BundleError(`Bundle fetch returned ${response.status} for ${url}`, 502);
  }
  return response.json().catch(() => {
    throw new BundleError(`Bundle file is not valid JSON: ${url}`, 502);
  }) as Promise<Record<string, unknown>>;
}

export async function fetchUseCaseBundle(
  deploymentRef: NonNullable<UseCase["deploymentRef"]>,
): Promise<UseCaseBundle> {
  const { url: repoUrl, ref, path } = deploymentRef;

  // Catalog format v3: the pin IS the commit, so there is nothing to resolve
  // and nothing to race. v2 pinned a tag, resolved it at install time and fell
  // back to the tag itself when resolution failed — which meant a tag moved
  // upstream silently changed what got installed. Fetching only at a verified
  // SHA is what makes two installs of the same listed version byte-identical.
  if (!/^[0-9a-f]{40}$/.test(ref)) {
    throw new BundleError(
      `Refusing to install: '${ref}' is not a full commit SHA. Only an immutable pin may be fetched.`,
      424,
    );
  }

  const dataset = datasetManifestSchema.parse(
    await fetchJson(rawUrl(repoUrl, ref, packagePath(path, "core-ir/dataset.json"))),
  );

  const elements: UseCaseBundle["elements"] = [];
  for (const structureRef of dataset.dataStructureRefs) {
    const name = parseUrn(structureRef).name;
    const schema = (await fetchJson(
      rawUrl(repoUrl, ref, packagePath(path, `core-ir/${name}.schema.json`)),
    )) as Record<string, unknown>;

    // The file resolved by name must actually be the element the dataset refers
    // to — guards the filename convention against silent mismatches.
    if (typeof schema.$id === "string" && schema.$id !== structureRef) {
      throw new BundleError(
        `Bundle element $id '${schema.$id}' does not match referenced URN '${structureRef}'.`,
        502,
      );
    }
    elements.push({ ref: structureRef, schema });
  }

  // Optional flow graph — a bundle without it installs with an empty placeholder.
  const pipeline = await fetchOptionalJson(
    rawUrl(repoUrl, ref, packagePath(path, "core-ir/pipeline.json")),
  );

  return { dataset, elements, deploymentRef, pipeline };
}
