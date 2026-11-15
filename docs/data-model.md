# Conflict data model (internal)

Not shown on the public site. The `/conflicts` page is for readers of history,
culture, and social impact. Keep this file, `schema.ts`, and `FIELD_GROUPS`
for development.

# Conflict data model

Permissive, nested, sourced. A record can be a war, an insurgency, a riot, or a
single morning. Visualization is a later pass over these fields.

Live records are JSON: `src/data/conflicts/campaigns.json`, `incidents.json`,
`naxal-events.json` (concatenated into incidents), `actors.json`,
`families.json`, under `ontology.json`. Research agents write those JSON files
only. TypeScript types live in `src/lib/conflicts/schema.ts`. `FIELD_GROUPS` is
the same model for development. None of this is shown on the public `/conflicts`
page. Map colour is `Conflict.family` → `families.json`. Scale is marker size.

## Must-have groups

1. **Identity** — id, slug, name, aliases, summary, narrative, status, confidence
2. **Scale and type** — small/medium/large + rationale (size); `family` legend type (colour: naxal, naga, bodo, northeast, kashmir, punjab, communal, external, interstate, integration); stacked types; theaters; northeast flag; two-sided / one-sided; internal / external / mixed / transnational
3. **Time** — fuzzy dates (day/month/year/decade), circa, ongoing, phases, nested events
4. **Place** — primary WGS84 point with precision; locations[] as point/polygon/admin; admin hierarchy; disputed; bbox/geometry for zoom
5. **Actors** — reusable actor table; roles; splinter/merge/parent; external support (sanctuary, arms, training, funds) marked contested
6. **Peoples** — tribe, ethnicity, religion, caste, language, nationality; identityDimensions[]; religiousDimension as central/present/absent/contested
7. **Stakes and law** — resources with centrality; AFSPA / Inner Line / UAPA; accords
8. **Harm** — min/max/best, civilian vs combatant, displacement, every number sourced
9. **Relations** — previous, next, parent, child, related, overlapping, revenge, ceasefire, accord
10. **Historiography** — competing claims, attributed

## Scale (map encoding, recodable)

- **Small** — local or short; typically under the low hundreds dead, or geographically tight
- **Medium** — multi-district or multi-year; hundreds dead or large displacement
- **Large** — interstate war, national rupture, or a decades-long multi-state insurgency

This sits *beside* UCDP’s 25/1,000 battle-death thresholds, which miss Nellie and 1984.

## Incidents (sub-model)

A campaign is a span. An **incident** is a day: a raid, a bombing, a morning
of killing. Stored in `src/data/conflicts/incidents.json`, not on the public page
as a schema lecture. The map draws them as small squares; hover shows:

- who stood on which **side** (attacker / target, civilian / state-forces / insurgent)
- **people killed**, as a claim with a range and who published it
- a **news or commission excerpt** (informational text, attributed)

Do not invent a single death integer. Two casualty objects if both sides died.

## Precision contract

Never plot a village marker for a state-level fact. `GeoPrecision` controls
marker size and when a point is allowed to appear on zoom.
