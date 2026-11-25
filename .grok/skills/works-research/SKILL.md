---
name: works-research
description: >
  Research and write sourced JSON public-works records and later commissions
  for the mythyl.art atlas at /works (India after 1947). Use when densifying
  dams, irrigation, steel, plants, ports, roads, rail, power, nuclear, space,
  campuses, bridges, airports, new towns, or water works, adding named
  openings to existing projects, or when the user runs /works-research.
---

# Works research

Write **JSON only** to `src/data/works/research/<kind>.json`. Do not edit React, CSS, `projects.json`, essays, metro records, or other kinds.

Read `src/lib/works/schema.ts` and the existing records of your kind in `src/data/works/projects.json`. Copy voice and field shape from those records. Metro (`calcutta-metro`, `delhi-metro`) is the density model: one named work, one map marker, `opened` = first public use, later named openings as `commissions`.

## Output

Pretty-printed 2-space JSON:

```json
{
  "kind": "steel",
  "commissions": {
    "bhilai-steel": [
      { "year": 1987, "name": "Blast furnace 6", "sources": [{ "title": "…", "url": "https://…", "year": 1987 }] }
    ]
  },
  "summaries": {
    "bhilai-steel": "Optional rewritten 2–4 sentence summary if later stages change the story."
  },
  "additions": []
}
```

`commissions` keys must be ids already in `projects.json` of this kind. `additions` are full `WorkProject` objects of this kind. Omit a key rather than emit an empty placeholder.

## Record rules

- `opened` is first commercial or public use. Do not duplicate that first unit as a commission.
- A commission is a sourced public opening of a new named stretch, line, unit, terminal, pad, blast furnace, powerhouse, stage, or building of the **same** work.
- Same-year distinct openings are allowed.
- Inclusion: inaugural public/commercial use of a named asset. Out: foundations, package awards, trial runs, extra platforms, lounge fit-outs, NHAI km-this-quarter, Bharatmala/GQ/NS-EW packages, Smart Cities, every IIT, every station.
- Programmes are not assets. Bharatmala, Golden Quadrilateral section dumps, and “all IITs” stay out. Named expressways, mills, ports, and campuses are assets.
- Wikipedia is discovery only. Never put `wikipedia.org` in `sources[].url` or displacement urls.
- Displacement only when a page states a count or dispute; competing counts side by side, never averaged. Omit if unknown.
- No invented death, cost, or displacement figures. Omit cost unless the source makes it the only way to identify the asset.
- Voice: 2–4 academic sentences. Name operator, first section, inauguration date/who. No slogans.
- IDs kebab-case, unique across the whole atlas. `kind` must match the assignment. `scale` landmark | trunk | civic. `status` open | ongoing | stalled | closed.
- Place: real lon/lat of the named site (not a state centroid). `precision` site for dams/bridges/ports/plants; city for campuses and metros; corridor for roads/rail; district when that is all the source supports.
- `path` 3–5 corridor points for roads/rail; `null` for point sites.
- `states` use the live GADM-style names already in the file (Telangana folded into Andhra only on the states map — works records may name Telangana).
- Every commission and every addition needs at least one live `url` you opened. PIB often 403s; keep a PIB url only if a search snippet from that PRID confirms the date and name. Never invent a url.
- YEAR_MIN 1947. `started` may be earlier for works finished after independence. Commission years ≤ current year (2026). Future-dated openings do not belong unless already in public commercial use.

## Assigned kinds

Run **one kind**. Metro is done — do not write `research/metro.json`.

| kind | commissions grain | additions (cap) | skip |
|---|---|---|---|
| airport | later named terminal of the **same** airport | 3–6 extra greenfields or Union-scale terminals | lounge expansions; IGI T1 on the `igi-t3` record; extra stands |
| bridge | later named span/carriageway of the **same** crossing | 6–10 named post-1947 bridges | every flyover; Setu Bharatam as a programme |
| campus | permanent-site or later named school of the **same** campus | 6–10: IIT Guwahati, Roorkee conversion, Hyderabad, IIM Ahmedabad, IISc post-47 work, a few 2012 AIIMS — not all 23 IITs | every NIT/IIM |
| city | later notified node/phase of the **same** new town | 3–6 planned capitals/towns (Noida, Atal Nagar, New Town Kolkata) | Smart Cities Mission |
| dam | later named powerhouse/stage/unit COD | 4–8 river-valley landmarks (Salal, Nathpa Jhakri, Kishanganga, Dulhasti…) | remaining units without COD; height raise without a named unit |
| irrigation | later named stage of the **same** canal | 4–8 major canals (Narmada main, Telugu Ganga, Upper Krishna canals…) | every distributary |
| plant | later named unit/SEZ/field of the **same** works | 4–8 refineries or heavy plants | every private petrochemical |
| port | later named terminal of the **same** port | 4–8 major/notified ports | every minor jetty |
| power | later named unit/phase of the **same** station or park | 6–10 NTPC super thermals, UMPP, large solar parks | every state thermal; rooftop solar |
| nuclear | later NPCIL commercial-operation units missing from the record | only a commercial station not already mapped | every small extension; Wikipedia dates that contradict NPCIL All Plants |
| rail | later named section of Konkan / USBRL / DFC | 3–6 named new lines (Sivok–Rangpo, Jiribam–Imphal…) | Vande Bharat rolling stock; every gauge conversion |
| road | PIB/newspaper named **section** of an existing expressway | 4–8 named expressways | GQ, NS-EW, Bharatmala packages |
| space | later named pad/range of the **same** centre | 2–4 centres (URSC, LPSC) | missions (Chandrayaan) as works |
| steel | later named blast furnace / expansion stage of the **same** mill | 3–6 mills (IISCO Burnpur, Salem, NMDC Nagarnar, JSW Vijayanagar) | every private mini-mill; Tata Jamshedpur (pre-1947 plant) unless a post-47 named expansion is the record |
| water | later named DVC dam/barrage of the **same** corporation, or later Farakka stage | 3–6 barrages | every anicut |

Existing nuclear and some rail/road/dam records already have ticks. Add only **missing** named openings, never duplicates of names or years already on the record.

## Method

1. Filter `projects.json` to this kind. Note existing commission names so you do not repeat them.
2. Web-search each living work for later public openings; open the source page; keep only facts the page supports.
3. Search for missing national-atlas works of this kind; add only those you can source.
4. Write `src/data/works/research/<kind>.json`. Leave other files alone.
