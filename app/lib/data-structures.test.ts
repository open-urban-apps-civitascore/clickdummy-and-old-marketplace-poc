import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { mockRepoListIndex } from "@/lib/server/mock/fixtures/catalog";
import { countDependentUseCases, logicalUrn, dependentUseCases } from "./data-structures";

const GEO_POINT = "urn:core:platform:civitas:datastructure:common:GeoPoint:1.0.0";
const TREE_RECORD = "urn:core:platform:civitas:datastructure:demo:TreeRecord:1.0.0";

describe("logicalUrn", () => {
  test("strips an explicit version", () => {
    assert.equal(logicalUrn(GEO_POINT), "urn:core:platform:civitas:datastructure:common:GeoPoint");
  });

  test("leaves a logical URN alone", () => {
    const logical = "urn:core:platform:civitas:datastructure:common:GeoPoint";
    assert.equal(logicalUrn(logical), logical);
  });
});

describe("dependentUseCases", () => {
  const useCases = mockRepoListIndex.useCases;

  test("counts every use case that includes the structure", () => {
    // GeoPoint is the shared element — that it is reused twice IS the argument
    // for listing data structures separately.
    assert.equal(countDependentUseCases(GEO_POINT, useCases), 2);
    assert.equal(countDependentUseCases(TREE_RECORD, useCases), 1);
  });

  test("matches regardless of whether the catalog row carries a version", () => {
    const logical = logicalUrn(GEO_POINT);
    assert.equal(countDependentUseCases(logical, useCases), countDependentUseCases(GEO_POINT, useCases));
  });

  test("does not match a structure whose name merely starts the same", () => {
    assert.equal(countDependentUseCases(`${TREE_RECORD.replace(":1.0.0", "Archive:1.0.0")}`, useCases), 0);
  });

  test("returns the entries themselves, so a card can link them", () => {
    const titles = dependentUseCases(GEO_POINT, useCases).map((useCase) => useCase.title);
    assert.equal(titles.length, 2);
    assert.ok(titles.every((title) => typeof title === "string" && title.length > 0));
  });

  test("every data-structure row in the fixture is referenced by at least one use case", () => {
    // Guards against an orphaned row: a data structure nothing builds on has no
    // reuse story and is almost always an authoring mistake.
    for (const entry of mockRepoListIndex.dataStructures) {
      assert.ok(
        countDependentUseCases(entry.id, useCases) > 0,
        `data structure '${entry.id}' is used by no use case`,
      );
    }
  });
});
