# Communication Design System

How this app **says** things. The sibling document
[`ui-design-system.md`](./ui-design-system.md) covers the technical layer —
tokens, fonts, shadcn setup, how to look like the CIVITAS/CORE portal. This one
sits above it: given those tokens, *which* one do you reach for, and what does
the reader learn from that choice.

One sentence version:

> **Visual weight encodes level. Colour encodes meaning. Nothing is decorative.**

## Why this exists

Written 2026-09-23 after an audit of the marketplace surfaces found:

- **20+ distinct card recipes** for what is conceptually one thing — a card.
  `rounded-md border bg-card p-5` (14×), `rounded-xl … p-5` (4×), `… p-6` (3×),
  `… p-6 lg:p-8` (3×), plus `p-3`, `p-4`, `p-8` one-offs.
- **`<h2>` rendered at four different sizes** (`text-sm`, `text-base`,
  `text-lg`, `text-xl`) — so an `h2` in one box was visually *smaller* than an
  `h3` in the box next to it.
- **`emerald` carrying three unrelated meanings** at once: the Verifiziert
  curation tier, "this has demo data", and "this is a use case".

Each choice was defensible where it was made. Together they stopped adding up
to anything, and a reader could no longer tell a section from a detail. That is
the failure this document exists to prevent.

---

## 1. The four levels

Every piece of UI sits at exactly one level. The level decides the heading, the
surface, the padding and the radius — all four together, never à la carte.

| | Level | Answers | Heading | Surface | Padding | Radius |
|---|---|---|---|---|---|---|
| **E1** | **Seite** | *What am I looking at?* | `text-3xl font-bold` (`lg:text-4xl` on a detail page) | none | — | — |
| **E2** | **Abschnitt** | *What question does this part answer?* | `text-xl font-semibold` | `border bg-card` | `p-6 lg:p-8` | `rounded-xl` |
| **E3** | **Karte** | *One coherent object.* | `text-sm font-semibold` | `border bg-card` | `p-5` | `rounded-lg` |
| **E4** | **Feld / Eintrag** | *One fact, or one item in a list.* | `text-xs text-muted-foreground` (the label) | none, or `border bg-background` | `p-3` – `p-4` | `rounded-md` |

Two rules fall straight out of the table, and both were being broken:

**Radius encodes nesting depth.** `xl` outside, `lg` in the middle, `md`
innermost. If you see a `rounded-xl` box inside a `rounded-md` box, something is
upside down.

**Padding shrinks with depth.** 8/6 → 5 → 3. A section breathes; a field does
not.

**Never let a lower heading outrank a higher one.** An `h3` must never be
visually larger than an `h2` on the same page. Use the level's heading size;
don't pick by taste.

### Two kinds of E3

E3 covers two things that share a surface but not a voice. Both are
`rounded-lg border bg-card`; only the heading differs, because the heading is
doing a different job.

| | **Panel** | **Listing card** |
|---|---|---|
| Where | a box of facts on a detail page | an entry in a catalog grid |
| Title is | a *label* for the contents | the *subject*, and the click target |
| Heading | `text-sm font-semibold` | `text-lg font-semibold` |
| Example | „Technische Eckdaten", „Auf einen Blick" | a use case in the catalog |

A listing card's title may therefore be larger than a Panel's. It must still
never outrank an `h2` on the same page — 18px against a 20px section heading
holds, 24px would not.

### Level within a level

A **group heading inside a card** (E3 → its own subsections, like the three
groups in the Steckbrief) is not a new level. It is an *eyebrow*:

```
text-[11px] font-semibold uppercase tracking-wide text-muted-foreground
```

Quiet, structural, scannable. It labels a region; it does not compete with the
card's own heading.

---

## 2. Spacing

Whitespace is the cheapest grouping signal available, so it has to be
consistent or it signals nothing.

| Between | Gap |
|---|---|
| E1 page bands | `gap-8` |
| E2 sections | `gap-6` |
| E3 cards inside a section | `gap-4` |
| E4 fields inside a card | `gap-3` |
| Label and its value | `gap-0.5` |

If two things are closer together than two other things, the reader reads them
as more related. That is not decoration — it is the layout making a claim, so
make it a true one.

### Rules mark boundaries, not rows

A hairline under every row is not structure — it is noise. The Steckbrief once
carried **12 horizontal rules for 10 fields**, at which point a group boundary
looked exactly like a row separator and the reader could see neither.

Rules appear only where a *region* ends. Rows inside a region are separated by
spacing. Twelve rules became four (card header plus three group boundaries) and
the box got shorter by 72px at the same time.

---

## 3. Filters: collapsed by default

Every facet is a **dropdown button**, never an expanded row of pills. This is
what every large shop converged on (Zalando, ASOS, H&M) and the reason is
purely about what the page is for: a catalog page exists to show results, so
the controls must not outweigh them.

The version this replaced stacked each facet as a labelled pill row and pushed
the first result roughly 400px down the page. Collapsed, the same nine facets
occupy one wrapping row.

Rules:

- **One row, collapsed.** With dropdowns there is no need for a "more filters"
  drawer — the buttons already fit.
- **The button always shows the facet NAME**, never the chosen value. A label
  that mutates into its own value makes the bar hard to scan and changes every
  button's width as you filter. How many values are selected goes in a count
  badge („Themengebiet ②"), and the button carries its own ✕. A toggle shows no
  badge — its count is always 1, and "(1)" on a yes/no control reads as "one of
  what?"; the active tint already says it is on.
- **A facet that cannot narrow anything is not rendered.** If every entry
  shares one value, the control is a lie about the data.
- The result count sits directly under the bar, so filtering visibly *does*
  something.

### The mode follows the data

Picking the wrong selection model produces a filter that contradicts itself.
Three modes, and which one applies is a property of the field, not a taste
call:

| Mode | When | Behaviour | Here |
|---|---|---|---|
| `multi` | categorical; an entry may carry several; people ask "A **or** B" | OR within the facet, AND across facets | Themengebiet, Siegel, Status, Herausgeber, Core-Version |
| `ordinal` | an ordered scale | choosing a step means **at most** that step | Aufbaukosten, laufende Kosten, Ressourceneinsatz |
| `toggle` | a yes/no property | one option, on or off | Demo-Daten, Kooperationsbedarf |

Two failures this fixed, both found by reading the screen rather than the code
(Ewa, 2026-09-23):

- **Themengebiet was single-select**, although a use case carries several
  categories — so "Umwelt or Mobilität" could not be asked at all.
- **Cost bands matched exactly.** The label said „M — unter 10.000 €" while the
  filter excluded an entry costing under 1.000 €. If a label states a
  threshold, the filter has to be one.

### Counts must reflect the other filters

**Every option shows how many entries it would leave** — a filter that might
return nothing is one nobody dares click, and an option that would return
nothing is disabled rather than hidden, so the reader still sees the value
exists.

That count is computed against everything filtered **except the facet's own
selection**. Counting over the whole catalog instead made the numbers lie the
moment a second filter was active: with „Siegel: Verifiziert" on, „Umwelt"
still advertised 2 results when the true answer was 0.

The facet is excluded from its own base set on purpose — otherwise picking one
value drives every sibling option to zero and the filter becomes a dead end.

---

## 4. Colour has exactly three jobs

Everything else is neutral: `bg-card`, `border`, `text-foreground`,
`text-muted-foreground`. If you cannot say which of the three jobs a colour is
doing, it should not be coloured.

### 4.1 Urteil — how sound is this?

The graded trust vocabulary, and **only** it. Owned by
`components/use-cases/use-case-status.tsx`; nothing else may use these hues for
anything else.

| | Meaning |
|---|---|
| emerald | Verifiziert · a fit check that passes |
| blue | Community |
| amber | Experimentell · caution · "you still have to supply something" |
| gray | Veraltet |

Colour never carries a judgement alone — every one of these ships an **icon and
a text label** too, because roughly 1 in 12 men cannot separate the red/green
axis, and because a colour means nothing to someone seeing the page for the
first time.

### 4.2 Identität — what kind of thing is this?

| | Kind |
|---|---|
| emerald | Anwendungsfall |
| orange | Add-on |
| primary (CIVITAS blue) | Datenstruktur |

Identity colour appears **only on an icon tile or a category chip** — never on
body text, never as a full card background. A 28–44px tinted square reads as an
avatar; tinted text reads as status, and would collide with §4.1.

In practice: `Panel` takes a `tone`, which tints its icon tile only. On the
use-case detail page the Steckbrief, demo-data, interfaces, artifacts and
technical panels all carry the green tile — enough repetition to mark the page
as a use case without a single coloured word.

**The one exemption:** a Panel whose CONTENT already uses colour as a judgement
stays neutral. „Passt zu dieser Instanz?" shows emerald ✓ and amber ⚠ rows, and
a green identity tile beside a green verdict makes the reader parse one green
as the other.

> **The known tension.** emerald means both "Verifiziert" (§4.1) and
> "Anwendungsfall" (§4.2). They never appear in the same component, so it holds
> — but it is the first thing to revisit if a third emerald meaning is ever
> proposed. It already happened once: demo data was emerald until 2026-09-23.

### 4.3 Aktion — what do I click?

`bg-primary text-primary-foreground` is the one primary action on a surface.
One per surface. Everything else is a link or a neutral button.

### What is *not* a colour job

Bands, counts, versions, dates, categories, technology names. These are facts,
not judgements. They get neutral badges. Tinting a cost band green would say
"cheap is good", which is a claim the catalog is not entitled to make.

---

## 5. Text

- **Labels** are `text-xs text-muted-foreground`. **Values** are `text-sm
  text-foreground`. Consistently, so a reader can skim labels or skim values.
- **Explain the word where it is used.** Terms from the funding world —
  Outcome, Impact, Wirkungslogik — carry a one-line gloss at the point of use.
  Nobody should have to know the vocabulary to read the page.
- **Don't repeat across boxes.** If two boxes state the same fact, delete the
  one without the verdict or context. (This removed a duplicated requirements
  list on 2026-09-23.)
- **Say what a thing is, not how exciting it is.** "Demo-Daten enthalten", not
  "Ohne eigene Daten ausprobieren" — the latter got read as a button, because a
  verb phrase on a coloured panel *is* a button as far as the reader is
  concerned.

### Empty is a state, not a gap

A missing value renders as an honest sentence ("Noch keine gemeldet"), or the
row disappears entirely. Never a blank cell, never a fabricated placeholder.
A field whose value would be the page's default everywhere (`Installationsweg:
Über das Portal`) is not shown at all.

---

## 6. Icons

One glyph, one meaning, app-wide.

| Glyph | Means | Owner |
|---|---|---|
| `Sparkles` | the AI assistant — **nothing else** | sidebar, assistant |
| `Download` | install | install button |
| `PlayCircle` | demo data | demo panel, demo pills |
| `ShieldCheck` / `Users` / `FlaskConical` | Verifiziert / Community / Experimentell | `use-case-status.tsx` |
| `PackagePlus` | contribute | sidebar, contribute CTA |
| `PackageCheck` | installed | sidebar |

`Sparkles` on the install button promised magic and was removed on 2026-09-23;
installing is a deterministic provisioning sequence.

---

## 7. Conventions

- **Code and comments in English. UI strings in German.** (Meta-repo working
  agreement.) Comments explain *why*, not *what*.
- German compounds break layouts. Card titles get `hyphens-auto break-words`;
  the root layout sets `lang="de"` so hyphenation lands correctly.
- A sticky element **may** be taller than the viewport, as long as its
  containing block is taller still: once the block's bottom is reached the
  element is pushed up and its lower end comes into view. It only traps content
  when element and containing block end together — then cap it with
  `max-h-[calc(100svh-1rem)] overflow-y-auto`, and accept the nested scrollbar.
  Measure before reaching for the cap; an earlier version of this rule assumed
  the trap without checking and cost the use-case rail its stickiness.

---

## 8. Applying it

The levels are implemented as components in
[`components/ui/layout.tsx`](../app/components/ui/layout.tsx) — `PageHeader`,
`Section`, `Panel`, `Eyebrow`, `FieldList`, `Field`. **Use them instead of
hand-writing the class strings**; that is the only thing that keeps recipe
count at one per level a year from now.

```tsx
<Section title="Was dieser Anwendungsfall bewirkt" lead="Die Wirkungslogik …">
  <Panel title="Input">…</Panel>
</Section>
```

### Review checklist

1. Is every box at a declared level, with that level's four properties?
2. Does any `h3` outrank an `h2`?
3. Does every colour do one of the three jobs — and does it ship an icon and a
   label?
4. Does any fact appear twice on the page?
5. Do the gaps match the grouping the content actually has?
6. Are jargon terms glossed where they appear?
