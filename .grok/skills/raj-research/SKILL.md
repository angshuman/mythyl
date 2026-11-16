---
name: raj-research
description: >
  Research and write sourced JSON campaigns, incidents, and actors for the
  mythyl.art colonial map at /raj (East India Company and British Crown,
  1757–1947). Use when adding Raj/colonial events, filling gaps in
  src/data/raj/, researching famines, massacres, conquests, adivasi risings,
  or the independence movement, or when the user runs /raj-research.
---

# Raj research

Write **JSON records only** under `src/data/raj/`. Do not edit React, CSS, or map components. Schema is `src/lib/raj/schema.ts`. Copy shape from `campaigns-conquest.json` and `incidents-conquest.json`.

Loaders already concatenate the extra drops: `campaigns-wars|tribal|famine|endgame|revolution.json`, matching `incidents-*` and `actors-*`. Overwrite the assigned files. Leave other JSON alone.

## Voice

Academic and direct. Name colonialism, massacre, famine policy, collective punishment, transportation. No invented death counts. No cool one-liners. Public history copy.

## Record rules

- A **campaign** is a span (`Conflict`). An **incident** is a dated day inside a campaign.
- Required on a campaign: `id`, `slug`, `name`, `summary`, `scale`, `scaleRationale`, `types`, `family`, `theaters`, `northeast`, `rule`, `internalExternal`, `direction`, `religiousDimension`, `identityDimensions`, `resources`, `time`, `locations`, `primaryPoint`, `parties`, `peoples`, `sources`, `confidence`, `status`.
- Required on an incident: `id`, `conflictId`, `name`, `kind`, `time`, `place` (lon/lat + precision), `summary`, `sides`, `casualties`, `reports`, `confidence`.
- Every incident needs **at least one `reports[]` entry with a live `url`** (Britannica, NAM, BBC, Hansard, The Hindu, Indian Express, archive.org, British Library, academic DOI). Verify the URL.
- Harm is an `Estimate` range with `sources` and `contested`. Missing count = unknown, not zero.
- Locked bands: Jallianwala Hunter 379 vs Congress ~1000–1500; Bengal 1943 ~2.1–3m (Sen/Maharatna); 1770 traditional ~10m contested; 1876–78 ~5–8.3m contested. Do not invent an 1857 integer.
- Coordinates must match precision. Do not plot a village marker for a presidency-scale famine (`precision: "theater"` or `"region"`).
- `rule`: `"company"` until 1858, `"crown"` after. `status`: `"published"`. `northeast: true` only for Assam/Manipur/Naga/Lushai/Khasi/Jaintia events.
- IDs kebab-case, unique. New `actorId` values must exist in the matching `actors-*.json`. Reuse `eic` and `britain-crown` from `actors.json`.
- `family` must be one of: conquest, annexation, revolt, tribal, peasant, massacre, agitation, famine, penal.

## Do not duplicate these campaign ids

plassey-1757, anglo-mysore, anglo-maratha, sindh-1843, anglo-sikh, anglo-burmese, awadh-1856, doctrine-of-lapse, santhal-hul, revolt-1857, indigo-1859, pabna-1873, deccan-riots-1875, munda-ulgulan, champaran-1917, mappila-1921, rampa-1922, bengal-famine-1770, great-famine-1876, bengal-famine-1943, jallianwala-1919, qissa-khwani-1930, partition-bengal-1905, rowlatt-1919, non-cooperation-1920, civil-disobedience-1930, quit-india-1942, chittagong-armoury, kakori-1925, lahore-conspiracy, rin-mutiny-1946, cellular-jail, komagata-maru

Extra days **may** point `conflictId` at those existing campaigns.

## Assigned drops

| Files | Add (6–8 campaigns, ≥1 sourced day each) |
|---|---|
| `campaigns-wars.json` `incidents-wars.json` `actors-wars.json` | Buxar 1764, Carnatic/Wandiwash, Rohilla 1774, Polygar wars, Vellore 1806, Anglo-Nepal 1814–16, First Anglo-Afghan 1839–42, Second Anglo-Afghan 1878–80. Extra days on existing conquest campaigns: Pollilur, Kirkee/Koregaon, Sobraon, Chillianwala. |
| `campaigns-tribal.json` `incidents-tribal.json` `actors-tribal.json` | Paika 1817, Kol 1831–32, Khasi 1829–33, Anglo-Manipur 1891, Bastar Bhumkal 1910, Kuki 1917–19, Lushai or Naga Hills expeditions. |
| `campaigns-famine.json` `incidents-famine.json` `actors-famine.json` | Chalisa 1783–84 or Doji bara 1791–92, Orissa 1866 (Na'anka), Rajputana 1868–70, 1896–97, 1899–1900 (Chhappania Kal). Company/Crown policy in the summary. |
| `campaigns-endgame.json` `incidents-endgame.json` `actors-endgame.json` | Kuka/Namdhari executions 1872, Nankana Sahib 1921, Hijli firing 1931, Direct Action Day 1946, Noakhali 1946, Partition massacres 1947. Family `massacre` unless the event is clearly agitation. |
| `campaigns-revolution.json` `incidents-revolution.json` `actors-revolution.json` | Phadke 1879, Chapekar 1897, Alipore/Muzaffarpur 1908, Ghadr 1915, Singapore mutiny 1915, INA 1943–45, Telangana 1946–47. Family `agitation` (INA, Ghadr) or `peasant` (Telangana). |

## Method

1. Read `schema.ts` and one existing campaign + incident.
2. Web-search each event; open the source pages; keep only facts the page supports.
3. Write pretty-printed JSON arrays (2-space indent) to the three assigned files.
4. Every campaign has ≥1 incident. Every incident has ≥1 `url`.
