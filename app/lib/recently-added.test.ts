import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { mockRepoListIndex } from "@/lib/server/mock/fixtures/catalog";
import { recentlyAdded } from "./recently-added";

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
