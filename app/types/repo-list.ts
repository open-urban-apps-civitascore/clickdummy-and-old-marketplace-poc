import { z } from "zod";

import { addonCatalogSchema } from "./addons";
import { deploymentRefSchema, useCaseCatalogSchema } from "./use-cases";

/**
 * The repo-list index: one git-hosted `index.json` with two sections and one
 * shared version/updatedAt. Composed from the per-entry schemas so the index,
 * the fetcher and the generated JSON Schema can never drift apart.
 *
 * This is the single source of truth the JSON Schema is generated from
 * (scripts/generate-schema.ts → the catalog repo's index.schema.json).
 */
/**
 * A shared data model, listed for its own sake: installable on its own and
 * usable by several use cases at once — which is what makes data comparable
 * between municipalities. Leaner than a use case row (no artifacts, no pipeline,
 * no demo metadata): the catalogue manifest plus the pin.
 *
 * Declared but not yet rendered anywhere — the marketplace has no data-structure
 * view. Parsing it here is what makes that view possible later; before format
 * v3 the section was not in this schema at all, so zod silently dropped it and
 * the data never reached the app.
 */
export const dataStructureEntrySchema = z.object({
  id: z.string().min(3),
  type: z.literal("datastructure"),
  displayName: z.string().min(3),
  description: z.string(),
  version: z.string(),
  maintainer: z.string(),
  license: z.string(),
  keywords: z.array(z.string()).default([]),
  /**
   * Primary classification shown on the card and used as a filter facet, e.g.
   * "Mobilität" — the counterpart of a use case's first category. Distinct from
   * `keywords`, which are lowercase search tokens rather than display labels.
   */
  domain: z.string().optional(),
  /** See the note on `addedAt` in `useCaseObjectSchema`. */
  addedAt: z.iso.date().optional(),
  // No `curationTier` here on purpose: grading a data MODEL is a different
  // judgement from grading a bundle, and nothing in `lib/curation.ts` covers
  // it yet. Deliberately deferred rather than half-declared.
  deploymentRef: deploymentRefSchema.optional(),
  revoked: z.boolean().optional(),
  revokedReason: z.string().optional(),
});

export const repoListIndexSchema = z.object({
  // Optional pointer to index.schema.json so editors validate index.json inline
  // as it is authored. Ignored at runtime; present only for author DX.
  $schema: z.string().optional(),
  version: z.string(),
  updatedAt: z.string().datetime(),
  addons: addonCatalogSchema.shape.addons,
  useCases: useCaseCatalogSchema.shape.useCases,
  // Absent in format v2 indexes, so default rather than require — an older
  // catalog must still parse.
  dataStructures: z.array(dataStructureEntrySchema).default([]),
});

export type DataStructureEntry = z.infer<typeof dataStructureEntrySchema>;

export type RepoListIndex = z.infer<typeof repoListIndexSchema>;
