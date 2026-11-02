import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { USE_CASE_FACETS } from "@/lib/catalog-facet-defs";
import { facetOptions, type FacetDef } from "@/lib/catalog-facets";
import { mockRepoListIndex } from "@/lib/server/mock/fixtures/catalog";
import type { UseCase } from "@/types/use-cases";

const facet = (id: string): FacetDef<UseCase> => {
  const def = USE_CASE_FACETS.find((entry) => entry.id === id);
  assert.ok(def, `no use-case facet '${id}'`);
  return def;
};

const [sample] = mockRepoListIndex.useCases;
assert.ok(sample, "fixture catalog has no use case");

describe("use-case facets", () => {
  test("the status filter offers Idee and In Konzeption with no entry there yet", () => {
    const status = facet("status");
    const options = facetOptions(status, mockRepoListIndex.useCases);
    assert.deepEqual(options.slice(0, 2), ["idee", "entwurf"]);
    assert.deepEqual(options.slice(0, 2).map((value) => status.labelOf?.(value)), [
      "Idee",
      "In Konzeption",
    ]);
  });

  test("Themengebiet offers all eight topics, also those no entry carries", () => {
    const options = facetOptions(facet("kategorie"), mockRepoListIndex.useCases);
    assert.equal(options.length, 8);
    assert.ok(options.includes("Energie & Netze"));
  });

  test("Kooperationsbedarf puts every entry in exactly one of its two options", () => {
    const cooperation = facet("kooperation");
    const sought = { ...sample, implementation: { collaboration: { wanted: true } } };
    const declined = { ...sample, implementation: { collaboration: { wanted: false } } };
    const silent = { ...sample, implementation: undefined };

    assert.deepEqual(cooperation.valuesOf(sought), ["gesucht"]);
    assert.deepEqual(cooperation.valuesOf(declined), ["nicht-gesucht"]);
    // Said nothing about partners: has not sought any explicitly either.
    assert.deepEqual(cooperation.valuesOf(silent), ["nicht-gesucht"]);
    assert.equal(cooperation.labelOf?.("gesucht"), "Suche Mitstreiter");
    assert.equal(cooperation.labelOf?.("nicht-gesucht"), "Keine Mitstreiter explizit gesucht");
  });

  test("Nachnutzende filters by name", () => {
    const adopters = facet("nachnutzer");
    const entry = {
      ...sample,
      adopters: [{ name: "Stadt Beispielhausen" }, { name: "Gemeinde Musterbach" }],
    };
    assert.deepEqual(adopters.valuesOf(entry), ["Stadt Beispielhausen", "Gemeinde Musterbach"]);
    assert.deepEqual(adopters.valuesOf({ ...sample, adopters: [] }), []);
  });
});
