# Post-independence armed and large-scale violent conflict in India, 1947–present

A research briefing for a data-visualization project. Purpose: understanding plus infotainment — serious, not sensational. Competing claims are recorded as claims. Casualty figures are ranges with sources; precise counts are not invented.

**Scope.** Republic of India from 15 August 1947 to late 2026. Disputed territories (Jammu & Kashmir / Pakistan-administered areas / Aksai Chin / the China-claimed portion of Arunachal Pradesh / Siachen) appear as they do in standard conflict datasets; this briefing does not adjudicate sovereignty. Included: interstate wars, insurgencies, separatist movements, communal and ethnic mass violence, one-sided violence, major military operations, Maoist/Naxal conflict, Northeast insurgencies, Kashmir, Punjab/Khalistan, princely-state integration, and border campaigns. Excluded: ordinary crime and purely non-violent protest.

**How to read casualty numbers.** Almost every large Indian episode has at least two counts: an official (often Ministry of Home Affairs, state government, or army) figure and one or more civil-society, commission, or academic figures. Official series typically split deaths into civilians / security forces / “terrorists” or “extremists,” a classification that is itself a claim. News-compiled series (SATP, ACLED, GTD) inherit media bias toward cities, English-language reporting, and spectacular events. UCDP and Correlates of War apply annual death thresholds that drop many high-fatality riots. When sources disagree, this briefing gives the range.

---

## 1. Academic and dataset landscape

India is over-documented at the national-year level and under-documented at village-day precision. No single dataset can drive a map of “conflict in India” without a nested model (event ⊂ campaign ⊂ theater) and a way to show disagreement.

### 1.1 UCDP / PRIO Armed Conflict Dataset (ACD)

- **What it codes.** State-based armed conflict: a contested incompatibility over government and/or territory, use of armed force between two parties of which at least one is a state, **≥25 battle-related deaths in a calendar year**. Intensity: *minor* (25–999) vs *war* (≥1,000) in that year. Types: extrasystemic, interstate, intrastate, internationalized intrastate. Unit is the conflict-year (Gleditsch et al. 2002; Pettersson & Öberg / Davies et al., *Journal of Peace Research*, annual updates; codebook UCDP/PRIO ACD v.26.1).
- **Coverage.** 1946–present. India is country code 750.
- **India use.** Codes First Kashmir War, 1962 Sino-Indian, 1965, 1971, Kargil; Punjab/Khalistan (from 1983 in UCDP narratives); Kashmir insurgency (from 1989 as state-based territorial conflict, actor often lumped as “Kashmir insurgents”); Naga, Manipur, Assam, Tripura, Bodoland, CPI-Maoist and predecessor factions, and others when the 25-death threshold is met.
- **Thresholds that matter.** 25 deaths/year/dyad; “formally organized” opposition; incompatibility must be government or territory. Spontaneous riots, pogroms, and many one-day massacres **do not enter ACD** even if they kill thousands (Nellie 1983, Delhi 1984, Gujarat 2002), unless UCDP recodes them as non-state conflict or one-sided violence in other products.
- **Geo precision.** ACD is conflict-year, not geocoded.
- **Known India biases.** (1) Lumps dozens of Kashmiri groups as “Kashmir insurgents,” hiding splits (JKLF vs Hizbul Mujahideen vs LeT/JeM). (2) Under-represents rural Maoist and Northeast events before English-language reporting thickened. (3) Battle-death definition excludes many custodial and “encounter” deaths that HRW/Amnesty treat as one-sided. (4) Calendar-year threshold creates on/off years that do not match local memory of continuous conflict. (5) Coders’ survey work (Vesco et al., *Journal of Conflict Resolution*, 2026) finds UCDP tends to **under-count** fatalities relative to coder beliefs.
- **License / access.** Free download from [ucdp.uu.se/downloads](https://ucdp.uu.se/downloads/); cite the *JPR* annual article plus codebook. Creative Commons Attribution 4.0 for most products.

### 1.2 UCDP Georeferenced Event Dataset (GED)

- **What it codes.** An **event**: armed force by an organized actor against another organized actor or civilians, **≥1 direct death**, specific location and date (Sundberg & Melander 2013; GED codebook v.25.1/26.1). Events are linked to ACD, Non-State, or One-Sided instances. Years below the 25-death threshold are still included once a dyad has ever crossed it.
- **Coverage.** Global, **1989–present** (not 1947). Village-level coordinates with a precision code (point / near / ADM2 / ADM1 / country).
- **India use.** Best academic event layer for Kashmir, Maoists, Northeast, and some Hindu–Muslim non-state dyads after 1989. UCDP country page for India notes interstate, intrastate, non-state, and one-sided violence all present since 1989; 1990 is the post-1989 peak year in their series; CPI-Maoist was the most intense dyad in 2025 (UCDP country 750 narrative, 2026).
- **India biases.** No GED for 1947–88 (Hyderabad, 1962, Mizo bombing, Nellie, Blue Star). Precision often collapses to district in the Northeast and Bastar. “Kashmir insurgents” again aggregated. Fatality estimates are low/best/high; best is conservative.
- **License.** Same as ACD; HDX mirrors India extracts.

### 1.3 UCDP One-sided violence and Non-state conflict

- **One-sided.** Deliberate armed force by a state or formally organized group **against civilians**, ≥25 deaths in a year. Extrajudicial killings **in custody are excluded** (UCDP definitions). Government of India is coded as a one-sided actor from 1990, with three patterns UCDP itself names: crowd-control fire, revenge after comrades are lost, and hard counter-insurgency (UCDP actor page, Government of India – Civilians). Sikh insurgents and Kashmir insurgents also appear as one-sided actors in peak years.
- **Non-state.** Armed force between two organized groups, neither a state, ≥25 deaths/year. UCDP codes a long-running **Hindus (India)–Muslims (India)** non-state conflict with active years including 1989–90s, 2002, 2013 (Muzaffarnagar), 2020 (Delhi). Also codes tribal/ethnic dyads (Bodo–Santhal, Kuki–Meitei when organized, etc.) when the threshold is met.
- **India implication.** This is the only UCDP door through which Gujarat 2002 and Delhi 2020 enter as organized violence — and even then only if UCDP treats the attackers as sufficiently organized. Nellie and 1984 Delhi generally **do not** sit in ACD.

### 1.4 ACLED (Armed Conflict Location & Event Data)

- **What it codes.** Political violence and demonstration events: battles, explosions/remote violence, violence against civilians, riots (violent demonstration; mob violence), protests, strategic developments. No 25-death threshold. Fatalities are the **lowest reported** number (ACLED codebook). Actors include state forces, rebels, militias, identity groups, rioters, protesters.
- **Coverage for India.** Real-time from **January 2016** (ACLED country/time-period table; HDX India file 1 Jan 2016–present). South and Southeast Asia were added in version 8; Africa goes back to 1997. **Do not** splice ACLED 2016– with UCDP 1989– as if they were one series.
- **Geo.** Town/village; sometimes neighbourhood in large cities. Day-level, not time-of-day.
- **India use.** Excellent for Manipur 2023–, recent Maoist clashes, Kashmir encounters, cow-vigilante and riot events, and protest waves. ACLED’s India desk explicitly covers J&K, Pakistan relationship, Naxal-Maoist, Northeast separatists, and social unrest ([acleddata.com/country/india](https://acleddata.com/country/india)).
- **Biases.** (1) Fatalities systematically low. (2) “Rioters (India)” generic actor hides organizational sponsorship that commissions of inquiry later name. (3) Dense English and Hindi media produce more events in Delhi/UP than in hill districts unless local-language sources are back-coded. (4) Protest volume can drown armed-clash maps if event types are not filtered. (5) Living dataset: historical points get revised.
- **License.** Registration; attribution; restrictions on redistribution, competing products, and some AI-training uses. Check current terms before shipping a public viz that redistributes rows.

### 1.5 Global Terrorism Database (GTD / START)

- **What it codes.** Event-level “terrorist attacks,” 1970– (public file commonly through 2020; later years via commercial licence with CHC Global). Inclusion: intentional, violent, sub-national perpetrator, plus two of three criteria (political/social goal; intent to coerce a wider audience; violation of IHL exemption for legitimate warfare). **State terrorism is excluded** (GTD codebook / FAQs).
- **India use.** Dense on bombings, assassinations, and claimed attacks by LeT, JeM, ULFA, CPI-Maoist, Khalistani groups, IM, Indian Mujahideen, etc. Weak on state–insurgent battles and on riots.
- **Biases / breaks.** 1993 year is missing (lost PGIS tape). Collection phases (PGIS / CETIS / ISVG / START) are not fully comparable. “Terrorism” label is politically loaded in India; many GTD rows are the same incidents SATP calls “insurgency.” No custody deaths, no most AFSPA “encounters” unless reported as attacks.
- **License.** End-user licence; no redistribution of the raw file; commercial vs individual terms. Cite START, University of Maryland.

### 1.6 Correlates of War (COW)

- **What it codes.** Wars with **≥1,000 battle-related combatant deaths within twelve months**, organized armed forces, effective resistance. Inter-state, intra-state, extra-state, non-state typologies (Sarkees & Wayman; Inter-State Wars v4.0; Intra-State v5.1).
- **India inter-state list (post-1947).** First Kashmir War 1947–49 (COW #147); War in Assam / Sino-Indian 1962 (#160); Second Kashmir War 1965 (#166); War for Bangladesh 1971 (#178); Kargil 1999 (#223). Participant threshold: 1,000 troops or 100 battle deaths.
- **India intra-state.** High threshold means Hyderabad’s **combat** deaths may miss the cut even when civilian massacres do not; Punjab and Kashmir insurgencies are unevenly represented depending on year and coding of combatant vs civilian. Dataset effectively ends mid-2000s for new wars.
- **License.** Free for academic use from [correlatesofwar.org](https://correlatesofwar.org/data-sets/cow-war/).

### 1.7 South Asia Terrorism Portal (SATP) / Institute for Conflict Management

- **What it codes.** Open-source compilation (print/electronic media, official releases) of “terrorism, low-intensity warfare and ethnic/communal/sectarian strife” in South Asia. Daily incident notes; annual fatality tables split civilians / security forces / terrorists, by theater (J&K, Northeast, Left-Wing Extremism, Punjab, Islamist outside those, etc.). Launched 11 March 2000; ICM registered 1997 (SATP “About Us”). Fatalities for some theaters from 1994; most other series from ~2000.
- **India use.** The workhorse of Indian security journalism and of MHA comparisons. SATP cumulative theater table 2005–mid-2019: J&K 7,065; Northeast 6,520; LWE 8,222; Punjab 59; Islamist outside those 846; total ~22,861 (SATP, figures “compiled from news reports and are provisional”). J&K 1988–2012 news compilation ~43,000; MHA table republished by SATP for J&K 1990–2017: **44,567** total. Punjab backgrounder: **21,469** lives in “a little over a decade.” Maoist 2000–late 2022: SATP ~11,073 total fatalities, peak **1,180 in 2010**. Northeast peak **1,165 in 2003**, low **21 in 2022**, Manipur spike 2023.
- **Biases.** (1) Framed as a terrorism/internal-security database; the “terrorist” column is a political category. (2) No public event-level codebook comparable to GED. (3) Delhi-based; founder K.P.S. Gill was Punjab DGP — a primary actor in one theater. (4) Fatality totals usually **higher** than UCDP, closer to MHA. (5) Copyrighted; scraping for redistribution is legally grey. Academic event-extraction projects exist (e.g. Teitelbaum et al., GW SATP pipeline for Maoist incidents 2005–16).
- **Access.** [satp.org](https://www.satp.org). Cite Institute for Conflict Management / SATP, with access date; treat figures as provisional news compilations.

### 1.8 MAR, Ethnic Power Relations, ACD2EPR

- **Minorities at Risk (MAR).** University of Maryland; politically relevant minorities, discrimination, protest, rebellion scores. India groups include Kashmiri Muslims, Sikhs, Nagas, Mizos, Bodos, Scheduled Tribes, Muslims, etc. Aging (core series through mid-2000s); still used for historical group-level covariates.
- **Ethnic Power Relations (EPR) / GROW^up (ETH Zurich).** Politically relevant ethnic groups and access to central power, 1946–present. India coding is **explicitly flagged as inadequate**: caste, religion, and region cross-cut; “the current coding, reflecting only regional identities, does not reflect the ethnic make-up and power configuration correctly” (GROW^up India atlas PDF). Groups listed include Hindi (non-SC/ST OBCs), SCs, STs, Other Muslims, language regions, Kashmiri Muslims, Manipuri, Naga, Mizo, Indigenous Tripuri, Bodo. Kashmiri Muslims coded “discriminated” from 2020 in a later update.
- **ACD2EPR.** Links UCDP conflict actors to EPR groups via claim / recruitment / support (Wucherpfennig et al. 2012; Vogt et al. 2015; ACD2EPR 2021/2023). India rows include NLFT–Indigenous Tripuri, GNLA–Scheduled Tribes, NDFB-S–Bodo, UNLFW–Assamese/Bodo/Manipuri/Naga, CPI-ML factions with no ethnic claim, etc.
- **Implication for viz.** Do not plot “ethnicity of conflict” from EPR as if India had a single ethnic cleavage. Allow **overlapping** tribe / language / religion / caste / nationality.

### 1.9 Government of India / MHA annual reports

- **What they code.** Incidents, deaths of civilians and security forces, “extremists killed/arrested/surrendered,” district lists (LWE-affected, disturbed areas), AFSPA notifications, peace accords, surrenders. J&K figures also from MHA / J&K police; LWE from MHA Left-Wing Extremism division.
- **Use cautiously.** Official series are the only long, internally comparable administrative counts. They systematically:
  - under-count civilian deaths that are not registered as “terrorist violence” (riots often sit in state police crime tables, not MHA “extremism”);
  - classify many contested killings as “terrorists/extremists killed”;
  - change district lists and definitions (LWE “most affected districts” shrink for political as well as security reasons);
  - lag or omit one-sided violence by state forces.
- Staniland & Stommes (*India Review*, 2019) built alternative security-force fatality datasets from police “martyrs” rolls and found quality “varies wildly.”
- **Access.** mha.gov.in annual reports; PIB releases; parliamentary questions (often the cleanest numbered tables).

### 1.10 Human rights and local scholarship (not event datasets, but necessary correctives)

| Source | What it adds | Limits |
| --- | --- | --- |
| Human Rights Watch, Amnesty, IHRC | Encounter killings, torture, disappearances, AFSPA, 1984, Gujarat, Kashmir, Northeast | Advocacy documents; not a census |
| NHRC | Official inquiries, compensation, some encounter statistics | Weak enforcement; incomplete |
| PUCL, PUDR, Ensaaf, EEVFAM, CJP, Sabrang | Fact-finding on Punjab disappearances, Manipur encounters, Gujarat, 1984 | Uneven geography |
| Justice commissions (Srikrishna, Nanavati, Sunderlal, Tewary, Liberhan, etc.) | Named perpetrators, district maps, official-but-suppressed counts | Often unpublished for decades; non-binding |
| Sanjib Baruah | Northeast as “durable disorder”; citizenship, migration, federalism | Qualitative |
| Udayon Misra | Assam identity, ULFA, immigration | Qualitative |
| Bethany Lacina | Kashmir, Northeast, civilian targeting, riot coding problems | Quantitative-qualitative |
| Paul Staniland | Insurgent organization, Kashmir/Northeast/Punjab networks, wartime orders | Organizational, not fatality census |
| Šumit Ganguly | Kashmir, Indo-Pak, nuclearization | Strategic |
| Nandini Sundar, Alpa Shah | Bastar, Salwa Judum, Adivasi–Maoist–state triangle | Ethnographic |
| Ashutosh Varshney & Steven Wilkinson | Hindu–Muslim riot dataset ~1950–95 (*Times of India*); electoral incentives | English newspaper; Hindu–Muslim only |
| Paul Brass | “institutionalized riot systems” | Process, not counts |

Varshney–Wilkinson is the scholarly backbone for **communal riot** time-series before ACLED. Wilkinson (2004) recommends using it where ≥1 death occurs. Bhavnani & Lacina (2015) warn that “communal” vs caste vs economic motives blur, and that *TOI* coverage is not a probability sample of villages.

### 1.11 Comparison snapshot

| Dataset | Unit | India start | Death threshold | Riots? | State violence vs civilians? | Geo | License |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UCDP ACD | Conflict-year | 1946 | 25/year battle | Rarely | No (separate OSV) | No | CC-BY |
| UCDP GED | Event | 1989 | 1 death | If organized non-state | If linked to OSV actor | Village+ | CC-BY |
| UCDP OSV | Actor-year | 1989 | 25 civilians/year | No | Yes, not in custody | Via GED | CC-BY |
| ACLED | Event | 2016 | None (fatalities optional) | Yes | Yes | Town | Restricted |
| GTD | Event | 1970 (1993 gap) | None | No | **No** | City/district | EULA, no redistribute |
| COW | War | 1816–~2007 | 1,000/12 months | No | No (resistance rule) | No | Academic |
| SATP | Incident + annual tables | ~1994/2000 | None | Partial | As “terrorist violence” | State/theater | Copyright |
| MHA | Annual admin | Varies | None | Separate crime stats | Weak | State/district lists | Official |
| V–W riots | Riot-event | ~1950–95 | Often ≥1 | Hindu–Muslim | Police as context | City | Academic |

---

## 2. Conflict inventory, by theater

Scale labels follow the definition in §5: **small** / **medium** / **large**. They sit *beside* UCDP, not inside it. A “large” riot can be a UCDP non-event.

### 2.1 Interstate

#### First Kashmir War, 1947–49

- **Aliases.** First Indo-Pakistani War; COW “First Kashmir War of 1948–1949.”
- **Period.** Fighting from late October 1947; UN-brokered ceasefire **1 January 1949**. The territorial dispute is ongoing.
- **Locations.** Princely state of Jammu and Kashmir — Valley, Jammu, Poonch, Ladakh, Gilgit-Baltistan. India and Pakistan both claim the whole; each administers part. The 1949 Ceasefire Line became the Line of Control after 1972.
- **Actors.** Dominion of India (after Maharaja Hari Singh’s Instrument of Accession, 26–27 October 1947 — Pakistan disputes its validity); Pakistan (regulars increasingly overt); Pashtun tribal lashkars (Pakistan states volunteers; India states state-directed invasion).
- **Claims.** India: accession legal, tribal invasion. Pakistan: Muslim-majority state, accession under duress, unfinished partition.
- **Scale.** Large (interstate war). Military deaths: India commonly ~1,100–1,500; Pakistan/tribal figures more scattered (~6,000 appears in some secondary compilations and should be treated as uncertain). Civilian deaths in the theater are not cleanly separable from Partition massacres in Jammu (each side accuses the other of ethnic killing in 1947). COW includes it as an inter-state war.
- **Related.** All later Indo-Pak wars; Kashmir insurgency.

#### Sino-Indian War, 1962

- **Aliases.** COW “War in Assam of 1962”; China: “self-defensive counterattack.”
- **Period.** 20 October–21 November 1962 (preceded by 1959 clashes; forward-policy patrols 1961–62).
- **Locations.** Western sector: Aksai Chin (Xinjiang–Tibet road). Eastern sector: North-East Frontier Agency, now Arunachal Pradesh (China: “South Tibet”), Namka Chu, Tawang, Se La, Bomdila, Walong. China claims a large part of Arunachal; India claims Aksai Chin. This briefing records both claims.
- **Actors.** PLA vs Indian Army. No third-state combatants.
- **Casualties (do not collapse).** Indian Defence Ministry / parliamentary figures: **1,383 killed, 1,047 wounded, 1,696 missing, 3,968 captured**. Chinese official military history: **722 killed, 1,697 wounded**. Chinese sources give ~4,897 Indian killed or wounded plus 3,968 captured. COW: 1,353 Indian and 500 Chinese battle deaths (lower than official Indian killed+missing). Wortzel / Clodfelter discussed in secondary literature. Henderson Brooks–Bhagat report (1963) remains classified; Maxwell leaked part in 2014.
- **Scale.** Large. Outcome: PLA ceased fire and withdrew in the east to north of the McMahon Line while retaining Aksai Chin in the west. Border undemarcated; later clashes 1967 (Nathu La/Cho La), 1986–87 (Sumdorong Chu), 2017 (Doklam, on Bhutanese territory), 2020 (Galwan).

#### Indo-Pakistani War, 1965

- **Aliases.** Second Kashmir War; Operation Gibraltar (Pakistani infiltration); Operation Grand Slam; COW #166.
- **Period.** August–23 September 1965; Tashkent Declaration 10 January 1966.
- **Locations.** Kashmir plus Punjab/Rajasthan international border (Lahore, Khem Karan/Asal Uttar, Sialkot).
- **Casualties.** Indian official military deaths commonly ~3,000; Pakistani official in a similar band (~3,800 in some compilations). Civilian deaths along the border poorly enumerated (~1,000–3,000 in secondary ranges — uncertain). Tank battles among the largest since WWII.
- **Scale.** Large. Military result: stalemate; UN ceasefire; status quo in Kashmir.

#### Bangladesh war / Indo-Pakistani War, 1971

- **Aliases.** Third Indo-Pakistani War; COW “War for Bangladesh”; in Bangladesh, Liberation War.
- **Period.** Crisis from March 1971 (Operation Searchlight in East Pakistan); India states it entered after Pakistani air strikes **3 December**; instrument of surrender in Dhaka **16 December 1971**. Simla Agreement 2 July 1972.
- **Locations.** Eastern theater (East Pakistan / Bangladesh) and western front (Punjab, Rajasthan, Kashmir). ~10 million refugees into Indian states, especially West Bengal, Tripura, Meghalaya, Assam — a direct link to later Assam anti-foreigner politics.
- **Casualties — keep theaters distinct.** Indian military deaths often given as **~3,843**. Pakistani military deaths ~8,000–9,000 plus **~93,000 prisoners of war**. **Civilian deaths in East Pakistan** are a separate, fiercely disputed series: Bangladesh official **3 million**; independent scholarly range commonly **300,000–3,000,000** (Rummel, Bass, Bose, and others disagree). Those deaths occurred in East Pakistan, not in the Republic of India, but they are causally tied to Indian intervention and to Northeast demography.
- **Scale.** Large. Only Indo-Pak war that changed the map (creation of Bangladesh).

#### Kargil, 1999

- **Aliases.** Operation Vijay (Indian; also the 1961 Goa code name); Operation Safed Sagar (IAF); COW #223.
- **Period.** Intrusion detected May 1999; organized fighting ended ~26 July 1999 (Kargil Vijay Diwas).
- **Locations.** Kargil–Dras–Batalik–Mushkoh, Indian-administered Ladakh/J&K, on the Indian side of the LoC. Pakistan initially described fighters as militants; later evidence and admissions (including Nawaz Sharif interviews) describe Northern Light Infantry.
- **Casualties.** India: **527 killed**, 1,363 wounded (Ministry of Defence / Kargil Review Committee — named). Pakistan: official **357**; Sharif later said **over 4,000**; independent estimates often 400–4,000. Civilian deaths small (tens).
- **Scale.** Large by COW (crosses 1,000 combined combatant deaths in some counts; COW listed it). Politically: first conventional war after both states’ 1998 nuclear tests.

#### Siachen, 1984–present (low intensity)

- **Aliases.** Operation Meghdoot (India, 13 April 1984).
- **Locations.** Siachen Glacier / Saltoro Ridge, beyond map point NJ9842 where the 1949 CFL said “thence north to the glaciers.” Both states claim. India holds the ridge; Pakistan the lower approaches. China is adjacent via the 1963 Pakistan–China (Shaksgam) agreement, which India does not recognize.
- **Casualties.** Overwhelmingly environmental. Indian official weather-related deaths **>1,100** acknowledged by 2019; total Indian military deaths often cited ~800–1,100+. Combined deaths **~2,000+** in secondary sources; Pakistan’s 2012 Gayari avalanche killed **129 soldiers and 11 civilians**. Combat share often estimated <5%.
- **Scale.** Medium as a campaign of deaths; strategically large. Ceasefire 2003 reduced firing; deployment continues.

#### Other interstate / border campaigns (not full wars)

| Episode | When | Notes | Scale |
| --- | --- | --- | --- |
| Operation Vijay (Goa) | 17–19 Dec 1961 | India vs Portugal over Goa, Daman, Diu. India: liberation of colonial territory; Portugal (until 1974): aggression against national soil. **22 Indian and ~30 Portuguese killed**; 4,668 captured. | Small as fatalities; large as decolonization |
| Rann of Kutch | 1965 | Prelude to 1965 war | Small–medium |
| Nathu La / Cho La | 1967 | Sikkim–Tibet frontier clashes | Small–medium |
| Sumdorong Chu | 1986–87 | Arunachal standoff | Small (few deaths) |
| Operation Parakram | 2001–02 | Full mobilisation after Parliament attack; no full war | Medium (accidental/mine deaths, cost) |
| Balakot / post-Pulwama | Feb 2019 | After Pulwama (40 CRPF). India struck in Pakistan; aerial engagement; casualty claims incompatible | Small–medium |
| Galwan | 15 June 2020 | First lethal PLA–IA clash since 1975. India: **20 killed**. China: **4 killed** (PLA Daily 2021). Indian media claimed 25–40+ Chinese — unverified. | Small (event); part of large 2020– standoff |
| Pahalgam attack | 22 Apr 2025 | Gunmen killed **26** at Baisaran meadow (Indian Express, CNN, USCIRF: 25 Indians + 1 Nepali; mostly male Hindu tourists). TRF/LeT claim; India blames Pakistan-based groups (Pakistan denies). | Small (event) |
| Operation Sindoor | 7–10 May 2025 | Indian named operation after Pahalgam. PIB: nine sites targeted. Four-day India–Pakistan confrontation; BBC (Jul 2025) described “dozens” killed before a US-announced ceasefire. Fatality claims diverge. Not a COW war as of this briefing. | Uncertain; at least small–medium |

### 2.2 Integration of princely states / early republic

#### Junagadh, 1947–48

- Muslim Nawab acceded to Pakistan; Hindu-majority Kathiawar state. India imposed blockade; Nawab fled; plebiscite February 1948 reported ~99% for India. Limited organized combat relative to Hyderabad. Pakistani claim remains on paper. **Scale:** small.

#### Hyderabad / Operation Polo, September 1948, and aftermath

- **Claims.** Nizam sought independence (or, in some readings, alignment with Pakistan). India: standstill agreement violated; Razakar violence against Hindus; communist Telangana uprising. Operation Polo (“police action”) **13–17 September 1948**.
- **Combat deaths.** Indian Army losses low (often <50). Hyderabad State Forces **807 killed** and Razakars **1,373 killed** in figures usually quoted from Indian military accounts; V.P. Menon: “a little over 800” on the Hyderabad side.
- **Civilian massacre (the large number).** The **Sunderlal Committee** (Pandit Sunderlal, Qazi Abdul Ghaffar, Maulana Abdulla Misri), appointed by Nehru, estimated **at least 27,000–40,000** killed “during and after the police action,” “killed in cold blood,” worst in Osmanabad, Gulbarga, Bidar, Nanded. Report suppressed until accessed c. 2013 (BBC, Purushotham). Wilfred Cantwell Smith (1950), citing leaked knowledge of the report, wrote of **50,000–200,000**. Military governor J.N. Chaudhuri privately mentioned ~2,000. Patel rejected the Sunderlal framing as ignoring Razakar crimes.
- **Direction of violence.** Sunderlal: Muslim villagers often disarmed while Hindus kept weapons; Indian Army and local police “took part in looting and even other crimes” in some places; also documented Razakar atrocities in confidential notes. This is **one-sided mass killing layered on a short war**, not a symmetric battle.
- **Related.** Telangana peasant armed struggle (CPI) 1946–51, against Nizam then against the Indian Union.
- **Scale.** Large (civilian). Combat phase small–medium.

#### Telangana armed struggle, 1946–51

- CPI-led peasant war in Telangana districts of Hyderabad State; land, vetti (forced labour), jagirdari. Continued after Polo against Indian Army. Ended 1951 on CPI call. Death and displacement poorly censused; often treated as medium–large rural insurgency. Related to later Naxalite lineage only ideologically, not organizationally continuous.

### 2.3 Jammu & Kashmir

Multiple nested layers: 1947 war; 1965; 1999; Siachen; post-1988 insurgency; one-sided violence by militants and by state forces; 2008/2010/2016 protest–crackdown cycles; Article 370 revocation (5 August 2019); 2020s targeted killings; Pahalgam 2025.

#### Kashmir insurgency, c. 1988–present

- **Onset (contested).** UCDP: violent attacks from July 1988, first conflict-year 1989. Local narratives: 1987 Assembly election (widely described as rigged), JKLF jail-to-gun pipeline, Afghan-war weapons, Pakistani sanctuary (Pakistan: moral/diplomatic support; India: ISI-run proxy war; Pakistan: indigenous uprising).
- **Actors (not one actor).** JKLF (independence); Hizbul Mujahideen (pro-Pakistan, indigenous); later Lashkar-e-Taiba, Jaish-e-Mohammed, HM, smaller groups. UCDP umbrella: “Kashmir insurgents.” State: Indian Army, BSF, CRPF, J&K Police, Ikhwan (pro-government militants). AFSPA extended to J&K **1990**; Disturbed Areas notifications.
- **Peoples.** Kashmiri Muslims (Valley); Kashmiri Pandits; Jammu Hindus/Dogras; Gujjars/Bakarwals; Ladakhi Buddhists and Shias — different relationships to the insurgency. Do not map “Kashmir” as a single people.
- **Pandit exodus, 1989–90.** Targeted killings of Pandits (government lists often **~219–399** killed in the early years; Pandit organizations cite higher). Displacement: commonly **100,000–140,000** from the Valley (some claims to 300,000). Militants and some Valley political actors: “migration” amid general chaos; Pandit groups and much Indian official memory: “ethnic cleansing.” Record both.
- **Fatality ranges (insurgency, not 1947 war).**

  | Source | Coverage | Total (approx.) |
  | --- | --- | --- |
  | SATP news compilation | 1988–2012 | ~43,300 |
  | MHA table via SATP | 1990–2017 | **44,567** (13,979 civilians; 5,131 SF; 25,457 “terrorists”) |
  | SATP 1988–2000 sheet | 1988–2000 | ~25,900–26,200 |
  | UCDP GED/ACD | 1989– | Lower than SATP; war-intensity years around 2000–2002 in UCDP narrative |

  Peak years in SATP/MHA: early–mid 1990s and 2000–01 (MHA 2001: 4,177). Decline after 2002–07; partial uptick 2016–18; UCDP says 2024 among the lowest since 1989, with a 2025 dip continuing. **Uncertainty:** “terrorist” vs civilian vs combatant; unidentified bodies; disappearances (Association of Parents of Disappeared Persons claims thousands; official figures much lower).
- **One-sided violence.** UCDP: Kashmir insurgent OSV peaked around 2000. State OSV: Gawkadal (1990), Bijbehara (1993), Pathribal, Machil (later convictions), pellet-gun blinding in 2016 — HRW/Amnesty series. Not all enter UCDP because of custody exclusion and organization rules.
- **Legal / political.** Article 370/35A revoked August 2019; state bifurcated into UTs. Communications blackout. India: full constitutional integration, decline in stone-pelting and infiltration. Critics: demographic engineering, detention of politicians, shrinkage of autonomy. Pakistan and much of the Valley political class: unilateral, illegal.
- **External support.** India’s claim of Pakistani state support is the core official narrative and is accepted by many Western governments for LeT/JeM. Pakistan denies official direction. US designation of LeT/JeM as terrorist organizations is a third-party fact.
- **Scale.** Large, ongoing (low–medium intensity in 2020s). Related: all Indo-Pak wars; 2001 Parliament attack; 2008 Mumbai (LeT, 166 dead — outside the Valley but part of the same militant field).

### 2.4 Punjab / Khalistan

- **Period.** Political agitation late 1970s–early 1980s; UCDP armed conflict from **1983**; military peak 1984–1992/93; residual diaspora plots continue.
- **Actors.** Dharam Yudh Morcha / Akali Dal (political); Jarnail Singh Bhindranwale / Damdami Taksal; AISSF; later KCF, Babbar Khalsa, KLF, BTFK, etc. State: Punjab Police (K.P.S. Gill period), CRPF, Army (Blue Star, Woodrose). Pakistan accused of sanctuary in the later phase.
- **Grievances / claims.** Anandpur Sahib Resolution (autonomy, river waters, Chandigarh); Sikh religious authority; counter-claim of Congress cultivation of Bhindranwale; demand for Khalistan (a separate Sikh state) by militants — not by all Akali factions.
- **Operation Blue Star, 3–8 June 1984.** Army assault on Harmandir Sahib / Akal Takht. Government White Paper: **493** civilians/militants killed, **83** soldiers. Independent and Sikh organizations: **3,000–8,000**, including pilgrims (Ensaaf and others; unverifiable — no independent body count). Timing coincided with a major religious commemoration. Mutinies among some Sikh troops reported.
- **31 Oct–early Nov 1984 anti-Sikh violence.** After Indira Gandhi’s assassination by Sikh bodyguards. **Nanavati Commission / official Delhi: 2,733 killed in Delhi**; national estimates often **~3,000–4,000**. HRW and citizen inquiries document Congress local organizers, voter lists, kerosene, police inaction. Convictions few. This is a **pogrom**, not a battle — UCDP ACD does not treat it as the Punjab war.
- **Insurgency fatalities.** SATP/Gill: **21,469** in a little over a decade. SATP: 11,694 civilians killed by Sikh militant groups, of whom 7,139 were Sikhs (i.e. a majority of civilian victims were Sikh). Ensaaf/HRW: large numbers of disappearances and cremations in police counter-insurgency not in SATP “terrorist” tables. Air India Flight 182 (23 June 1985): **329** killed, Babbar Khalsa conspiracy — often coded separately as terrorism (GTD).
- **Accord.** Rajiv–Longowal Accord 1985; Longowal assassinated. Militancy suppressed by ~1993. Diaspora referendum campaigns and isolated killings continue; not a return to 1980s intensity.
- **Scale.** Large.

### 2.5 Naxal / Maoist belt

- **Lineage.** Naxalbari (West Bengal) 1967; Charu Mazumdar CPI(ML); crushed early 1970s (Operation Steeplechase 1971). Reconstituted as People’s War Group (Andhra/Dandakaranya) and Maoist Communist Centre (Bihar/Jharkhand). **CPI (Maoist) merger, 21 September 2004.** Aim: New Democratic Revolution, control of a compact revolutionary zone.
- **Geography (“Red Corridor”).** Peak: ~150–180 districts claimed affected in late 2000s (MHA lists vary). Core: Bastar division (Chhattisgarh), Jharkhand, Odisha, Bihar, Andhra/Telangana, Gadchiroli (Maharashtra), parts of WB, MP, UP. Not a single front.
- **Peoples.** Gonds, Koyas, other Adivasis; landless; also caste militias (Ranvir Sena in Bihar — anti-Maoist landlord army, itself a one-sided killer). Overlapping identities: tribe, caste, class. Resources: **land, forest rights, mining (iron, bauxite, coal), tendu, road-building**. Salwa Judum (2005–11) as state-backed (and later Supreme Court-invalidated) civilian militia in Dantewada/Bijapur — displacement of hundreds of villages (Sundar; SC 2011).
- **Fatalities.**

  | Source | Span | Figure |
  | --- | --- | --- |
  | MHA RTI (PTI 2014) | ~1993–2013, 9 states | **12,183** civilians+SF killed *by Naxals* (does not include Maoists killed) |
  | SATP | 2000–Nov 2022 | **~11,073** total (civilians 3,939; SF 2,636; Maoists 4,246; NS 252) |
  | SATP peak year | 2010 | **1,180** (MHA: **1,005**) |
  | SATP / wiki compilation | 2000–2025 | civilians ~4,134; SF ~2,722; Maoists ~5,000 |
  | BBC | 1990–2010 | >6,000 |
  | Al Jazeera | 1980–2011 | ~10,000 |
  | MHA 2024 vs 2010 | incidents 1,936 → 374; deaths (civ+SF) 1,005 → 150 | 81% / 85% decline (official claim) |

  Pre-2000 deaths (1967–90s Andhra/Bihar) are **not** in SATP’s 2000– series; any “1967–present total” of 12–15,000+ is a compilation, not a census.
- **Notable events.** Dantewada CRPF ambush 6 April 2010 (**76** SF); Jhiram Ghati / Darbha 25 May 2013 (Congress leaders); numerous IED campaigns; security operations (Green Hunt — name used in media, not always an official single op).
- **Status as of 2026.** MHA and Home Minister have claimed the insurgency is near an end / “Naxal-free” except residual commanders (March 2026 parliamentary claim). UCDP 2025 narrative still lists CPI-Maoist as India’s most intense state-based dyad that year, with a notable escalation versus the early 2020s. **Treat “end” as a government claim**; residual capability is an empirical question for the viz, not a premise.
- **Scale.** Large, ongoing at reduced geographic spread.

### 2.6 Northeast — state by state (inventory; analysis in §3)

Northeast India here: Arunachal Pradesh, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Tripura; Sikkim included only where relevant (1975 merger was political, not a peer of Naga/Mizo wars). “Seven Sisters” plus Sikkim. SATP regional peak **1,165 fatalities in 2003**; **21 in 2022**; 2023 spike almost entirely Manipur.

#### Nagaland / Naga Hills

- **Roots.** Naga Hills as excluded/partially excluded area; Inner Line (Bengal Eastern Frontier Regulation **1873**). Naga National Council; **14 August 1947** independence declaration (NNC/Phizo — a claim India never accepted). 1951 NNC plebiscite (boycotted/unrecognized by India). NFG/NFA 1952. Army in; **AFSPA 1958** (first designed for this theater).
- **Statehood.** 16-point agreement 1960; Nagaland state **1963**. Did not end the armed movement.
- **Groups.** NNC → Shillong Accord **11 Nov 1975** (accept Constitution, deposit arms) → rejected by Muivah, Isak, Khaplang → **NSCN 1980** → split **1988** NSCN-IM (Isak–Muivah, Tangkhul/Sema heavy) and NSCN-K (Khaplang, with Myanmar base). Further splits (Khole-Kitovi, Reformation, U, etc.). Ceasefire with IM **1 Aug 1997**; with K 2001 (broken 2015 after the Manipur convoy ambush, 18 Indian soldiers). **Framework Agreement 3 Aug 2015** (text not public); IM still claims flag, constitution, “shared sovereignty,” integration of “Nagalim” (~120,000 km² vs Nagaland’s 16,527). Neighbouring states reject territorial change. NNPGs “Agreed Position” 2017 — parallel track.
- **Casualties.** UCDP narrative: **~20,000** over four decades (includes factional and civilian targeting, not only battle deaths). SATP from 2000: **830** in Nagaland state (191 civilians, 22 SF, 603 militants) through ~2023 — a **state** slice, not the whole Naga theater (much fighting was in Manipur/Assam/Arunachal/Myanmar). Inter-factional killing often exceeded army–NSCN killing after the 1997 ceasefire.
- **Oting, 4–5 Dec 2021.** 21 Para SF killed coal miners in a “mistaken identity” ambush; 13–14 civilians and 1 soldier dead in the episode. Centre denied AFSPA prosecution sanction (2023); Supreme Court quashed proceedings (2024) for want of Section 6 sanction.
- **Scale.** Large historically; small in the 2020s inside Nagaland state. **Ongoing** politically (no final accord).

#### Mizoram / Mizo Hills

- **Roots.** Mautam bamboo famine 1959; Mizo National Famine Front → MNF (Laldenga). Perceived Assam/Delhi neglect; Christian Mizo identity; Inner Line.
- **Uprising.** Operation Jericho **28 Feb–March 1966**; MNF seized Aizawl treasury and besieged Assam Rifles. **IAF strafing/bombing of Aizawl 4–5 March 1966** (Toofani/Hunter) — only use of the air force on a population inside the Republic. Direct bombing deaths often given as **~13** (J.V. Hluna); sociological effect far larger. Village **grouping**: inhabited villages 730 → 229 (1961–71) then back to 721 by 1981 (Hazarika; Frontline 2026). 516 of 764 villages regrouped in some counts.
- **Accord.** **Mizoram Peace Accord 30 June 1986** (Laldenga, R.D. Pradhan, Lalkhama). Statehood **20 Feb 1987**. MNF became a ruling party. SATP: ~350 civilians killed by MNF in cited phases; 59 SF in the 1966 recapture. Often described as India’s most successful insurgency settlement.
- **Scale.** Medium–large (displacement and duration); fatalities lower than Naga/Kashmir. **Ended** as armed conflict.

#### Assam

Several overlapping conflicts; do not draw as one blob.

1. **Assam Movement / anti-foreigner agitation, 1979–85.** AASU / AAGSP vs Delhi and vs suspected Bangladeshi migrants (Bengali-speaking Muslims and also Hindus). Official agitation deaths often **~855–860**. Culminated in **Assam Accord 15 Aug 1985**: 1 Jan 1966 and 24 March 1971 cut-offs; later NRC (2019: **1.9 million** excluded — a civil status event, not a battle).
2. **Nellie massacre, 18 Feb 1983.** ~6 hours, 14 villages, then Nagaon (now Morigaon). Official ~**1,800**; commonly **2,000–3,000** Bengali-origin Muslims, mostly women and children. Tewary Commission (tabled 2025 after 42 years): **3,023** killed in 11 districts Jan–Apr 1983, **1,811 in Nagaon**. Local memory sometimes 10,000 — unverified. Tiwa (Lalung) and other locals as attackers; unfolding during a boycotted election. **688 FIRs; cases dropped after Assam Accord.** Scale: **large** riot/pogrom. UCDP ACD: generally not an armed conflict.
3. **ULFA (United Liberation Front of Asom), 1979–.** Sovereignty of Assam; anti-migrant and anti-Delhi. Operations Bajrang (1990), Rhino (1991); Bhutan “All Clear” 2003 against camps; Bangladesh crackdown late 2000s. Split: pro-talks (Rajkhowa) vs **ULFA-Independent** (Paresh Baruah, China/Myanmar reported sanctuary — Baruah’s location is a claim). **MoS 29 Dec 2023** with ULFA pro-talks; ULFA-I not party. Fatalities: thousands over four decades (SATP Assam tables); treat as medium–large.
4. **Bodo movements.** ABSU statehood demand 1987–; BLT; 1993 BAC; **BTC accord 2003**; NDFB factions (including anti-talks Songbijit, responsible for 2014 Adivasi massacres). **Bodo Peace Accord 27 Jan 2020**; 1,615 cadres surrendered. Interleaved **Bodo–Muslim and Bodo–Adivasi** non-state massacres (1993, 1994, 2008, 2012, 2014) with death tolls in the tens to hundreds per episode. Resource: land in the northern Brahmaputra bank; “indigenous” vs settler claims.
5. **Karbi, Dimasa, Adivasi** accords 2021–22 (MHA list). Smaller, medium/small.

#### Manipur

- **Long insurgency.** UNLF (1964), PLA/RPF (1978), PREPAK, KYKL, KCP — Valley-based Meitei groups, many left-nationalist, some secessionist, historically China/Myanmar-trained. Naga groups (NSCN-IM) in the hills. Kuki groups under **SoO 2008** (KNO, UPF — 23 outfits in MHA accounting). Irom Sharmila’s 16-year fast against AFSPA. EEVFAM petition: **1,528 alleged extra-judicial killings**; SC 2016 held no war-like immunity, ordered inquiry (EEVFAM v. Union of India).
- **Ethnic geography.** Meitei ~53–60% in Imphal Valley (~10% of land); Naga and Kuki-Zo tribes in the hills (~90% of land) with ST status, land protections. Valley vs hill is the map that matters.
- **Kuki–Meitei conflict, 3 May 2023–.** Trigger: High Court recommendation on Meitei ST status; tribal solidarity march. Deeper: hill forest/poppy, refugee inflow from Myanmar (post-2021 coup) which Meitei political actors call illegal Kuki-Chin migration, Kuki claims of majoritarian targeting by the Biren Singh government. SATP 2023: **163** insurgency-linked fatalities in Manipur vs 7 in 2022. Governor (Feb 2024): **219** killed in ethnic violence since May 2023. Later official (Sep 2026, Wikipedia compilation of govt figures): **306** dead, **60,000+** displaced, thousands of houses/churches/temples damaged. Population already sorted into ethnically homogenous zones. UNLF signed a peace agreement **29 Nov 2023** even as street war continued — illustrating nested peace/war. President’s Rule 2025; new state government 2026; ACLED in 2026 also records **Kuki–Naga** hill violence spreading.
- **Scale.** Historical insurgency: medium–large. 2023– ethnic war: **large** (deaths plus displacement). Ongoing.

#### Tripura

- Indigenous Tripuri (Borok) vs Bengali settler majority (Partition, 1971 refugees). TNV accord **1988**; NLFT; ATTF. Peak SATP-era year **2000: 514 fatalities** (453 civilians). NLFT-associated SATP total ~785; ATTF ~314 (overlapping, not additive). Camps in Bangladesh until Sheikh Hasina-era crackdowns. AFSPA withdrawn **2015**. Accords: NLFT-SD 2019; NLFT+ATTF **4 Sep 2024** (328+ cadres). **Scale:** large at 1990s–2004 peak; now small/ended as insurgency.

#### Meghalaya

- HNLC (Khasi); ANVC (Garo, accord 2014, 751 surrendered); GNLA (Garo, crushed ~2018). Fatalities in the low hundreds over the 2000s, then near zero. AFSPA withdrawn **2018**. **Scale:** small–medium historically; now residual.

#### Arunachal Pradesh

- Not a statewide insurgency. NSCN activity in Tirap, Changlang, Longding (the “disturbed” belt under AFSPA). China boundary claim overlays Indian counter-insurgency maps — two disputes, one landscape. **Scale:** small.

#### Sikkim

- 1975 merger/referendum after Indian military presence; not coded as a UCDP war. 1967 Nathu La clash is interstate with China, not an internal Sikkimese insurgency.

### 2.7 Communal / riot sequences (selected; not exhaustive)

India’s riot history is long; Varshney–Wilkinson log hundreds of Hindu–Muslim events 1950–95. Below are infographic-scale episodes. Most are **one-sided or two-sided civilian mob violence**, sometimes with police participation or abstention — not “armed conflict” in UCDP ACD.

| Episode | Date | Primary location | Deaths (range, sourced) | Notes |
| --- | --- | --- | --- | --- |
| Partition violence | 1947–48 | Punjab, Bengal, Sindh, Delhi, etc. | **200,000–2,000,000**; ~14 million displaced (Talbot, Butalia, Khan, and others) | Began before 15 Aug; continued after. Not a state–state war. |
| Hyderabad aftermath | Sep–Oct 1948 | Osmanabad, Nanded, Gulbarga, Bidar | **27,000–40,000** (Sunderlal); 50–200k (Smith) | See §2.2 |
| Ahmedabad | 1969 | Gujarat | ~500+ | Major post-1965 riot |
| Moradabad | 1980 | UP | Official ~400; higher unofficial | |
| Nellie | 18 Feb 1983 | Assam | **1,800–3,000** (official/Tewary) | See §2.6 |
| Nellie-year statewide | Jan–Apr 1983 | 11 Assam districts | **3,023** (Tewary) | Not only Nellie |
| Anti-Sikh | 31 Oct–Nov 1984 | Delhi + Kanpur, Bokaro, etc. | **2,733 Delhi official**; ~3–4k national | See §2.4 |
| Hashimpura | 22 May 1987 | Meerut, UP | **42** Muslims by PAC | One-sided; convictions decades later |
| Bhagalpur | 1989 | Bihar | ~1,000 | Ramjanmabhoomi wave |
| Babri demolition riots | Dec 1992–Jan 1993 | Nationwide; Bombay worst | Bombay **~900** (Srikrishna: 575 Muslim, 275 Hindu, 50 other — commonly cited split); national thousands | Srikrishna: Dec phase as Muslim reaction; Jan as organized Shiv Sena-led attacks |
| Gujarat | Feb–Mar 2002 | Ahmedabad, Panchmahals, Vadodara, etc. | Official **1,044** (790 Muslim, 254 Hindu) + 223 missing; CCT **1,926**; others **2,000+** | Godhra train: 59 karsevaks burned — accident vs attack still disputed. Concerned Citizens Tribunal (Justice Krishna Iyer et al.): organized pogrom, state complicity (contested by the then state government and later courts in some cases). |
| Kandhamal | 2008 | Odisha | Official ~38–40; Christian groups 100+ | Anti-Christian after Swami Laxmanananda killing |
| Muzaffarnagar | Aug–Sep 2013 | UP | Official **62**; other estimates ~100; ~50,000 displaced | Jat–Muslim; UCDP non-state active year |
| Delhi | Feb 2020 | North-east Delhi | **53** (police); majority Muslim among dead | During CAA/NRC protests; UCDP non-state active year |
| Manipur ethnic | 2023– | Manipur | **219–306**; 60k+ displaced | See §2.6; ethnic more than Hindu–Muslim |

**Bombay 12 March 1993 blasts** (257 dead) were a sequel to the riots, attributed to Dawood Ibrahim / Memon network; GTD terrorism, not a riot.

### 2.8 Other campaigns worth a node on a map

- **Naxalbari 1967** (spark, small in deaths, large in lineage).
- **Operation Steeplechase 1971** (Army–paramilitary against CPI(ML) in WB/Bihar/Odisha).
- **Sikh diaspora plots** post-1993 (Air India already noted; later isolated killings in UK/Canada — outside India but part of the Khalistan network graph).
- **Indian Mujahideen / SIMI / IM bombings** 2000s (serial urban bombs: Jaipur, Ahmedabad, Delhi, etc.).
- **26/11 Mumbai 2008** — 166 dead; LeT; Pakistan-based controllers (David Headley / judicial record in US and India).
- **Cow-vigilante and lynchings** 2015– (small per event, patterned; ACLED/GTD/HRW). Not a single campaign; a type.
- **Pathalgadi / some Adivasi autonomy protests** — mostly non-lethal; include only if they crossed into lethal clashes.

---

## 3. Northeast deep dive

The Northeast is not a single insurgency. It is a **stack**: colonial spatial law, overlapping nationality claims, inter-tribal competition, migration/citizenship, resource extraction, and a legal exceptionalism (AFSPA) that the rest of India only sometimes shares (Punjab 1983–; J&K 1990–). Maps that colour “the Northeast” as one conflict are wrong.

### 3.1 Historical roots

- **Inner Line (1873).** The Bengal Eastern Frontier Regulation created a permit line between the Brahmaputra valley and the hills. It was a colonial technology to keep hill societies out of the plantation/settler economy — and to keep settlers out of the hills. Independent India **kept** the Inner Line (extended to Manipur in 2019). Any viz of “who may live where” in the hills should show ILP / Sixth Schedule / Article 371A (Nagaland), 371G (Mizoram), 371C (Manipur hill areas) as **legal layers**, not folklore.
- **Excluded / partially excluded areas.** Naga Hills, Lushai (Mizo) Hills, and others were not under the same provincial franchise as Assam’s valleys. 1947 therefore did not feel like “independence” in the same way in Kohima as in Lucknow. NNC’s 14 August 1947 declaration, whether or not one accepts its legal force, is the **start date Naga nationalists use**; India’s start date is accession/statehood. Code **both** as contested `start`.
- **World War II and the Japanese invasion** of Manipur/Nagaland (1944) militarized the hills and created veterans and weapons memories that 1950s organizers inherited.
- **1958 AFSPA.** Written for the Naga Hills as a temporary emergency statute; still the skeleton of counter-insurgency law in remaining “disturbed areas” of Assam, Nagaland, Manipur, and parts of Arunachal. Punjab and J&K later received sister statutes.

### 3.2 Overlapping insurgencies, ceasefires, splinters

A group-level timeline is more honest than a state-level one:

- One “Naga conflict” contains NNC, NSCN, IM, K, KK, R, U, NNPGs, and valley vs eastern Naga (ENPO) political divergence.
- Manipur contains **three armed fields** (Meitei valley groups; Naga; Kuki-Zo) that can be in ceasefire with Delhi and at war with each other.
- ULFA, NDFB, KLO, and others shared **camps in Bhutan, Bangladesh, Myanmar** (and, in Indian and some Western accounts, links to China for selected groups — always a claim, sometimes with seized-document support).
- Ceasefires **without settlements** produce “ceasefire groups” that tax highways, run parallel civil administrations, and fight rivals. Post-1997 Nagaland violence was often IM vs K, not IM vs Army. A viz that only draws state vs rebel arrows will miss the majority of 2000s Naga deaths.

**Peace accords as data objects, not endings.**

| Accord | Year | Parties | Result |
| --- | --- | --- | --- |
| 16-point | 1960 | NPC–GoI | Nagaland state 1963; war continued |
| Shillong | 1975 | NNC section–GoI | Split; NSCN born |
| Mizo | 1986 | MNF–GoI | Durable peace; statehood 1987 |
| TNV | 1988 | Tripura | Partial |
| Bodo BAC | 1993 | | Collapsed into more war |
| Bodo BTC | 2003 | BLT–GoI–Assam | Territorial council; NDFB continued |
| ANVC | 2014 | Meghalaya | Held |
| Naga Framework | 2015 | NSCN-IM–GoI | No final text; stalled on flag/constitution/Nagalim |
| NLFT-SD | 2019 | Tripura | Partial |
| Bodo | 2020 | NDFB factions–GoI–Assam | Major demobilization |
| Bru/Reang resettlement | 2020 | Mizoram–Tripura–GoI | Displacement settlement |
| Karbi / Dimasa / Adivasi | 2021–22 | Assam | |
| UNLF | 2023 | Manipur–GoI | During ethnic war |
| ULFA (pro-talks) | 2023 | Assam–GoI | ULFA-I excluded |
| NLFT–ATTF | 2024 | Tripura | Claimed end of Tripura insurgency |

Splinter after accord is the **modal** Naga/Assam outcome; Mizo is the exception. Schema must allow `accord_id` without forcing `conflict.end`.

### 3.3 Cross-border sanctuaries

- **Myanmar:** NSCN-K (Khaplang was a Hemi Naga from Myanmar), PLA, UNLF, ULFA-I, and Kuki-Chin groups. Sagaing and Chin states. 2021 Myanmar coup increased refugee and weapons flows into Mizoram and Manipur — a direct input into 2023 Kuki–Meitei framing.
- **Bangladesh:** historic ULFA, NLFT, ATTF, NDFB camps (especially pre-2009). Hasina-era cooperation reduced them; political change in Dhaka is a conflict variable.
- **Bhutan:** Operation All Clear / Flush Out, December 2003 — Royal Bhutan Army against ULFA, NDFB, KLO. Rare third-country campaign against Indian insurgents.
- **China:** 1960s–70s training of Naga and Mizo groups is well documented in memoirs; later PLA/UNLF links are cited by Indian security sources. China’s **territorial claim** on Arunachal is a separate interstate layer that shares roads, airfields, and tribal populations (Monpa, Mishmi, etc.) with the insurgency map.

Sanctuary means events **geocoded in India** undercount the system. A serious viz needs a “camps and corridors” overlay, even if approximate.

### 3.4 Migration, citizenship, Nellie, NRC

Assam is the clearest case that **demographic conflict** can produce death counts that dwarf the local insurgency.

- Colonial tea-garden and peasant immigration (Bengali Muslim cultivators on char islands; tea tribes from central India).
- 1947 Partition and 1950s–60s continued movement across a porous riverine border.
- 1971: millions of refugees; many returned, some stayed — the empirical mix is exactly what the Assam Movement claimed was unknowable without a register.
- 1979–85 movement: foreigners, language (Assamese vs Bengali), and oil/tea as “Assam’s resources.”
- 1983 election held against a boycott: the proximate setting of Nellie. Tewary (2025 public): not a single-conspiracy communal riot in the Gujarat-2002 sense; a longer foreigners/language agitation exploding in many directions (Assamese vs Bengali Hindu, vs Bengali Muslim, etc.). Nellie itself was still a **one-sided massacre of Bengali-origin Muslims**.
- 1985 Accord: legal cut-offs, not a body count. IMDT Act 1983 (struck down 2005) made detection harder — a legal regime field.
- NRC 2019: 1.9 million excluded, across religions; implementation of detention/deportation remains politically blocked. **NRC is not an armed conflict**; it is a mass legal event that re-opens 1983 memory and should be a **layer**, not a war node.

Baruah’s argument (Durable Disorder; In the Name of the Nation): Delhi treats the Northeast as a security perimeter; local politics treats **who counts as indigenous** as the highest-stakes question. Violence follows the citizenship line more than the Maoist line.

### 3.5 Resource and identity dimensions

| Factor | Where it bites |
| --- | --- |
| Land / forest / ST land law | Manipur hills, Tripura, Bodo areas, Meghalaya |
| Oil (Upper Assam) | ULFA origin myth; pipeline bombings |
| Tea | Labour ethnicity (Adivasi) vs Assamese vs management |
| Coal / rat-hole mining | Nagaland–Assam border (Oting miners); Meghalaya |
| Poppy / drugs | Manipur hills — Meitei discourse on “poppy villages”; also a real cash crop after Myanmar disruption |
| Hydropower | Arunachal, Manipur (Tipaimukh debates), Assam downstream |
| Highways / taxation | NSCN “national workers,” ULFA, valley groups — ceasefire economies |
| Language | Assamese official language movements (1960, 1972) produced their own riots |
| Religion | Mizo and Naga Christianity vs Indian Hindu-majority state is background, not always the cleavage; Manipur 2023 mixed ethnicity with Hindu Meitei / Christian Kuki framing |
| Clan/tribe | Tangkhul vs other Nagas; Kuki vs Naga (1992–93 war in Manipur — hundreds dead, villages emptied); Bodo vs Santhal |

**1992–93 Kuki–Naga war** in Manipur is under-imported into national datasets and should have its own campaign node (medium–large; SATP and local counts in the hundreds to ~1,000; 100,000+ displaced in some contemporary reports — flag uncertainty).

### 3.6 Why district/village precision matters

- Valley/hill in Manipur is a **10 km** problem: Imphal and Churachandpur are different countries for the purpose of return of IDPs.
- Nellie was 14 villages, not “Assam.”
- Oting is a village in Mon, not “Nagaland violence.”
- Bastar Maoist war is block-level (Sukma, Bijapur, Dantewada), not “Chhattisgarh.”
- Naga “ceasefire bounds” were a literal cartographic fight (2001 extension to Manipur produced the 18 June 2001 Imphal uprising and the burning of the Assembly — 13 dead). The map **is** the politics.

GED precision codes, ACLED admin1 vs village, and Indian Census village codes (2011 SHRUG) should be first-class. State choropleths will lie.

### 3.7 AFSPA as a legal geography

AFSPA (1958) and the Disturbed Areas Act let the Centre notify an area; armed forces may fire to kill, arrest without warrant, and enjoy **Section 6** prior-sanction immunity. J&K had a parallel AFSPA 1990. Punjab had one 1983–.

**EEVFAM (2016):** SC held Manipur was not at “war”; fake encounters can be prosecuted; AFSPA is not a blanket. Practice: prosecution sanction is rarely granted (Oting). Irom Sharmila’s fast (2000–2016) is the civil symbol; the **map of notifications** is the data. MHA has shrunk “disturbed” polygons in Assam, Nagaland, Arunachal, and Manipur valley police-station by police-station since ~2015 — a time-varying polygon layer the viz should animate. Tripura 2015 and Meghalaya 2018 withdrawals are rare full exits.

---

## 4. Data-model implications

Scholars do not code “a conflict in India.” They code **events** that roll up to **dyads** that sit in **incompatibilities** that are fought in **places** under **legal regimes** by **organizations** that **split**, while **newspapers disagree**.

### 4.1 Nested objects the schema must have

```
Theater          e.g. Northeast, Kashmir, Maoist belt, Interstate-Pak, Communal
  Campaign       e.g. Naga insurgency, Kuki–Meitei 2023, Gujarat 2002
    Phase        e.g. NNC 1956–75; NSCN 1980–88; IM ceasefire 1997–
    Event        e.g. Oting 2021-12-04; Godhra 2002-02-27
```

A Manipur death in 2023 may belong simultaneously to: ethnic campaign (Kuki–Meitei), theater (Northeast), legal regime (AFSPA on/off by police station), and leftover valley insurgency (UNLF/PLA). **Many-to-many**, not a single `conflict_id`.

### 4.2 Fields we would regret omitting

**Time**

- `start_asserted` / `start_source` (Nagas: 1947 vs 1956 vs 1958)
- `end_asserted` / `ongoing` (Mizoram 1986 vs Naga “ongoing”)
- `precision` (day / month / year / decade)
- `phase[]` with own dates
- `inactive_years[]` (UCDP on/off)

**Place**

- `geom` as point, multi-point, or polygon (LoC, Inner Line, BTC, Nagalim claim, Red Corridor districts)
- `precision`: village / PS / district / state / region / disputed
- `admin_as_of` (districts split constantly — 2000s Chhattisgarh, 2010s Telangana, 2019 J&K UTs, new Manipur districts)
- `claim_geometry` vs `control_geometry` vs `notification_geometry` (AFSPA, Disturbed, ILP)

**Actors**

- organizations with `split_from`, `merged_into`, `aliases[]`, `ceasefire: bool`
- `actor_type`: state regular / paramilitary / state police / rebel / militia / riot crowd / one-sided mob / external
- `directed` vs `two_sided` vs `one_sided` (UCDP three families)
- `civilian_targeting` flag

**Identities (overlapping, not exclusive)**

- `peoples[]`: tribe, ethnicity, language, religion, caste, nationality
- `identity_role`: claimant / recruited / targeted / bystander
- Never a single `ethnicity` enum for India

**Support and resources**

- `external_support[]`: state / diaspora / sanctuary country, with `claim_by`
- `resources[]`: land, forest, mining, oil, opium/poppy, water/hydro, highway tax, citizenship, autonomy, language, religion

**Harm**

- `deaths_{low,best,high}` with `source[]` — **never a single integer as truth**
- `deaths_is_official` / `deaths_is_advocacy`
- `combatant_vs_civilian` (and “terrorist” as a **source category**, not ours)
- `displaced_idps`, `refugees_out`, `refugees_in` (1971 into India; Rohingya/Chin 2017–)
- `sexual_violence` as a coded dimension (Gujarat, 1984, Manipur 2023 videos)

**Law and peace**

- `legal_regime[]`: AFSPA, Disturbed Areas, TADA, POTA, UAPA, NSA, ILP, Sixth Schedule, Art. 370
- `accord[]`: date, parties, implemented/partial/failed/secret
- `prosecution_sanction` (AFSPA §6) as an event outcome

**Narrative**

- `competing_frames[]`: e.g. `{frame: "police_action", by: "GoI"}`, `{frame: "massacre", by: "Sunderlal"}`
- `source_disagreement` boolean + notes
- `dataset_membership[]`: UCDP-ACD, UCDP-OSV, ACLED, GTD, SATP, none

### 4.3 Event vs campaign vs theater

If the viz is a **timeline of wars**, Hyderabad combat (5 days, <3,000 combat deaths) is a blip and the massacre is invisible. If it is a **heatmap of death**, Nellie outranks Kargil. The product needs a **toggle**: UCDP armed conflict / all lethal political violence / displacement. That toggle is a schema property (`passes_ucdp_25`, `passes_cow_1000`, `is_riot`, `is_one_sided`).

### 4.4 Fuzzy dates and contested starts

Examples that will break an ISO-date-only model:

- Kashmir insurgency: 1987 election / July 1988 / 1989 / 1990 Gawkadal
- Naga: 14 Aug 1947 / 1952 NFG / 1956 / 1958 AFSPA
- Maoist: 1967 Naxalbari / 2004 CPI-Maoist
- Gujarat: Godhra 27 Feb vs statewide 28 Feb
- Manipur: 3 May 2023 vs decades of hill–valley militarization

Store `start_type`: spark / first_battle / first_25_deaths / legal_notification / actor_founding.

### 4.5 Directed, two-sided, one-sided

Blue Star is two-sided combat inside a shrine full of civilians. 1984 November is one-sided. Punjab 1988–92 is two-sided plus both-sided one-sided (militants killing civilians; police disappearances). Gujarat 2002 is one-sided at neighborhood scale with a two-sided spark (Godhra). UCDP’s three files are the right **partition of violence types**, even when we reject UCDP’s thresholds.

### 4.6 What we would regret omitting (short list)

1. Source-specific fatality triples (low/best/high) rather than one number  
2. Overlapping identity arrays  
3. Accord objects that do not end campaigns  
4. Split/merge edges for groups  
5. Legal-regime polygons over time (AFSPA)  
6. Displacement as a first-class harm  
7. Precision of location and date  
8. Contested start dates  
9. External sanctuary as a place, not a flag  
10. Dataset membership and “why this is not in UCDP”  
11. Administrative boundary versioning  
12. Competing frames as data, not captions  

---

## 5. Scale coding (proposal)

UCDP 25 / 1,000 and COW 1,000 measure **organized battle deaths per year**. They are necessary and insufficient. India produces **high-fatality civilian massacres** that last one day and **low-fatality wars** that last forty years (Siachen, Naga ceasefire era).

### 5.1 Recommended display scale (campaign / episode)

Assign **small / medium / large** on the **campaign or episode**, not on the theater. A theater (Northeast) can contain large and small campaigns at once.

| Label | Rule (any one sufficient) | Designed to catch |
| --- | --- | --- |
| **Small** | Best-estimate deaths **< 100** and duration **< 1 year** and geography ≤ a few districts | Galwan as event; Junagadh; Goa; Hashimpura; most cow-lynchings |
| **Medium** | Deaths **100–999**, **or** organized armed campaign **≥ 3 years** below 1,000 total, **or** IDPs **10,000–49,999** | Mizoram (deaths), Meghalaya, many Bodo episodes, 1969 Ahmedabad |
| **Large** | Deaths **≥ 1,000** (any source’s *best* or official, with rival figure shown), **or** ≥1 UCDP *war* year, **or** COW war, **or** IDPs **≥ 50,000** with lethal violence | 1962, 1965, 1971, Kargil, Kashmir insurgency, Punjab, Maoist 2000–15, Hyderabad massacre, Nellie, 1984, Gujarat 2002, Manipur 2023, Partition |

**Modifiers** (flags, not a fourth size): `interstate`, `one_sided`, `riot`, `ongoing`, `nuclear_dyad`, `afspa`.

### 5.2 Sitting beside scholarly thresholds

Each campaign row should also carry:

- `ucdp_statebased_years[]`, `ucdp_max_intensity` (minor/war)
- `ucdp_osv_years[]`, `ucdp_nonstate_years[]`
- `cow_war_id` or null
- `acled_events` / `acled_fatalities` for 2016– (not comparable before)
- `satp_fatalities` if a theater table exists
- `duration_years`
- `area_km2` affected (Red Corridor peak vs 2025 leftover districts)
- `displacement`

A **large riot** (Nellie, 1984, Gujarat) will show: `scale: large`, `ucdp_statebased: null`, `type: one_sided | riot`. That juxtaposition **is** the infographic’s intellectual point.

### 5.3 Uncertainty badge

If `high / low > 2` (e.g. Hyderabad 27k vs 200k; Blue Star 493 vs 5,000), display an **uncertainty badge** and refuse a single-dot size encoding. Size encodings should use a **band** (min–max) or a hollow marker.

### 5.4 Worked examples

| Campaign | Scale | UCDP ACD | Why the two can diverge |
| --- | --- | --- | --- |
| Nellie 1983 | Large | Usually absent | One-day massacre, not a formally organized dyad |
| Gujarat 2002 | Large | Non-state / not ACD war | Riot, not rebel army |
| Kargil 1999 | Large | Yes, war year | Fits battle-death model |
| Naga 1997–2014 | Medium/small per year, Large historically | Often minor | Ceasefire + factional killing |
| Siachen | Medium deaths, Large strategic | Rarely a war year | Weather deaths, not battle |
| Manipur 2023– | Large | Non-state + some state-based | Ethnic war with militias |
| Galwan 2020 | Small event / part of medium standoff | Below war | 20 deaths, huge political magnitude — scale ≠ importance |

**Do not** use scale as a moral ranking. Optional separate encoding: `political_salience` (editorial) vs `human_cost` (data).

---

## 6. Implications for the infographic

1. **Three layers on one map:** (a) interstate lines (LoC, LAC, Siachen, 1971 east), (b) internal armed campaigns, (c) massacre/riot points. If the audience only sees (a), they miss Nellie and 1984; if only (c), they miss how AFSPA and ceasefires structure decades.
2. **Northeast as a full chapter**, not a sidebar: Inner Line, splinter tree, sanctuary, Nellie/NRC, Manipur 2023.
3. **No single death toll typography.** Pair every large number with its source and rival.
4. **Time is phase, not a slider from peace to war.** Mizoram is a completed arc; Nagaland is a frozen negotiation; Manipur is an active ethnic partition; Maoists are a shrinking but still lethal belt; Kashmir is a militarized dispute with a nuclear backdrop.
5. **Disputed borders:** draw both claim lines, labelled as claims (McMahon Line, Chinese 1960 line, Pakistani claim on Junagadh/Kashmir, Nagalim outline vs state boundary).

---

## Selected sources

**Datasets and codebooks**

- Uppsala Conflict Data Program. *UCDP/PRIO Armed Conflict Dataset* codebook v.26.1; *GED* codebook v.25.1/26.1. [https://ucdp.uu.se](https://ucdp.uu.se)  
- Gleditsch, Nils Petter, et al. 2002. “Armed Conflict 1946–2001.” *Journal of Peace Research*.  
- Sundberg, Ralph, and Erik Melander. 2013. “Introducing the UCDP Georeferenced Event Dataset.” *JPR* 50(4).  
- Davies, Shawn, et al. 2025. “Organized violence 1989–2024.” *JPR* 62(4).  
- UCDP country narrative, India (750); conflict pages Kashmir (364), Punjab/Khalistan (351); one-sided Government of India; non-state Hindus–Muslims (5512).  
- ACLED. Codebook; country/time-period coverage (India from 1/2016); [https://acleddata.com](https://acleddata.com)  
- START. *Global Terrorism Database* codebook. University of Maryland. EULA.  
- Sarkees, Meredith Reid, and Frank Wayman. COW War Data. Inter-State Wars list (wars 147, 160, 166, 178, 223).  
- Institute for Conflict Management / SATP. Fatalities tables, theater assessments, Punjab/Mizoram/Manipur/Tripura/NE backgrounders. [https://www.satp.org](https://www.satp.org)  
- Vogt, Manuel, et al. 2015. “Integrating Data on Ethnicity, Geography, and Conflict.” *Journal of Conflict Resolution*. EPR / ACD2EPR / GROW^up India atlas.  
- Ministry of Home Affairs. Annual reports; NE peace-process notes (2022–24); parliamentary replies on LWE.

**Commissions, HR, local scholarship**

- Sunderlal Committee report on Hyderabad (1948/49; public access ~2013). BBC (24 Sep 2013); Purushotham; archive.org scan.  
- Srikrishna Commission, Mumbai 1992–93 (1998).  
- Nanavati Commission, 1984.  
- Tewary Commission on Assam 1983 (submitted 1984; tabled Assam Assembly 25 Nov 2025); Mehta non-official commission.  
- Concerned Citizens Tribunal — Gujarat 2002. *Crime Against Humanity*, vols I–II (CJP/Sabrang).  
- Extra Judicial Execution Victim Families Association v. Union of India (2016).  
- Human Rights Watch / Amnesty reports on Punjab, Kashmir, Gujarat, AFSPA, Manipur.  
- Baruah, Sanjib. *Durable Disorder*; *In the Name of the Nation*.  
- Misra, Udayon. *The Periphery Strikes Back*.  
- Hazarika, Sanjoy. *Strangers of the Mist*; *Lal Thanhawla* biography (reviewed Frontline 2026).  
- Ganguly, Šumit. *The Crisis in Kashmir*; Indo-Pak work.  
- Staniland, Paul. *Networks of Rebellion*; Staniland & Stommes 2019, *India Review*.  
- Lacina, Bethany. Papers on Kashmir, Northeast, civilian targeting.  
- Wilkinson, Steven. 2004. *Votes and Violence*. Varshney–Wilkinson riot dataset.  
- Sundar, Nandini. Work on Bastar / Salwa Judum.  
- Brass, Paul. *The Production of Hindu-Muslim Violence*.

**Casualty anchors used above (non-exhaustive)**

- Indian MoD / parliamentary figures, 1962 and Kargil (527).  
- Chinese official history, 1962 (722 killed).  
- SATP / MHA J&K 1990–2017 (44,567); SATP Punjab (21,469); SATP Maoist 2010 (1,180); SATP NE 2003 (1,165).  
- Gujarat official 1,044; CCT 1,926.  
- Nellie official ~1,800; Tewary statewide 3,023.  
- Manipur Governor Feb 2024 (219); later official compilations to 306 by Sep 2026.  
- Galwan: Indian Army 20; PLA Daily 4.

All figures remain **provisional where the original source says so**. For visualization, prefer intervals over points.

---

*Document generated for mythyl.art infographics research, November 2026. Not a legal brief and not a position on any territorial claim.*
