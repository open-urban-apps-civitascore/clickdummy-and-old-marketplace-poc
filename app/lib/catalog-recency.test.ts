import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { byAddedAtDesc, formatCatalogDate } from "./catalog-recency";

describe("byAddedAtDesc", () => {
  test("sorts newest first", () => {
    const sorted = [{ addedAt: "2026-01-05" }, { addedAt: "2026-08-14" }, { addedAt: "2026-03-01" }]
      .sort(byAddedAtDesc)
      .map((entry) => entry.addedAt);
    assert.deepEqual(sorted, ["2026-08-14", "2026-03-01", "2026-01-05"]);
  });

  test("entries without a date sort last, and are not dropped", () => {
    const sorted = [{ addedAt: undefined }, { addedAt: "2026-02-02" }, { addedAt: undefined }].sort(
      byAddedAtDesc,
    );
    assert.equal(sorted.length, 3);
    assert.equal(sorted[0]?.addedAt, "2026-02-02");
    assert.equal(sorted[1]?.addedAt, undefined);
  });
});

describe("formatCatalogDate", () => {
  test("renders the date the author wrote, not the day before", () => {
    // The regression this guards: `new Date("2026-08-14")` is UTC midnight and
    // formats as the 13th in any timezone west of Greenwich. de-DE "medium"
    // renders "14.08.2026", so the day is the leading segment.
    assert.equal(formatCatalogDate("2026-08-14"), "14.08.2026");
  });

  test("absent and unparseable values render nothing", () => {
    assert.equal(formatCatalogDate(undefined), undefined);
    assert.equal(formatCatalogDate("irgendwann"), undefined);
  });
});
