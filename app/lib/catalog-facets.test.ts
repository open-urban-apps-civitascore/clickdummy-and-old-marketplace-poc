import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  activeFacetCount,
  applyCatalogFilters,
  baseEntriesForFacet,
  facetOptionCounts,
  facetOptions,
  isUsefulFacet,
  matchesFacet,
  matchesFacets,
  type CatalogFilterState,
  type FacetDef,
} from "./catalog-facets";
import { buildSearchIndex } from "./catalog-search";

type Row = { id: string; tags: string[]; band?: string; tier: string; text: string };

const ROWS: Row[] = [
  { id: "a", tags: ["Mobilität", "Verkehr"], band: "s", tier: "verified", text: "Verkehrszählung Musterhausen" },
  { id: "b", tags: ["Umwelt"], band: "l", tier: "verified", text: "Feinstaub Musterhausen" },
  { id: "c", tags: ["Umwelt", "Grünflächen"], tier: "experimental", text: "Baumkataster Musterstadt" },
];

const TAGS: FacetDef<Row> = {
  id: "kategorie",
  label: "Themengebiet",
  mode: "multi",
  valuesOf: (row) => row.tags,
};

const TIER: FacetDef<Row> = {
  id: "siegel",
  label: "Siegel",
  mode: "multi",
  valuesOf: (row) => [row.tier],
};

const BAND: FacetDef<Row> = {
  id: "kosten",
  label: "Aufbaukosten",
  mode: "ordinal",
  valuesOf: (row) => (row.band ? [row.band] : []),
  options: ["s", "m", "l", "xl"] as const,
};

const ALL = [TAGS, TIER, BAND];
const INDEX = buildSearchIndex(ROWS, (r) => r.id, (r) => `${r.text} ${r.tags.join(" ")}`);
const KEY = (r: Row) => r.id;

describe("facetOptions", () => {
  test("derived options are de-duplicated and sorted", () => {
    assert.deepEqual(facetOptions(TAGS, ROWS), ["Grünflächen", "Mobilität", "Umwelt", "Verkehr"]);
  });

  test("declared options keep their order but only offer what the data has", () => {
    assert.deepEqual(facetOptions(BAND, ROWS), ["s", "l"]);
  });
});

describe("matchesFacet — multi", () => {
  test("several values are ORed within the facet", () => {
    // The bug this guards: single-select made "Umwelt or Mobilität" impossible,
    // though a use case carries several categories.
    assert.ok(matchesFacet(TAGS, ROWS[0]!, ["Mobilität", "Umwelt"]));
    assert.ok(matchesFacet(TAGS, ROWS[1]!, ["Mobilität", "Umwelt"]));
    assert.ok(!matchesFacet(TAGS, ROWS[0]!, ["Grünflächen"]));
  });

  test("an empty selection matches everything", () => {
    assert.ok(matchesFacet(TAGS, ROWS[2]!, []));
  });
});

describe("matchesFacet — ordinal", () => {
  test('choosing a band means "at most", not "exactly"', () => {
    // The label says „M — unter 10.000 €", so an entry under 1.000 € MUST
    // match it. Exact equality made the filter contradict its own label.
    assert.ok(matchesFacet(BAND, ROWS[0]!, ["m"]), "s should match a ceiling of m");
    assert.ok(matchesFacet(BAND, ROWS[0]!, ["s"]));
    assert.ok(!matchesFacet(BAND, ROWS[1]!, ["m"]), "l must not match a ceiling of m");
    assert.ok(matchesFacet(BAND, ROWS[1]!, ["l"]));
  });

  test("an entry with no band never matches a band filter", () => {
    assert.ok(!matchesFacet(BAND, ROWS[2]!, ["xl"]));
  });
});

describe("matchesFacets", () => {
  test("facets are ANDed with each other", () => {
    assert.ok(matchesFacets(ROWS[1]!, ALL, { kategorie: ["Umwelt"], siegel: ["verified"] }));
    assert.ok(!matchesFacets(ROWS[2]!, ALL, { kategorie: ["Umwelt"], siegel: ["verified"] }));
  });
});

describe("option counts respect the other active filters", () => {
  const countsFor = (facet: FacetDef<Row>, state: CatalogFilterState) =>
    facetOptionCounts(
      facet,
      baseEntriesForFacet({
        entries: ROWS,
        facets: ALL,
        state,
        index: INDEX,
        keyOf: KEY,
        exceptFacetId: facet.id,
      }),
      facetOptions(facet, ROWS),
    );

  test("with no filters, counts are over the whole catalog", () => {
    const counts = countsFor(TAGS, { search: "", facets: {} });
    assert.equal(counts.get("Umwelt"), 2);
  });

  test("with another facet active, counts shrink to match reality", () => {
    // THE BUG: counts used to be taken over all entries, so with
    // „Siegel: Verifiziert" active, „Umwelt" still promised 2 while
    // the real answer is 1 (row "c" is experimental).
    const counts = countsFor(TAGS, { search: "", facets: { siegel: ["verified"] } });
    assert.equal(counts.get("Umwelt"), 1);
    assert.equal(counts.get("Grünflächen"), 0);
  });

  test("a facet does not count against its own selection", () => {
    // Otherwise picking one value would drive every sibling to zero and the
    // filter would become a dead end.
    const counts = countsFor(TAGS, { search: "", facets: { kategorie: ["Mobilität"] } });
    assert.equal(counts.get("Umwelt"), 2);
  });

  test("the active search narrows the counts too", () => {
    const counts = countsFor(TAGS, { search: "musterhausen", facets: {} });
    assert.equal(counts.get("Umwelt"), 1);
    assert.equal(counts.get("Grünflächen"), 0);
  });

  test("ordinal counts are cumulative, matching what selecting does", () => {
    const counts = countsFor(BAND, { search: "", facets: {} });
    assert.equal(counts.get("s"), 1);
    assert.equal(counts.get("l"), 2, "a ceiling of l includes the s entry");
  });
});

describe("applyCatalogFilters", () => {
  const run = (search: string, facets: Record<string, string[]> = {}) =>
    applyCatalogFilters({ entries: ROWS, facets: ALL, state: { search, facets }, index: INDEX, keyOf: KEY })
      .map((r) => r.id);

  test("search and facets compose", () => {
    assert.deepEqual(run("musterhausen"), ["a", "b"]);
    assert.deepEqual(run("", { kategorie: ["Umwelt"] }), ["b", "c"]);
    assert.deepEqual(run("musterhausen", { kategorie: ["Umwelt"] }), ["b"]);
  });

  test("a multi selection widens the result", () => {
    assert.deepEqual(run("", { kategorie: ["Umwelt", "Verkehr"] }), ["a", "b", "c"]);
  });

  test("an ordinal ceiling includes everything below it", () => {
    assert.deepEqual(run("", { kosten: ["l"] }), ["a", "b"]);
    assert.deepEqual(run("", { kosten: ["s"] }), ["a"]);
  });

  test("no filters returns everything", () => {
    assert.deepEqual(run(""), ["a", "b", "c"]);
  });
});

describe("isUsefulFacet", () => {
  test("hides a facet whose every entry shares one value", () => {
    const constant: FacetDef<Row> = { id: "weg", label: "Installationsweg", valuesOf: () => ["portal"] };
    assert.equal(isUsefulFacet(constant, ROWS), false);
  });

  test("KEEPS a single-option facet when some entries lack the value", () => {
    const partial: FacetDef<Row> = {
      id: "band",
      label: "Band",
      valuesOf: (row) => (row.band ? ["irgendeins"] : []),
    };
    assert.equal(isUsefulFacet(partial, ROWS), true);
  });

  test("keeps multi-option facets and drops empty ones", () => {
    assert.equal(isUsefulFacet(TAGS, ROWS), true);
    assert.equal(isUsefulFacet({ id: "x", label: "X", valuesOf: () => [] }, ROWS), false);
  });
});

describe("activeFacetCount", () => {
  test("counts only non-empty selections", () => {
    assert.equal(activeFacetCount({ kategorie: [], kosten: ["s"] }), 1);
    assert.equal(activeFacetCount({}), 0);
  });
});
