import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  emptyGroupDraft,
  groupDates,
  groupDraftProblem,
  groupFromDraft,
  groupListings,
  groupsContaining,
  isGroupVisible,
  joinGerman,
  moveMember,
  resolveMembers,
  selectionProblem,
  sharedStructures,
} from "@/lib/groups";
import { mockRepoListIndex } from "@/lib/server/mock/fixtures/catalog";

const { groups, useCases, organisations } = mockRepoListIndex;
const group = (id: string) => groups.find((entry) => entry.id === id)!;
const musterstadt = organisations.find((organisation) => organisation.id === "musterstadt");

describe("groups in the mock catalogue", () => {
  it("name only use cases that are listed", () => {
    for (const entry of groups) {
      assert.ok(resolveMembers(entry, useCases).every((member) => member.useCase), entry.id);
    }
  });

  it("give each member its groups, and keep a member that left the catalogue visible as missing", () => {
    assert.deepEqual(groupsContaining("musterhausen-feinstaub", groups).map((entry) => entry.id), [
      "saubere-luft-hauptstrasse",
      "klimaresilienz-musterstadt",
    ]);
    const withoutLaerm = useCases.filter((useCase) => useCase.id !== "musterhausen-laermmessung");
    const missing = resolveMembers(group("saubere-luft-hauptstrasse"), withoutLaerm).filter((member) => !member.useCase);
    assert.deepEqual(missing.map((member) => member.ref.id), ["musterhausen-laermmessung"]);
    assert.equal(groupListings([group("saubere-luft-hauptstrasse")], withoutLaerm)[0]!.members.length, 2);
  });

  it("find the data structures several members bring", () => {
    const members = groupListings([group("saubere-luft-hauptstrasse")], useCases)[0]!.members;
    assert.deepEqual(sharedStructures(members).map((structure) => [structure.title, structure.usedBy.length]), [["GeoPoint", 2]]);
    assert.equal(joinGerman(["A", "B", "C"]), "A, B und C");
  });

  it("sort by their own entry dates and their newest member's software date", () => {
    const listing = groupListings([group("saubere-luft-hauptstrasse")], useCases)[0]!;
    assert.deepEqual(groupDates(listing.group, listing.members), {
      addedAt: "2026-11-02",
      updatedAt: "2026-11-10",
      softwareUpdatedAt: "2026-10-08",
    });
  });
});

describe("a group in the filtered list", () => {
  const luft = group("saubere-luft-hauptstrasse");

  it("shows when one of its members does", () => {
    assert.equal(isGroupVisible(luft, new Set(["musterhausen-feinstaub"]), "", true), true);
    assert.equal(isGroupVisible(luft, new Set(["tree-register-starter"]), "", true), false);
  });

  it("shows for a search that names the group, unless a facet is set", () => {
    assert.equal(isGroupVisible(luft, new Set(), "tempo 30", false), true);
    assert.equal(isGroupVisible(luft, new Set(), "tempo 30", true), false);
  });
});

describe("proposing a group", () => {
  const ready = () => ({
    ...emptyGroupDraft(musterstadt),
    title: "Stadtgrün Musterstadt",
    slug: "stadtgruen-musterstadt",
    summary: "Bäume und Gießpaten zusammen.",
    members: [
      { id: "tree-register-starter", optional: false },
      { id: "musterstadt-giesspatenschaften", optional: true },
    ],
  });

  it("starts with this instance's organisation as Herausgeber", () => {
    assert.deepEqual(emptyGroupDraft(musterstadt).publisher, { name: "Stadt Musterstadt", code: "musterstadt" });
  });

  it("needs two members, not all of them optional", () => {
    assert.match(selectionProblem([{ id: "a", optional: false }]) ?? "", /mindestens zwei/);
    assert.match(selectionProblem([{ id: "a", optional: true }, { id: "b", optional: true }]) ?? "", /nicht optional/);
    assert.equal(selectionProblem(ready().members), undefined);
  });

  it("refuses a taken address and an organisation that is not on the list", () => {
    assert.equal(groupDraftProblem(ready(), groups), undefined);
    assert.match(groupDraftProblem({ ...ready(), slug: "klimaresilienz-musterstadt" }, groups) ?? "", /schon vergeben/);
    assert.match(groupDraftProblem({ ...ready(), publisher: { name: "Stadt X", code: "" } }, groups) ?? "", /^Herausgeber/);
  });

  it("checks links in the order of the form and drops empty rows", () => {
    const blank = { title: "", url: "", description: "" };
    const strategy = { title: "Strategie", url: "https://musterstadt.example/strategie", description: " Wo es herkommt. " };
    assert.equal(groupDraftProblem({ ...ready(), links: [blank, strategy] }, groups), undefined);
    assert.equal(
      groupDraftProblem({ ...ready(), links: [{ ...strategy, url: "http://musterstadt.example" }] }, groups),
      "Link 1: die Adresse braucht https, zum Beispiel https://musterstadt.example/projekt.",
    );
    assert.equal(groupDraftProblem({ ...ready(), links: [blank, { ...strategy, title: " " }] }, groups), "Link 2: bitte einen Titel.");
    assert.deepEqual(groupFromDraft({ ...ready(), links: [blank, strategy] }).links, [
      { title: "Strategie", url: "https://musterstadt.example/strategie", description: "Wo es herkommt." },
    ]);
  });

  it("moves a member by one place and builds the catalogue row without empty parts", () => {
    assert.deepEqual(moveMember(ready().members, 1, -1).map((member) => member.id), [
      "musterstadt-giesspatenschaften",
      "tree-register-starter",
    ]);
    const row = groupFromDraft(ready());
    assert.equal(row.story, undefined);
    assert.equal(row.contact, undefined);
    assert.equal(row.publisherOrg, "musterstadt");
  });
});
