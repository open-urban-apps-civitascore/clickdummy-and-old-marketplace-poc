import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { mockRepoListIndex } from "@/lib/server/mock/fixtures/catalog";
import { recentlyAdded, recentlyAddedByKind } from "./recently-added";

const INPUT = {
  useCases: mockRepoListIndex.useCases,
  dataStructures: mockRepoListIndex.dataStructures,
  addons: mockRepoListIndex.addons,
};

describe("recentlyAdded", () => {
  test("mixes all three catalog kinds into one list", () => {
    const kinds = new Set(recentlyAdded(INPUT, 20).map((entry) => entry.kind));
    assert.deepEqual([...kinds].sort(), ["addon", "data-structure", "use-case"]);
  });

  test("is sorted newest first and respects the limit", () => {
    const rows = recentlyAdded(INPUT, 5);
    assert.equal(rows.length, 5);
    const dates = rows.map((row) => row.addedAt ?? "");
    assert.deepEqual(dates, [...dates].sort().reverse());
  });

  test("keeps undated entries instead of dropping them", () => {
    const rows = recentlyAdded(
      {
        useCases: [],
        dataStructures: [],
        addons: [{ ...INPUT.addons[0]!, addedAt: undefined }],
      },
      6,
    );
    assert.equal(rows.length, 1);
    assert.equal(rows[0]?.addedAt, undefined);
  });

  test("every row carries a usable link and a publisher", () => {
    for (const row of recentlyAdded(INPUT, 20)) {
      assert.ok(row.href.startsWith("/marketplace/"), row.href);
      assert.ok(row.meta.length > 0, `${row.id} has no publisher`);
    }
  });
});

describe("recentlyAddedByKind", () => {
  test("returns one section per catalog kind, in a fixed order", () => {
    const sections = recentlyAddedByKind(INPUT);
    assert.deepEqual(
      sections.map((section) => section.kind),
      ["use-case", "data-structure", "addon"],
    );
  });

  test("previews at most `perKind`, newest first, but reports the real total", () => {
    const [, , addons] = recentlyAddedByKind(INPUT, 3);
    assert.equal(addons!.entries.length, 3, "preview is capped");
    assert.equal(addons!.total, INPUT.addons.length, "total counts the whole section");
    const dates = addons!.entries.map((entry) => entry.addedAt ?? "");
    assert.deepEqual(dates, [...dates].sort().reverse());
  });

  test("every entry in a section really is of that kind", () => {
    for (const section of recentlyAddedByKind(INPUT)) {
      for (const entry of section.entries) assert.equal(entry.kind, section.kind);
    }
  });

  test("an empty section is returned rather than dropped", () => {
    // The column has to render "noch nichts eingetragen" rather than vanish.
    const sections = recentlyAddedByKind({ useCases: [], dataStructures: [], addons: [] });
    assert.equal(sections.length, 3);
    assert.ok(sections.every((section) => section.entries.length === 0 && section.total === 0));
  });
});
