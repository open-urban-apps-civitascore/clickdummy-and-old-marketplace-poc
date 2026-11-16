import { z } from "zod";

import { addonCatalogSchema } from "./addons";
import { deploymentRefSchema, entryLinkSchema, useCaseCatalogSchema } from "./use-cases";

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

/**
 * An organisation behind catalogue entries. `id` is its permanent code and page
 * address: name, website and contact can change, the code never does.
 */
export const organisationSchema = z.object({
  id: z.string().regex(/^[a-z0-9]{2,40}$/),
  name: z.string().min(1),
  website: z.string().url().optional(),
  /** Functional address only, never a person: the list is mirrored through git. */
  contact: z
    .object({
      name: z.string().optional(),
      email: z.string().email(),
    })
    .optional(),
});

/** One entry of a group: a use case listed in this catalogue, by its id. */
export const groupMemberSchema = z.object({
  id: z.string().min(3),
  optional: z.boolean().default(false),
  /** Why it belongs to the group, in one sentence. */
  note: z.string().optional(),
});

/**
 * Several use cases that belong together, e.g. a commune's Smart-City project.
 * Catalogue only: it names its members and installs nothing itself, so it has
 * no package, version or seal of its own.
 */
export const useCaseGroupSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(3),
  summary: z.string(),
  description: z.string().default(""),
  publisher: z.string(),
  publisherOrg: z.string().optional(),
  categories: z.array(z.string()).default([]),
  /** List order is the suggested order when `ordered` is set. */
  members: z.array(groupMemberSchema).min(2),
  ordered: z.boolean().default(false),
  story: z
    .object({
      problem: z.string().optional(),
      goal: z.string().optional(),
      next: z.string().optional(),
    })
    .optional(),
  /** Shown under „Worum es geht“. */
  links: z.array(entryLinkSchema).max(8).default([]),
  contact: z.object({ name: z.string().optional(), email: z.string().email() }).optional(),
  addedAt: z.iso.date().optional(),
  updatedAt: z.iso.date().optional(),
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
  organisations: z.array(organisationSchema).default([]),
  groups: z.array(useCaseGroupSchema).default([]),
});

export type DataStructureEntry = z.infer<typeof dataStructureEntrySchema>;

export type GroupMember = z.infer<typeof groupMemberSchema>;

export type UseCaseGroup = z.infer<typeof useCaseGroupSchema>;

export type Organisation = z.infer<typeof organisationSchema>;

export type RepoListIndex = z.infer<typeof repoListIndexSchema>;
