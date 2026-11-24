"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  ERAS,
  EVENTS,
  META,
  PARTY_COLOR,
  SCALE_LABEL,
  STATES,
  UNION,
  YEAR_MAX,
  YEAR_MIN,
  allEvents,
  cmAt,
  SERIES_YEARS,
  colorForImr,
  colorForIncome,
  eventInEra,
  eventsForState,
  formatImr,
  formatRupees,
  imrExtent,
  imrOf,
  incomeExtent,
  incomeOf,
  incomePrice,
  sparkImr,
  sparkIncome,
  stateByGeo,
  type EventScale,
  type IndianState,
  type Metric,
  type StateEra,
  type StateEvent,
} from "@/lib/states";
import { INDIA_BOUNDS, INDIA_CENTER, INDIA_FIT_PADDING } from "@/lib/geo";
import { Sparkline } from "./Sparkline";
import { StatesTimeline } from "./StatesTimeline";

const SCALES: EventScale[] = ["union", "state", "local"];

function seriesYear(era: StateEra): number {
  return era.year ?? SERIES_YEARS[SERIES_YEARS.length - 1];
}

function fillExpression(metric: Metric, era: StateEra): ExpressionSpecification {
  const pairs: (string | string)[] = [];
  const year = seriesYear(era);
  if (metric === "income") {
    const { min, max } = incomeExtent(year);
    for (const state of STATES) {
      const value = incomeOf(state, year);
      if (value == null) continue;
      pairs.push(state.geoName, colorForIncome(value, min, max));
    }
  } else {
    const { min, max } = imrExtent(year);
    for (const state of STATES) {
      const value = imrOf(state, year);
      if (value == null) continue;
      pairs.push(state.geoName, colorForImr(value, min, max));
    }
  }
  return ["match", ["get", "NAME_1"], ...pairs, "#1c2018"] as unknown as ExpressionSpecification;
}

function eventPoint(event: StateEvent): { longitude: number; latitude: number } | null {
  if (event.states.includes("*")) {
    return { longitude: 77.21, latitude: 28.61 };
  }
  const state = STATES.find((row) => event.states.includes(row.name) || event.states.includes(row.geoName));
  return state ? state.center : null;
}

export function StatesMap() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [metric, setMetric] = useState<Metric>("survival");
  const [era, setEra] = useState<StateEra>(ERAS[ERAS.length - 1]);
  const [enabledScales, setEnabledScales] = useState<Record<EventScale, boolean>>({
    union: true,
    state: true,
    local: true,
  });
  const [selected, setSelected] = useState<IndianState | null>(null);
  const selectedRef = useRef<IndianState | null>(null);
  selectedRef.current = selected;
  const [hovered, setHovered] = useState<IndianState | null>(null);
  const [yearsSelected, setYearsSelected] = useState<StateEvent | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const visibleEvents = useMemo(() => {
    return allEvents().filter((event) => enabledScales[event.scale] && eventInEra(event, era));
  }, [enabledScales, era]);

  const paintFill = useCallback(() => {
    const map = mapRef.current;
    if (!map?.getLayer("india-fill")) return;
    map.setPaintProperty("india-fill", "fill-color", fillExpression(metric, era));
  }, [metric, era]);

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
          india: { type: "geojson", data: "/geo/india-states.geojson" },
          centers: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: STATES.map((state) => ({
                type: "Feature",
                properties: { NAME_1: state.name },
                geometry: {
                  type: "Point",
                  coordinates: [state.center.longitude, state.center.latitude],
                },
              })),
            },
          },
        },
        layers: [
          { id: "background", type: "background", paint: { "background-color": "#0b100f" } },
          {
            id: "india-fill",
            type: "fill",
            source: "india",
            paint: { "fill-color": fillExpression(metric, era), "fill-opacity": 0.94 },
          },
          {
            id: "india-line",
            type: "line",
            source: "india",
            paint: {
              "line-color": "#d8c9a8",
              "line-width": ["interpolate", ["linear"], ["zoom"], 4, 0.45, 6, 1.05],
              "line-opacity": 0.55,
            },
          },
          {
            id: "state-hot",
            type: "line",
            source: "india",
            filter: ["==", ["get", "NAME_1"], ""],
            paint: {
              "line-color": "#f2e6cc",
              "line-width": ["interpolate", ["linear"], ["zoom"], 4, 1.4, 7, 2.6],
              "line-opacity": 1,
            },
          },
          {
            id: "state-labels",
            type: "symbol",
            source: "centers",
            minzoom: 4.6,
            layout: {
              "text-field": ["get", "NAME_1"],
              "text-font": ["Noto Sans Regular"],
              "text-size": ["interpolate", ["linear"], ["zoom"], 4.6, 10, 7, 13],
              "text-padding": 8,
              "text-letter-spacing": 0.03,
              "text-max-width": 8,
              "text-optional": true,
            },
            paint: {
              "text-color": "#efe4cc",
              "text-halo-color": "#0b100f",
              "text-halo-width": 1.2,
              "text-opacity": 0.88,
            },
          },
        ],
      },
      center: INDIA_CENTER,
      zoom: 4.15,
      minZoom: 3.4,
      maxZoom: 9.5,
      attributionControl: false,
    });

    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    map.addControl(
      new AttributionControl({
        compact: true,
        customAttribution: `${META.attribution.split(".")[0]} · mythyl.art`,
      }),
    );

    map.on("error", (event) => setMapError(event.error?.message ?? "Map failed to load"));
    map.on("load", () => {
      setMapError(null);
      map.getContainer().querySelector(".maplibregl-ctrl-bottom-left")?.remove();
      map.resize();
      map.fitBounds(INDIA_BOUNDS, { padding: INDIA_FIT_PADDING, duration: 0 });
    });

    map.on("mousemove", "india-fill", (event) => {
      const name = event.features?.[0]?.properties?.NAME_1 as string | undefined;
      if (!name) return;
      map.getCanvas().style.cursor = "pointer";
      const state = stateByGeo(name);
      if (state) setHovered(state);
      if (map.getLayer("state-hot")) {
        map.setFilter("state-hot", ["==", ["get", "NAME_1"], name]);
      }
    });
    map.on("mouseleave", "india-fill", () => {
      map.getCanvas().style.cursor = "";
      setHovered(null);
      if (map.getLayer("state-hot") && !selectedRef.current) {
        map.setFilter("state-hot", ["==", ["get", "NAME_1"], ""]);
      }
    });
    map.on("click", "india-fill", (event) => {
      const name = event.features?.[0]?.properties?.NAME_1 as string | undefined;
      if (!name) return;
      const state = stateByGeo(name);
      if (!state) return;
      setSelected(state);
      map.easeTo({
        center: [state.center.longitude, state.center.latitude],
        zoom: Math.max(map.getZoom(), 5.4),
        duration: 700,
        padding: { top: 28, bottom: 140, left: 28, right: 28 },
      });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => paintFill();
    if (map.loaded()) apply();
    else map.once("load", apply);
  }, [paintFill]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer("state-hot")) return;
    const name = selected?.geoName ?? hovered?.geoName ?? "";
    map.setFilter("state-hot", ["==", ["get", "NAME_1"], name]);
  }, [selected, hovered]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const marker of markersRef.current) marker.remove();
    markersRef.current = [];
    for (const event of visibleEvents) {
      const point = eventPoint(event);
      if (!point) continue;
      const el = document.createElement("button");
      el.type = "button";
      el.className = "state-event";
      el.dataset.scale = event.scale;
      el.dataset.kind = event.kind;
      el.title = `${event.name} · ${event.year}`;
      el.addEventListener("click", (click) => {
        click.stopPropagation();
        const host = event.states.includes("*")
          ? null
          : STATES.find((row) => event.states.includes(row.name) || event.states.includes(row.geoName));
        if (host) setSelected(host);
      });
      const marker = new Marker({ element: el, anchor: "center" }).setLngLat([point.longitude, point.latitude]).addTo(map);
      markersRef.current.push(marker);
    }
  }, [visibleEvents]);

  const focus = selected ?? hovered;
  const year = seriesYear(era);
  const imr = focus ? imrOf(focus, year) : null;
  const income = focus ? incomeOf(focus, year) : null;
  const spark = focus ? sparkImr(focus) : [];
  const incomeSpark = focus ? sparkIncome(focus) : [];
  const price = focus ? incomePrice(focus, year) : null;
  const politicsYear = year;
  const cm = focus ? cmAt(focus, politicsYear) : undefined;
  const focusEvents = focus ? eventsForState(focus) : [];

  return (
    <>
      <div className="map-stage">
        <header className="map-head">
          <div className="map-head-top">
            <p className="map-kicker">States · {YEAR_MIN}–{YEAR_MAX}</p>
            <h1>Income, survival, and power</h1>
            <em className="map-tools-count">
              {STATES.length} units · {visibleEvents.length} events
            </em>
          </div>
        </header>
        <div className="map-tools">
          <div className="map-tools-row">
            <div className="map-filters">
              <button type="button" className={metric === "survival" ? "on" : ""} onClick={() => setMetric("survival")}>
                Survival
              </button>
              <button type="button" className={metric === "income" ? "on" : ""} onClick={() => setMetric("income")}>
                Income
              </button>
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
          </div>
          <div className="map-tools-row">
            <p className="map-tools-label">Scale</p>
            <div className="map-filters">
              {SCALES.map((scale) => (
                <button
                  key={scale}
                  type="button"
                  className={enabledScales[scale] ? "on" : ""}
                  data-scale={scale}
                  onClick={() => setEnabledScales((current) => ({ ...current, [scale]: !current[scale] }))}
                >
                  <i className="map-key-ring" data-scale={scale} />
                  {SCALE_LABEL[scale]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="map-shell" id="map" data-atlas="states">
          <div className="map-canvas">
            <div
              ref={rootRef}
              className="states-map"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            />
            {mapError ? <p className="map-error">{mapError}</p> : null}
          </div>
          {focus && !selected ? (
            <div className="map-tip state-hover">
              <strong>{focus.name}</strong>
              <span>
                {imr != null ? `IMR ${imr}` : "no IMR"}
                {income != null ? ` · ${formatRupees(income)}` : ""}
              </span>
              <Sparkline points={spark} color="#e6c3b0" width={120} height={28} label="Infant mortality" />
            </div>
          ) : null}
          {selected ? (
            <article className="map-card" data-locked="true">
              <div className="map-strip-head">
                <div>
                  <p className="map-kicker">{selected.region.replace("-", " ")}</p>
                  <h2>{selected.name}</h2>
                </div>
                <button type="button" className="card-close" onClick={() => setSelected(null)}>
                  Close
                </button>
              </div>
              <div className="card-meta">
                {selected.formed ? <span>formed {selected.formed}</span> : null}
                {imr != null ? <span data-scale="state">IMR {formatImr(imr)}</span> : null}
                {income != null ? <span data-scale="union">{formatRupees(income)} / head</span> : null}
              </div>
              <div className="state-sparks">
                <div>
                  <p className="spark-label">Infant mortality</p>
                  <Sparkline points={spark} color="#e6c3b0" label="Infant mortality sparkline" />
                </div>
                <div>
                  <p className="spark-label">
                    {price === "2011-12" ? `NSDP / head · ${year} · 2011–12 prices` : `NSDP / head · ${year}`}
                  </p>
                  {incomeSpark.length > 1 ? (
                    <Sparkline points={incomeSpark} color="#e6d3a4" label="Per-capita NSDP sparkline" />
                  ) : income != null ? (
                    <p className="spark-figure">{formatRupees(income)}</p>
                  ) : (
                    <p className="spark-figure">—</p>
                  )}
                </div>
              </div>
              {selected.politics.length > 0 ? (
                <div className="party-strip" aria-label="Chief ministers">
                  {selected.politics.map((spell) => {
                    const end = spell.end ?? YEAR_MAX;
                    const width = Math.max(4, ((end - spell.start) / (YEAR_MAX - YEAR_MIN)) * 100);
                    return (
                      <i
                        key={`${spell.cm}-${spell.start}`}
                        title={`${spell.cm} · ${spell.party} · ${spell.start}${spell.end ? `–${spell.end}` : "–"}`}
                        style={{ width: `${width}%`, background: PARTY_COLOR[spell.partyFamily] }}
                      />
                    );
                  })}
                </div>
              ) : null}
              {cm ? (
                <p className="card-years">
                  {cm.cm} · {cm.party}
                  {politicsYear ? ` · around ${politicsYear}` : ""}
                </p>
              ) : null}
              {selected.note ? <p className="map-card-summary">{selected.note}</p> : null}
              {selected.split?.[0] ? (
                <p className="map-card-summary">
                  {selected.split[0].label} from {selected.split[0].from}
                  {selected.split[0].series[0]?.perCapitaRs
                    ? ` · ${formatRupees(selected.split[0].series[0].perCapitaRs)} / head`
                    : ""}
                </p>
              ) : null}
              {focusEvents.length > 0 ? (
                <ul className="map-card-sources">
                  {focusEvents.slice(0, 5).map((event) => (
                    <li key={event.id} className="map-card-source">
                      {event.year} · {event.name}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ) : null}
        </div>
      </div>
      <StatesTimeline
        events={EVENTS}
        union={UNION}
        era={era}
        selected={yearsSelected}
        state={selected}
        onSelect={(event) => {
          setYearsSelected(event);
        }}
        onClose={() => setYearsSelected(null)}
      />
    </>
  );
}
