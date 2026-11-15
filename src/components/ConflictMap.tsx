"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import {
  AttributionControl,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  setWorkerUrl,
  type ExpressionSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

if (typeof window !== "undefined") {
  setWorkerUrl(`${window.location.origin}/maplibre/maplibre-gl-worker.mjs`);
}
import {
  allConflicts,
  allIncidents,
  conflictById,
  conflictInEra,
  ERAS,
  FAMILIES,
  FAMILY_GROUPS,
  familyColor,
  incidentInEra,
  isolateFamilies,
  isExternalTerrorism,
  membersOfGroup,
  isRecentConflict,
  isRecentIncident,
  NORTHEAST_STATES,
  SCALE_RADIUS,
  YEAR_MAX,
  type ConflictFamily,
  type Era,
  type Incident,
  type Scale,
} from "@/lib/conflicts";
import { INDIA_BOUNDS, INDIA_CENTER, INDIA_FIT_PADDING, NORTHEAST_BOUNDS } from "@/lib/geo";
import { MapCard, type MapFocus } from "./MapCard";
import { ConflictTimeline } from "./ConflictTimeline";

type MapLens = "all" | "northeast" | "external";

const SCALES: Scale[] = ["small", "medium", "large"];
const NE_NAMES = [...NORTHEAST_STATES];
const ALL_FAMILIES_ON = Object.fromEntries(FAMILIES.map((family) => [family.id, true])) as Record<
  ConflictFamily,
  boolean
>;

type LegendEntry =
  | { kind: "family"; family: (typeof FAMILIES)[number] }
  | { kind: "group"; group: (typeof FAMILY_GROUPS)[number]; members: (typeof FAMILIES)[number][] };

function legendEntries(): LegendEntry[] {
  const seen = new Set<string>();
  const entries: LegendEntry[] = [];
  for (const family of FAMILIES) {
    if (family.group) {
      if (seen.has(family.group)) continue;
      seen.add(family.group);
      const group = FAMILY_GROUPS.find((row) => row.id === family.group);
      const members = membersOfGroup(family.group);
      if (group && members.length > 0) {
        entries.push({ kind: "group", group, members });
        continue;
      }
    }
    entries.push({ kind: "family", family });
  }
  return entries;
}

const LEGEND = legendEntries();

function isolateFamily(id: ConflictFamily): Record<ConflictFamily, boolean> {
  return isolateFamilies([id]);
}

const NE_FILL: [string, string][] = [
  ["Arunachal Pradesh", "#5c806e"],
  ["Assam", "#4a6758"],
  ["Manipur", "#57806c"],
  ["Meghalaya", "#3f5f51"],
  ["Mizoram", "#4e7260"],
  ["Nagaland", "#3a584c"],
  ["Sikkim", "#45685a"],
  ["Tripura", "#527866"],
];

export function ConflictMap() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const incidentMarkersRef = useRef<Marker[]>([]);
  const [era, setEra] = useState<Era>(ERAS[0]);
  const [lens, setLens] = useState<MapLens>("all");
  const [enabledScales, setEnabledScales] = useState<Record<Scale, boolean>>({
    small: true,
    medium: true,
    large: true,
  });
  const [enabledFamilies, setEnabledFamilies] = useState<Record<ConflictFamily, boolean>>(ALL_FAMILIES_ON);
  const [selected, setSelected] = useState<MapFocus | null>(null);
  const [hovered, setHovered] = useState<MapFocus | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const familySolo = useMemo(() => {
    const on = FAMILIES.filter((family) => enabledFamilies[family.id]);
    return on.length === 1 ? on[0].id : null;
  }, [enabledFamilies]);
  const familiesAllOn = familySolo === null && FAMILIES.every((family) => enabledFamilies[family.id]);

  const visible = useMemo(() => {
    return allConflicts().filter((conflict) => {
      if (!enabledScales[conflict.scale]) return false;
      if (!enabledFamilies[conflict.family]) return false;
      if (lens === "northeast" && !conflict.northeast) return false;
      if (lens === "external" && !isExternalTerrorism(conflict)) return false;
      return conflictInEra(conflict, era);
    });
  }, [era, enabledScales, enabledFamilies, lens]);

  const focusedConflictId =
    selected?.type === "conflict"
      ? selected.conflict.id
      : selected?.type === "incident"
        ? selected.incident.conflictId
        : null;

  const visibleIncidents = useMemo(() => {
    return allIncidents().filter((incident) => {
      const campaign = conflictById(incident.conflictId);
      if (!campaign) return false;
      if (!enabledScales[campaign.scale]) return false;
      if (!enabledFamilies[campaign.family]) return false;
      if (lens === "northeast" && !campaign.northeast) return false;
      if (lens === "external" && !isExternalTerrorism(campaign)) return false;
      if (focusedConflictId && incident.conflictId === focusedConflictId) return true;
      return incidentInEra(incident, era);
    });
  }, [era, enabledScales, enabledFamilies, lens, focusedConflictId]);

  const scored = useMemo(() => {
    return allConflicts().filter((conflict) => {
      if (!enabledScales[conflict.scale]) return false;
      if (lens === "northeast" && !conflict.northeast) return false;
      if (lens === "external" && !isExternalTerrorism(conflict)) return false;
      return true;
    });
  }, [enabledScales, lens]);

  const scoredIncidents = useMemo(() => {
    return allIncidents().filter((incident) => {
      const campaign = conflictById(incident.conflictId);
      if (!campaign) return false;
      if (!enabledScales[campaign.scale]) return false;
      if (lens === "northeast" && !campaign.northeast) return false;
      if (lens === "external" && !isExternalTerrorism(campaign)) return false;
      return true;
    });
  }, [enabledScales, lens]);

  useEffect(() => {
    if (!rootRef.current || mapRef.current) return;

    const map = new MapLibreMap({
      container: rootRef.current,
      cooperativeGestures: true,
      locale: {
        "CooperativeGesturesHandler.WindowsHelpText": "Ctrl + scroll to zoom · otherwise the page moves",
        "CooperativeGesturesHandler.MacHelpText": "⌘ + scroll to zoom · otherwise the page moves",
        "CooperativeGesturesHandler.MobileHelpText": "Two fingers to move the map",
      },
      style: {
        version: 8,
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
        sources: {
          india: {
            type: "geojson",
            data: "/geo/india-states.geojson",
          },
        },
        layers: [
          {
            id: "background",
            type: "background",
            paint: { "background-color": "#070806" },
          },
          {
            id: "india-fill",
            type: "fill",
            source: "india",
            paint: {
              "fill-color": [
                "match",
                ["get", "NAME_1"],
                ...NE_FILL.flat(),
                "#3a4630",
              ] as unknown as ExpressionSpecification,
              "fill-opacity": 1,
            },
          },
          {
            id: "india-line",
            type: "line",
            source: "india",
            paint: {
              "line-color": "#cfc0a4",
              "line-width": ["interpolate", ["linear"], ["zoom"], 4, 0.55, 5.5, 0.9, 7.5, 1.35],
              "line-opacity": 0.75,
            },
          },
          {
            id: "ne-line",
            type: "line",
            source: "india",
            filter: ["match", ["get", "NAME_1"], NE_NAMES, true, false],
            paint: {
              "line-color": "#f2e6cc",
              "line-width": ["interpolate", ["linear"], ["zoom"], 4, 0.9, 5.5, 1.55, 7.2, 2.3],
              "line-opacity": 0.95,
            },
          },
          {
            id: "state-labels",
            type: "symbol",
            source: "india",
            minzoom: 5.1,
            layout: {
              "text-field": ["get", "NAME_1"],
              "text-font": ["Open Sans Regular"],
              "text-size": ["interpolate", ["linear"], ["zoom"], 5.1, 10, 7, 13],
              "text-padding": 4,
              "text-letter-spacing": 0.04,
              "text-max-width": 8,
            },
            paint: {
              "text-color": "#e7dcc8",
              "text-halo-color": "#070806",
              "text-halo-width": 1.25,
              "text-opacity": 0.9,
            },
          },
        ],
      },
      center: INDIA_CENTER,
      zoom: 4.15,
      minZoom: 3.4,
      maxZoom: 10,
      attributionControl: false,
    });

    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    map.addControl(
      new AttributionControl({
        compact: true,
        customAttribution: "Boundaries: GADM-derived community GeoJSON · mythyl.art",
      }),
    );

    map.on("error", (event) => {
      const message = event.error?.message ?? "Map failed to load";
      setMapError(message);
    });
    map.on("load", () => {
      setMapError(null);
      map.resize();
      map.fitBounds(INDIA_BOUNDS, { padding: INDIA_FIT_PADDING, duration: 0 });
    });
    const resize = () => map.resize();
    window.addEventListener("resize", resize);
    const observer = new ResizeObserver(resize);
    observer.observe(rootRef.current);
    requestAnimationFrame(resize);

    mapRef.current = map;
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const marker of markersRef.current) marker.remove();
    markersRef.current = [];

    for (const conflict of visible) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "conflict-dot";
      el.dataset.scale = conflict.scale;
      const recent = isRecentConflict(conflict);
      const external = isExternalTerrorism(conflict);
      if (recent || conflict.visualization?.pulse) el.dataset.pulse = "true";
      if (recent) el.dataset.recent = "true";
      if (external) el.dataset.external = "true";
      const radius = SCALE_RADIUS[conflict.scale];
      el.style.width = `${radius * 2}px`;
      el.style.height = `${radius * 2}px`;
      el.style.background = familyColor(conflict);
      el.style.opacity = recent ? "1" : "0.78";
      if (external) {
        el.style.boxShadow = recent
          ? "0 0 0 1px rgba(7,8,6,0.4), 0 0 0 5px rgba(232,93,76,0.32)"
          : "0 0 0 1px rgba(7,8,6,0.45), 0 0 0 4px rgba(196,170,120,0.42)";
      }
      el.setAttribute("aria-label", conflict.name);

      el.addEventListener("mouseenter", () => setHovered({ type: "conflict", conflict }));
      el.addEventListener("mouseleave", () =>
        setHovered((current) =>
          current?.type === "conflict" && current.conflict.id === conflict.id ? null : current,
        ),
      );
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        setSelected({ type: "conflict", conflict });
        map.easeTo({
          center: [conflict.primaryPoint.longitude, conflict.primaryPoint.latitude],
          zoom: Math.max(map.getZoom(), conflict.primaryPoint.precision === "village" ? 7.5 : 5.6),
          duration: 700,
        });
      });

      const marker = new Marker({ element: el, anchor: "center" })
        .setLngLat([conflict.primaryPoint.longitude, conflict.primaryPoint.latitude])
        .addTo(map);
      markersRef.current.push(marker);
    }
  }, [visible]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const marker of incidentMarkersRef.current) marker.remove();
    incidentMarkersRef.current = [];

    const occupancy = new Map<string, number>();
    for (const incident of visibleIncidents) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "incident-dot";
      el.dataset.kind = incident.kind;
      const campaign = conflictById(incident.conflictId);
      const recent = isRecentIncident(incident);
      el.style.cssText = [
        "width:12px",
        "height:12px",
        "padding:0",
        "border:1px solid #070806",
        "border-radius:2px",
        `background:${campaign ? familyColor(campaign) : "#e7dcc8"}`,
        recent
          ? "box-shadow:0 0 0 1px rgba(7,8,6,0.35), 0 0 0 5px rgba(232,93,76,0.32)"
          : "box-shadow:0 0 0 1px rgba(7,8,6,0.35)",
        `opacity:${recent ? 1 : 0.8}`,
        "cursor:pointer",
        "transform:rotate(45deg)",
      ].join(";");
      el.setAttribute("aria-label", incident.name);
      el.addEventListener("mouseenter", () => setHovered({ type: "incident", incident }));
      el.addEventListener("mouseleave", () =>
        setHovered((current) =>
          current?.type === "incident" && current.incident.id === incident.id ? null : current,
        ),
      );
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        setSelected({ type: "incident", incident });
        map.easeTo({
          center: [incident.place.longitude, incident.place.latitude],
          zoom: Math.max(map.getZoom(), incident.place.precision === "building" ? 8 : 6.2),
          duration: 700,
        });
      });

      const slotKey = `${incident.place.longitude.toFixed(1)}|${incident.place.latitude.toFixed(1)}`;
      const slot = occupancy.get(slotKey) ?? 0;
      occupancy.set(slotKey, slot + 1);
      const marker = new Marker({
        element: el,
        anchor: "center",
        offset: [slot * 18, slot * 6],
      })
        .setLngLat([incident.place.longitude, incident.place.latitude])
        .addTo(map);
      incidentMarkersRef.current.push(marker);
    }
  }, [visibleIncidents]);

  function flyNortheast() {
    setLens("northeast");
    mapRef.current?.fitBounds(NORTHEAST_BOUNDS, { padding: 48, duration: 900 });
  }

  function flyExternal() {
    setLens("external");
    mapRef.current?.fitBounds(INDIA_BOUNDS, { padding: INDIA_FIT_PADDING, duration: 800 });
  }

  function resetView() {
    setLens("all");
    mapRef.current?.fitBounds(INDIA_BOUNDS, { padding: INDIA_FIT_PADDING, duration: 800 });
  }

  function fitFamilyView(next: Record<ConflictFamily, boolean>) {
    const map = mapRef.current;
    if (!map) return;
    const on = FAMILIES.filter((family) => next[family.id]);
    if (on.length === 0 || on.length === FAMILIES.length) {
      if (lens === "northeast") {
        map.fitBounds(NORTHEAST_BOUNDS, { padding: 48, duration: 900 });
        return;
      }
      map.fitBounds(INDIA_BOUNDS, { padding: INDIA_FIT_PADDING, duration: 800 });
      return;
    }
    const points = allConflicts()
      .filter((conflict) => {
        if (!next[conflict.family]) return false;
        if (!enabledScales[conflict.scale]) return false;
        if (lens === "northeast" && !conflict.northeast) return false;
        if (lens === "external" && !isExternalTerrorism(conflict)) return false;
        return true;
      })
      .map((conflict) => conflict.primaryPoint);
    if (points.length === 0) {
      map.fitBounds(INDIA_BOUNDS, { padding: INDIA_FIT_PADDING, duration: 800 });
      return;
    }
    let minLon = Infinity;
    let minLat = Infinity;
    let maxLon = -Infinity;
    let maxLat = -Infinity;
    for (const point of points) {
      minLon = Math.min(minLon, point.longitude);
      minLat = Math.min(minLat, point.latitude);
      maxLon = Math.max(maxLon, point.longitude);
      maxLat = Math.max(maxLat, point.latitude);
    }
    const pad = Math.max(0.85, (maxLon - minLon) * 0.14, (maxLat - minLat) * 0.14);
    map.fitBounds(
      [
        [minLon - pad, minLat - pad],
        [maxLon + pad, maxLat + pad],
      ],
      { padding: { top: 96, bottom: 88, left: 48, right: 56 }, duration: 900, maxZoom: 6.6 },
    );
  }

  function applyFamilies(next: Record<ConflictFamily, boolean>, fit: boolean) {
    setEnabledFamilies(next);
    setSelected((current) => {
      if (!current) return current;
      const family =
        current.type === "conflict"
          ? current.conflict.family
          : conflictById(current.incident.conflictId)?.family;
      if (family && !next[family]) return null;
      return current;
    });
    if (fit) fitFamilyView(next);
  }

  function onFamilyClick(id: ConflictFamily, event: { altKey: boolean; metaKey: boolean }) {
    if (event.altKey || event.metaKey) {
      const next = { ...enabledFamilies, [id]: !enabledFamilies[id] };
      if (!FAMILIES.some((family) => next[family.id])) return;
      applyFamilies(next, false);
      return;
    }
    if (familiesAllOn) {
      applyFamilies(isolateFamily(id), true);
      return;
    }
    if (enabledFamilies[id]) {
      const remaining = FAMILIES.filter((family) => family.id !== id && enabledFamilies[family.id]);
      applyFamilies(remaining.length === 0 ? ALL_FAMILIES_ON : { ...enabledFamilies, [id]: false }, true);
      return;
    }
    applyFamilies({ ...enabledFamilies, [id]: true }, true);
  }

  function onGroupClick(groupId: string) {
    const members = membersOfGroup(groupId).map((family) => family.id);
    if (members.length === 0) return;
    const allMembersOn = members.every((id) => enabledFamilies[id]);
    const onlyThisGroup =
      allMembersOn && FAMILIES.every((family) => enabledFamilies[family.id] === members.includes(family.id));
    if (onlyThisGroup) {
      applyFamilies(ALL_FAMILIES_ON, true);
      return;
    }
    if (familiesAllOn || allMembersOn) {
      applyFamilies(isolateFamilies(members), true);
      return;
    }
    const next = { ...enabledFamilies };
    for (const id of members) next[id] = true;
    applyFamilies(next, true);
  }

  function showAllFamilies() {
    applyFamilies(ALL_FAMILIES_ON, true);
  }

  function familyChip(family: (typeof FAMILIES)[number]) {
    const focused = !familiesAllOn && enabledFamilies[family.id];
    return (
      <button
        key={family.id}
        type="button"
        className={enabledFamilies[family.id] ? "on" : ""}
        data-focus={focused ? "true" : "false"}
        aria-pressed={enabledFamilies[family.id]}
        title={`${family.hint}. Click to show only this. Click another kind to add it. Click again to drop it.`}
        onClick={(event: MouseEvent<HTMLButtonElement>) => onFamilyClick(family.id, event)}
        style={
          focused ? { boxShadow: `0 0 0 1px ${family.color}, 0 0 18px ${family.color}55` } : undefined
        }
      >
        <span className="swatch" style={{ background: family.color, width: "0.55rem", height: "0.55rem" }} />
        {family.label}
      </button>
    );
  }

  const panel = hovered ?? selected;

  function flyToFocus(focus: MapFocus) {
    const map = mapRef.current;
    if (!map) return;
    if (focus.type === "conflict") {
      map.easeTo({
        center: [focus.conflict.primaryPoint.longitude, focus.conflict.primaryPoint.latitude],
        zoom: Math.max(map.getZoom(), focus.conflict.primaryPoint.precision === "village" ? 7.5 : 5.6),
        duration: 700,
      });
      return;
    }
    map.easeTo({
      center: [focus.incident.place.longitude, focus.incident.place.latitude],
      zoom: Math.max(map.getZoom(), focus.incident.place.precision === "building" ? 8 : 6.2),
      duration: 700,
    });
  }

  function openIncident(incident: Incident) {
    setSelected({ type: "incident", incident });
    flyToFocus({ type: "incident", incident });
  }

  function selectFromYears(focus: MapFocus) {
    setSelected(focus);
    flyToFocus(focus);
  }

  return (
    <>
    <div className="map-shell" id="map">
      <div className="map-canvas">
        <div
          ref={rootRef}
          className="conflict-map"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      </div>
      {mapError ? <p className="map-error">{mapError}</p> : null}

      <div className="map-hud">
        <div className="map-hud-top">
          <p className="map-kicker">Post-independence · 1947—{YEAR_MAX}</p>
          <h1>Conflicts in India</h1>
          <p className="map-lede">
            Wars, insurgencies, and riots after 1947. Colour is the kind of
            conflict; size is scale. Squares are days. A ring marks a war still
            open, or a day from this last decade.
          </p>
          <div className="map-filters">
            {SCALES.map((scale) => (
              <button
                key={scale}
                type="button"
                className={enabledScales[scale] ? "on" : ""}
                data-scale={scale}
                onClick={() =>
                  setEnabledScales((current) => ({ ...current, [scale]: !current[scale] }))
                }
              >
                <span
                  className="swatch"
                  style={{
                    width: scale === "large" ? "0.7rem" : scale === "medium" ? "0.55rem" : "0.4rem",
                    height: scale === "large" ? "0.7rem" : scale === "medium" ? "0.55rem" : "0.4rem",
                    background: "#e7dcc8",
                  }}
                />
                {scale}
              </button>
            ))}
            <button type="button" className={lens === "northeast" ? "on" : ""} onClick={flyNortheast}>
              Northeast
            </button>
            <button
              type="button"
              className={lens === "external" ? "on" : ""}
              title="Transnational terror on Indian soil. Maoist and Northeast campaigns stay off this list."
              onClick={flyExternal}
            >
              External
            </button>
            <button type="button" className={lens === "all" ? "on" : ""} onClick={resetView}>
              All India
            </button>
          </div>
          <div className="map-filters map-legend" style={{ marginTop: "0.7rem" }}>
            <button
              type="button"
              className={familiesAllOn ? "on" : ""}
              title="Every kind of conflict"
              onClick={showAllFamilies}
            >
              All kinds
            </button>
            {LEGEND.map((entry) => {
              if (entry.kind === "family") return familyChip(entry.family);
              const { group, members } = entry;
              const memberIds = members.map((family) => family.id);
              const allMembersOn = memberIds.every((id) => enabledFamilies[id]);
              const onlyThisGroup =
                allMembersOn &&
                FAMILIES.every((family) => enabledFamilies[family.id] === memberIds.includes(family.id));
              const mix = !familiesAllOn && !onlyThisGroup && memberIds.some((id) => enabledFamilies[id]);
              return (
                <span
                  key={group.id}
                  className="map-legend-cluster"
                  data-focus={onlyThisGroup ? "true" : "false"}
                  data-mix={mix ? "true" : "false"}
                >
                  <button
                    type="button"
                    className={onlyThisGroup || mix ? "on" : familiesAllOn ? "on" : ""}
                    data-focus={onlyThisGroup ? "true" : "false"}
                    aria-pressed={onlyThisGroup || mix}
                    title={`${group.hint}. Click to show this cluster. Click a member to add or drop it.`}
                    onClick={() => onGroupClick(group.id)}
                    style={
                      onlyThisGroup
                        ? { boxShadow: `0 0 0 1px ${group.color}, 0 0 18px ${group.color}55` }
                        : undefined
                    }
                  >
                    <span className="swatch-stack">
                      {members.map((family) => (
                        <i key={family.id} style={{ background: family.color }} />
                      ))}
                    </span>
                    {group.label}
                  </button>
                  {members.map((family) => familyChip(family))}
                </span>
              );
            })}
          </div>
        </div>

        <div className="map-slider map-eras" style={{ flexWrap: "wrap", maxWidth: "54rem", rowGap: "0.55rem" }}>
          <div className="map-filters">
            {ERAS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={era.id === item.id ? "on" : ""}
                title={item.hint}
                onClick={() => setEra(item)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <em>
            {visible.length} campaigns
            {visibleIncidents.length ? ` · ${visibleIncidents.length} days` : ""}
          </em>
        </div>
      </div>

      {panel ? (
        <MapCard
          focus={panel}
          locked={Boolean(selected)}
          onClose={() => setSelected(null)}
          onOpenIncident={openIncident}
        />
      ) : null}
    </div>
    <ConflictTimeline
      campaigns={scored}
      incidents={scoredIncidents}
      era={era}
      enabledFamilies={enabledFamilies}
      selected={selected}
      hovered={hovered}
      onHover={setHovered}
      onSelect={selectFromYears}
      onClose={() => setSelected(null)}
      familySolo={familySolo}
      familiesAllOn={familiesAllOn}
      onFocusFamily={onFamilyClick}
    />
    </>
  );
}
