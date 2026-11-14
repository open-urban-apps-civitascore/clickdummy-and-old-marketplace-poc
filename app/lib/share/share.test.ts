import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getShareDatasets, type ShareDataset } from "@/lib/share/datasets";
import { byKind } from "@/lib/share/kinds";
import { emptyMetadata, LEAD_CODE_PATH, LEAD_PATH } from "@/lib/share/metadata";
import { slugify } from "@/lib/share/names";
import {
  composeLead,
  departmentOf,
  isFollowing,
  leadAfterPick,
  organisationProblem,
  organisationsProblem,
  shownDepartment,
  similarOrganisation,
  suggestedCode,
  withLeadDefault,
} from "@/lib/share/organisations";
import { buildPreview } from "@/lib/share/preview";
import { startingBasics, steckbriefProblem } from "@/lib/share/steckbrief";
import type { Organisation } from "@/types/repo-list";

const MUSTERSTADT: Organisation = { id: "musterstadt", name: "Stadt Musterstadt", website: "https://musterstadt.example" };
const MUSTERHAUSEN: Organisation = { id: "musterhausen", name: "Stadt Musterhausen" };
const LISTED = [MUSTERSTADT, MUSTERHAUSEN];
const dataset = (id: string): ShareDataset => getShareDatasets().find((row) => row.id === id)!;

describe("the Steckbrief's start", () => {
  it("starts a new share from the dataset and this instance's organisation, never a person", () => {
    const basics = startingBasics(dataset("radverkehr"), MUSTERSTADT);
    assert.deepEqual(
      { maintainer: basics.maintainer, maintainerOrg: basics.maintainerOrg, slug: basics.slug, version: basics.version },
      { maintainer: "Stadt Musterstadt", maintainerOrg: "musterstadt", slug: "radverkehrszaehlung-innenstadt", version: "1.0.0" },
    );
    assert.equal(startingBasics(dataset("radverkehr"), undefined).maintainer, "");
  });

  it("starts a listed entry's next version from the catalogue", () => {
    const basics = startingBasics(dataset("baumkataster"), MUSTERHAUSEN);
    assert.deepEqual(
      { displayName: basics.displayName, maintainer: basics.maintainer, version: basics.version, slug: basics.slug },
      { displayName: "Baumkataster Starter App", maintainer: "Stadt Musterstadt", version: "1.0.1", slug: "baumkataster-starter" },
    );
  });
});

describe("what stops the preview", () => {
  const ready = () => ({ basics: startingBasics(dataset("radverkehr"), MUSTERSTADT), metadata: emptyMetadata() });

  it("passes a complete Steckbrief, with the lead following the Herausgeber", () => {
    const { basics, metadata } = ready();
    assert.equal(steckbriefProblem(dataset("radverkehr"), basics, metadata, LISTED), undefined);
  });

  it("asks for a listed or proposed Herausgeber, and a lead that starts with its name", () => {
    const { basics, metadata } = ready();
    assert.match(steckbriefProblem(dataset("radverkehr"), { ...basics, maintainer: "Erika Mustermann", maintainerOrg: "" }, metadata, LISTED) ?? "", /^Herausgeber: bitte/);
    const lead = { ...metadata, fields: { ...metadata.fields, [LEAD_PATH]: "Umweltamt", [LEAD_CODE_PATH]: "musterhausen" } };
    assert.equal(steckbriefProblem(dataset("radverkehr"), basics, lead, LISTED), "Federführende Organisation: der Eintrag muss mit „Stadt Musterhausen“ beginnen.");
  });

  it("checks the address, the version and the contact as the marketplace does", () => {
    const { basics, metadata } = ready();
    assert.match(steckbriefProblem(dataset("radverkehr"), { ...basics, slug: "-radverkehr" }, metadata, LISTED) ?? "", /^Kurzname/);
    assert.match(steckbriefProblem(dataset("baumkataster"), { ...startingBasics(dataset("baumkataster"), MUSTERSTADT), version: "1.0.0" }, metadata, LISTED) ?? "", /muss höher sein, zum Beispiel 1\.0\.1/);
    const contact = { ...metadata, fields: { ...metadata.fields, "contact.name": "Team Smart City" } };
    assert.equal(steckbriefProblem(dataset("radverkehr"), basics, contact, LISTED), "Kontakt: bitte eine E-Mail oder eine Kontaktseite angeben.");
  });
});

describe("organisations in the share", () => {
  it("holds a code to its name", () => {
    assert.equal(organisationsProblem({ name: "Musterstadt", code: "musterstadt" }, { operator: "", operatorOrg: "" }, LISTED), "Herausgeber: die gewählte Organisation heißt „Stadt Musterstadt“.");
    assert.match(organisationsProblem({ name: "Stadt X", code: "x1" }, { operator: "", operatorOrg: "" }, LISTED) ?? "", /nicht im Katalog/);
  });

  it("checks a proposal by the catalogue's rules", () => {
    assert.equal(organisationProblem({ id: "leipzig", name: "Stadt Leipzig", contact: { email: "digital@leipzig.example" } }), undefined);
    assert.equal(organisationProblem({ id: "leipzig", name: "Stadt Leipzig", website: "http://leipzig.example" }), "die Website braucht eine https-Adresse");
    assert.equal(organisationProblem({ id: "L", name: "Stadt Leipzig" }), "das Kürzel braucht 2 bis 40 Kleinbuchstaben oder Ziffern");
  });

  it("fills an empty lead with the Herausgeber, keeps a department as typed, drops it with another organisation", () => {
    assert.deepEqual(withLeadDefault({ operator: "", operatorOrg: "" }, { name: "Stadt Musterstadt", code: "musterstadt" }), { operator: "Stadt Musterstadt", operatorOrg: "musterstadt" });
    assert.equal(shownDepartment(composeLead("Stadt Musterstadt", "Amt "), "Stadt Musterstadt", "Amt "), "Amt ");
    assert.equal(departmentOf("Stadt Musterstadt – Umweltamt", "Stadt Musterstadt"), "Umweltamt");
    assert.deepEqual(leadAfterPick({ operatorOrg: "musterstadt", department: "Umweltamt" }, { name: "Stadt Musterhausen", code: "musterhausen" }), {
      operator: "Stadt Musterhausen",
      operatorOrg: "musterhausen",
    });
    assert.equal(isFollowing(true, true, { operator: "", operatorOrg: "" }), false);
  });

  it("suggests codes and near names without false alarms on short codes", () => {
    assert.equal(suggestedCode("Stadt Leipzig"), "leipzig");
    assert.equal(similarOrganisation("Musterhausen", LISTED), MUSTERHAUSEN);
    assert.equal(similarOrganisation("Augsburg", [{ id: "au", name: "Markt Au" }]), undefined);
  });
});

describe("the package preview", () => {
  it("lists what stays behind and what an installation asks for, the same each time", () => {
    const basics = startingBasics(dataset("radverkehr"), MUSTERSTADT);
    const preview = buildPreview(dataset("radverkehr"), basics, 1);
    assert.equal(preview.id, "urn:openurbanapps:usecase:radverkehrszaehlung-innenstadt");
    assert.deepEqual(preview.stripped, ["core-ir/mqtt-zaehlstellen-innenstadt.datasource.json: password (Passwort)"]);
    assert.ok(preview.files.some((file) => file.path.endsWith(".simulation.json")));
    assert.deepEqual(buildPreview(dataset("radverkehr"), basics, 1), preview);
  });

  it("keeps a listed entry's data structures and leaves out demo data nobody ticked", () => {
    const preview = buildPreview(dataset("baumkataster"), startingBasics(dataset("baumkataster"), MUSTERSTADT), 0);
    assert.deepEqual(preview.identities.filter((identity) => identity.kind === "datastructure").map((identity) => identity.kept), [true]);
    assert.ok(!preview.files.some((file) => file.path.endsWith(".simulation.json")));
  });

  it("orders parts as the data flows and names addresses as the catalogue does", () => {
    assert.deepEqual(byKind(dataset("radverkehr").parts).map((group) => group.kind), ["source", "mapping", "structure", "pipeline", "sink"]);
    assert.equal(slugify("Parkplatzbelegung (Test)"), "parkplatzbelegung-test");
  });
});
