"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent, type SetStateAction } from "react";
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
  membersOfGroup,
  isWeightyConflict,
  isWeightyIncident,
  SCALE_RADIUS,
  YEAR_MAX,
  type ConflictFamily,
  type Era,
  type Incident,
  type Scale,
} from "@/lib/raj";
import { RAJ_BOUNDS, RAJ_CENTER, RAJ_FIT_PADDING } from "@/lib/geo";
import { MapCard, type MapFocus } from "./RajMapCard";
import { RajTimeline } from "./RajTimeline";

type MapLens = "all" | "company" | "crown";

const SCALES: Scale[] = ["small", "medium", "large"];
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

const LAND_FILL: [string, string][] = [
  ["India", "#3a3126"],
  ["Pakistan", "#2c261e"],
  ["Bangladesh", "#433628"],
  ["Myanmar", "#2a241c"],
  ["Nepal", "#352c22"],
  ["Bhutan", "#31281f"],
  ["Sri Lanka", "#3a3126"],
];

const COUNTRY_LABELS = {
  type: "FeatureCollection" as const,
  features: [
    { type: "Feature" as const, properties: { ADMIN: "India" }, geometry: { type: "Point" as const, coordinates: [79.0, 21.8] } },
    { type: "Feature" as const, properties: { ADMIN: "Pakistan" }, geometry: { type: "Point" as const, coordinates: [68.8, 29.6] } },
    { type: "Feature" as const, properties: { ADMIN: "Bangladesh" }, geometry: { type: "Point" as const, coordinates: [92.6, 25.5] } },
    { type: "Feature" as const, properties: { ADMIN: "Myanmar" }, geometry: { type: "Point" as const, coordinates: [96.0, 19.1] } },
    { type: "Feature" as const, properties: { ADMIN: "Nepal" }, geometry: { type: "Point" as const, coordinates: [84.1, 28.3] } },
    { type: "Feature" as const, properties: { ADMIN: "Bhutan" }, geometry: { type: "Point" as const, coordinates: [90.4, 27.4] } },
    { type: "Feature" as const, properties: { ADMIN: "Sri Lanka" }, geometry: { type: "Point" as const, coordinates: [80.7, 7.7] } },
  ],
};

export function RajMap() {
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

  const hoverAt = useCallback((focus: SetStateAction<MapFocus | null>) => {
    setHovered(focus);
  }, []);

  const familySolo = useMemo(() => {
    const on = FAMILIES.filter((family) => enabledFamilies[family.id]);
    return on.length === 1 ? on[0].id : null;
  }, [enabledFamilies]);
  const familiesAllOn = familySolo === null && FAMILIES.every((family) => enabledFamilies[family.id]);

  const visible = useMemo(() => {
    return allConflicts().filter((conflict) => {
      if (!enabledScales[conflict.scale]) return false;
      if (!enabledFamilies[conflict.family]) return false;
      if (lens === "company" && conflict.rule !== "company") return false;
      if (lens === "crown" && conflict.rule !== "crown") return false;
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
      if (lens === "company" && campaign.rule !== "company") return false;
      if (lens === "crown" && campaign.rule !== "crown") return false;
      if (focusedConflictId && incident.conflictId === focusedConflictId) return true;
      return incidentInEra(incident, era);
    });
  }, [era, enabledScales, enabledFamilies, lens, focusedConflictId]);

  const scored = useMemo(() => {
    return allConflicts().filter((conflict) => {
      if (!enabledScales[conflict.scale]) return false;
      if (lens === "company" && conflict.rule !== "company") return false;
      if (lens === "crown" && conflict.rule !== "crown") return false;
      return true;
    });
  }, [enabledScales, lens]);

  const scoredIncidents = useMemo(() => {
    return allIncidents().filter((incident) => {
      const campaign = conflictById(incident.conflictId);
      if (!campaign) return false;
      if (!enabledScales[campaign.scale]) return false;
      if (lens === "company" && campaign.rule !== "company") return false;
      if (lens === "crown" && campaign.rule !== "crown") return false;
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
        glyphs: "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
        sources: {
          land: {
            type: "geojson",
            data: "/geo/south-asia.geojson",
          },
          india: {
            type: "geojson",
            data: "/geo/india-states.geojson",
          },
          labels: {
            type: "geojson",
            data: COUNTRY_LABELS,
          },
        },
        layers: [
          {
            id: "background",
            type: "background",
            paint: { "background-color": "#120e09" },
          },
          {
            id: "land-fill",
            type: "fill",
            source: "land",
            paint: {
              "fill-color": [
                "match",
                ["get", "ADMIN"],
                ...LAND_FILL.flat(),
                "#2c261e",
              ] as unknown as ExpressionSpecification,
              "fill-opacity": 1,
            },
          },
          {
            id: "land-line",
            type: "line",
            source: "land",
            paint: {
              "line-color": "#8a7350",
              "line-width": ["interpolate", ["linear"], ["zoom"], 3.5, 0.7, 5.5, 1.05, 7.5, 1.4],
              "line-opacity": 0.38,
            },
          },
          {
            id: "india-line",
            type: "line",
            source: "india",
            minzoom: 4.8,
            paint: {
              "line-color": "#9a8060",
              "line-width": ["interpolate", ["linear"], ["zoom"], 4.8, 0.4, 6.5, 0.7, 8, 1.05],
              "line-opacity": 0.22,
            },
          },
          {
            id: "country-labels",
            type: "symbol",
            source: "labels",
            maxzoom: 5.4,
            layout: {
              "text-field": ["get", "ADMIN"],
              "text-font": ["Noto Sans Regular"],
              "text-size": ["interpolate", ["linear"], ["zoom"], 3.5, 11, 5.0, 13],
              "text-letter-spacing": 0.14,
              "text-transform": "uppercase",
              "text-padding": 12,
              "text-max-width": 10,
            },
            paint: {
              "text-color": "#bba88a",
              "text-halo-color": "#120e09",
              "text-halo-width": 2.2,
              "text-opacity": 0.48,
            },
          },
          {
            id: "state-labels",
            type: "symbol",
            source: "india",
            minzoom: 5.2,
            layout: {
              "text-field": ["get", "NAME_1"],
              "text-font": ["Noto Sans Regular"],
              "text-size": ["interpolate", ["linear"], ["zoom"], 5.2, 10, 7, 13],
              "text-padding": 4,
              "text-letter-spacing": 0.04,
              "text-max-width": 8,
            },
            paint: {
              "text-color": "#e8d5b0",
              "text-halo-color": "#120e09",
              "text-halo-width": 1.25,
              "text-opacity": 0.88,
            },
          },
        ],
      },
      center: RAJ_CENTER,
      zoom: 3.85,
      minZoom: 3.2,
      maxZoom: 10,
      attributionControl: false,
    });

    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    map.addControl(
      new AttributionControl({
        compact: true,
        customAttribution: "Land: Natural Earth · states: GADM-derived · mythyl.art",
      }),
    );

    map.on("error", (event) => {
      const message = event.error?.message ?? "Map failed to load";
      setMapError(message);
    });
    map.on("load", () => {
      setMapError(null);
      map.getContainer().querySelector(".maplibregl-ctrl-bottom-left")?.remove();
      map.resize();
      map.fitBounds(RAJ_BOUNDS, { padding: RAJ_FIT_PADDING, duration: 0 });
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
      el.dataset.id = conflict.id;
      el.dataset.scale = conflict.scale;
      el.dataset.family = conflict.family;
      const famine = conflict.family === "famine";
      const weighty = isWeightyConflict(conflict) || Boolean(conflict.visualization?.pulse);
      if (weighty && !famine) el.dataset.pulse = "true";
      if (famine) el.dataset.ring = "hollow";
      const radius = famine ? SCALE_RADIUS[conflict.scale] + 5 : SCALE_RADIUS[conflict.scale];
      el.style.width = `${radius * 2}px`;
      el.style.height = `${radius * 2}px`;
      el.style.setProperty("--dot", familyColor(conflict));
      el.setAttribute("aria-label", conflict.name);

      el.addEventListener("mouseenter", () => hoverAt({ type: "conflict", conflict }));
      el.addEventListener("mouseleave", () =>
        hoverAt((current) =>
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
  }, [visible, hoverAt]);

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
      el.dataset.id = incident.id;
      el.dataset.kind = incident.kind;
      el.dataset.campaign = incident.conflictId;
      const campaign = conflictById(incident.conflictId);
      const weighty = isWeightyIncident(incident);
      if (weighty) el.dataset.pulse = "true";
      el.style.setProperty("--dot", campaign ? familyColor(campaign) : "#e8d5b0");
      el.setAttribute("aria-label", incident.name);
      el.addEventListener("mouseenter", () => hoverAt({ type: "incident", incident }));
      el.addEventListener("mouseleave", () =>
        hoverAt((current) =>
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
        offset: [slot * 12, slot * 5],
      })
        .setLngLat([incident.place.longitude, incident.place.latitude])
        .addTo(map);
      incidentMarkersRef.current.push(marker);
    }
  }, [visibleIncidents, hoverAt]);

  useEffect(() => {
    const selectedConflictId =
      selected?.type === "conflict"
        ? selected.conflict.id
        : selected?.type === "incident"
          ? selected.incident.conflictId
          : null;
    const selectedIncidentId = selected?.type === "incident" ? selected.incident.id : null;
    const hoverConflictId =
      hovered?.type === "conflict"
        ? hovered.conflict.id
        : hovered?.type === "incident"
          ? hovered.incident.conflictId
          : null;
    const hoverIncidentId = hovered?.type === "incident" ? hovered.incident.id : null;

    for (const marker of markersRef.current) {
      const el = marker.getElement();
      const id = el.dataset.id ?? "";
      el.dataset.on = id === selectedConflictId ? "true" : "false";
      el.dataset.hot = id === hoverConflictId ? "true" : "false";
    }
    for (const marker of incidentMarkersRef.current) {
      const el = marker.getElement();
      const id = el.dataset.id ?? "";
      el.dataset.on = id === selectedIncidentId ? "true" : "false";
      el.dataset.hot =
        id === hoverIncidentId ||
        (!hoverIncidentId && hoverConflictId && el.dataset.campaign === hoverConflictId)
          ? "true"
          : "false";
    }
  }, [selected, hovered, visible, visibleIncidents]);

  function flyCompany() {
    setLens("company");
    mapRef.current?.fitBounds(RAJ_BOUNDS, { padding: RAJ_FIT_PADDING, duration: 800 });
  }

  function flyCrown() {
    setLens("crown");
    mapRef.current?.fitBounds(RAJ_BOUNDS, { padding: RAJ_FIT_PADDING, duration: 800 });
  }

  function resetView() {
    setLens("all");
    mapRef.current?.fitBounds(RAJ_BOUNDS, { padding: RAJ_FIT_PADDING, duration: 800 });
  }

  function fitFamilyView(next: Record<ConflictFamily, boolean>) {
    const map = mapRef.current;
    if (!map) return;
    const on = FAMILIES.filter((family) => next[family.id]);
    if (on.length === 0 || on.length === FAMILIES.length) {
      map.fitBounds(RAJ_BOUNDS, { padding: RAJ_FIT_PADDING, duration: 800 });
      return;
    }
    const points = allConflicts()
      .filter((conflict) => {
        if (!next[conflict.family]) return false;
        if (!enabledScales[conflict.scale]) return false;
        if (lens === "company" && conflict.rule !== "company") return false;
        if (lens === "crown" && conflict.rule !== "crown") return false;
        return true;
      })
      .map((conflict) => conflict.primaryPoint);
    if (points.length === 0) {
      map.fitBounds(RAJ_BOUNDS, { padding: RAJ_FIT_PADDING, duration: 800 });
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
      { padding: { top: 32, bottom: 48, left: 32, right: 36 }, duration: 900, maxZoom: 6.6 },
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
        <span className="swatch" style={{ background: family.color }} />
        {family.label}
      </button>
    );
  }

  function flyToFocus(focus: MapFocus) {
    const map = mapRef.current;
    if (!map) return;
    const padding = { top: 28, bottom: 120, left: 28, right: 28 };
    if (focus.type === "conflict") {
      map.easeTo({
        center: [focus.conflict.primaryPoint.longitude, focus.conflict.primaryPoint.latitude],
        zoom: Math.max(map.getZoom(), focus.conflict.primaryPoint.precision === "village" ? 7.5 : 5.6),
        duration: 700,
        padding,
      });
      return;
    }
    map.easeTo({
      center: [focus.incident.place.longitude, focus.incident.place.latitude],
      zoom: Math.max(map.getZoom(), focus.incident.place.precision === "building" ? 8 : 6.2),
      duration: 700,
      padding,
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

  const tip = hovered && !selected ? hovered : null;

  return (
    <>
    <div className="map-stage">
      <header className="map-head">
        <div className="map-head-top">
          <p className="map-kicker">East India Company and British Crown · 1757–{YEAR_MAX}</p>
          <h1>Colonial violence in India</h1>
          <em className="map-tools-count">
            {visible.length} campaigns
            {visibleIncidents.length ? ` · ${visibleIncidents.length} days` : ""}
          </em>
        </div>
      </header>
      <div className="map-tools">
        <div className="map-tools-row">
          <div className="map-key">
            <span className="map-key-item">
              <i className="map-key-ring" />
              campaign
            </span>
            <span className="map-key-item">
              <i className="map-key-day" />
              day
            </span>
            <span className="map-key-item">
              <i className="map-key-ring" data-ring="hollow" />
              famine
            </span>
          </div>
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
            {SCALES.map((scale) => (
              <button
                key={scale}
                type="button"
                className={enabledScales[scale] ? "on" : ""}
                data-scale={scale}
                title={`${scale} campaigns`}
                onClick={() =>
                  setEnabledScales((current) => ({ ...current, [scale]: !current[scale] }))
                }
              >
                <i className="map-key-ring" data-scale={scale} />
                {scale}
              </button>
            ))}
            <button
              type="button"
              className={lens === "company" ? "on" : ""}
              title="Company rule, Plassey to 1857"
              onClick={flyCompany}
            >
              Company
            </button>
            <button
              type="button"
              className={lens === "crown" ? "on" : ""}
              title="Crown Raj, 1858 to 1947"
              onClick={flyCrown}
            >
              Crown
            </button>
            <button type="button" className={lens === "all" ? "on" : ""} onClick={resetView}>
              Whole map
            </button>
          </div>
        </div>
        <div className="map-tools-row">
          <div className="map-filters map-legend">
            <button
              type="button"
              className={familiesAllOn ? "on" : ""}
              title="Every kind of force"
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
      </div>
      <div className="map-shell" id="map" data-atlas="raj">
        <div className="map-canvas">
          <div
            ref={rootRef}
            className="conflict-map"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          />
          {mapError ? <p className="map-error">{mapError}</p> : null}
        </div>
        {tip ? (
          <p className="map-tip">
            {tip.type === "conflict"
              ? `${tip.conflict.name} · ${tip.conflict.time.start.year}${
                  tip.conflict.time.end?.year && tip.conflict.time.end.year !== tip.conflict.time.start.year
                    ? `–${tip.conflict.time.end.year}`
                    : ""
                }`
              : `${tip.incident.name} · ${tip.incident.time.year}`}
          </p>
        ) : null}
        {selected ? (
          <MapCard
            focus={selected}
            locked
            onClose={() => setSelected(null)}
            onOpenIncident={openIncident}
            onHover={hoverAt}
            hovered={hovered}
          />
        ) : null}
      </div>
    </div>
    <RajTimeline
      campaigns={scored}
      incidents={scoredIncidents}
      era={era}
      enabledFamilies={enabledFamilies}
      selected={selected}
      hovered={hovered}
      onHover={hoverAt}
      onSelect={selectFromYears}
      onClose={() => setSelected(null)}
      familySolo={familySolo}
      familiesAllOn={familiesAllOn}
      onFocusFamily={onFamilyClick}
    />
    </>
  );
}
