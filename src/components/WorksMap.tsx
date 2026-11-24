"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AttributionControl,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  setWorkerUrl,
  type GeoJSONSource,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

if (typeof window !== "undefined") {
  setWorkerUrl(`${window.location.origin}/maplibre/maplibre-gl-worker.mjs`);
}

import {
  ERAS,
  KINDS,
  META,
  PROJECTS,
  SCALE_LABEL,
  SCALE_SIZE,
  YEAR_MAX,
  YEAR_MIN,
  formatYears,
  inEra,
  kindColor,
  kindOf,
  type WorkEra,
  type WorkKind,
  type WorkProject,
  type WorkScale,
} from "@/lib/works";
import { INDIA_BOUNDS, INDIA_CENTER, INDIA_FIT_PADDING } from "@/lib/geo";
import { workGlyphSvg } from "./workGlyph";
import { WorksTimeline } from "./WorksTimeline";

const SCALES: WorkScale[] = ["landmark", "trunk", "civic"];

function corridorsGeo(projects: WorkProject[]) {
  return {
    type: "FeatureCollection" as const,
    features: projects
      .filter((project) => project.path && project.path.length > 1)
      .map((project) => ({
        type: "Feature" as const,
        properties: { id: project.id, kind: project.kind, color: kindColor(project.kind) },
        geometry: {
          type: "LineString" as const,
          coordinates: project.path!.map((p) => [p.longitude, p.latitude]),
        },
      })),
  };
}

export function WorksMap() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const dashRef = useRef(0);
  const [era, setEra] = useState<WorkEra>(ERAS[0]);
  const [enabledScales, setEnabledScales] = useState<Record<WorkScale, boolean>>({
    landmark: true,
    trunk: true,
    civic: true,
  });
  const [enabledKinds, setEnabledKinds] = useState<Record<WorkKind, boolean>>(
    Object.fromEntries(KINDS.map((kind) => [kind.id, true])) as Record<WorkKind, boolean>,
  );
  const [selected, setSelected] = useState<WorkProject | null>(null);
  const [hovered, setHovered] = useState<WorkProject | null>(null);
  const [yearsSelected, setYearsSelected] = useState<WorkProject | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const kindsAllOn = KINDS.every((kind) => enabledKinds[kind.id]);

  const visible = useMemo(() => {
    return PROJECTS.filter(
      (project) => enabledScales[project.scale] && enabledKinds[project.kind] && inEra(project, era),
    );
  }, [enabledScales, enabledKinds, era]);

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
          corridors: { type: "geojson", data: corridorsGeo(PROJECTS) },
        },
        layers: [
          { id: "background", type: "background", paint: { "background-color": "#0c0e12" } },
          {
            id: "india-fill",
            type: "fill",
            source: "india",
            paint: { "fill-color": "#1a2230", "fill-opacity": 1 },
          },
          {
            id: "india-line",
            type: "line",
            source: "india",
            paint: {
              "line-color": "#8fa0b8",
              "line-width": ["interpolate", ["linear"], ["zoom"], 4, 0.4, 7, 1.1],
              "line-opacity": 0.45,
            },
          },
          {
            id: "corridor-glow",
            type: "line",
            source: "corridors",
            paint: {
              "line-color": "#c9a227",
              "line-width": 6.5,
              "line-opacity": 0.16,
              "line-blur": 1.4,
            },
          },
          {
            id: "corridor-line",
            type: "line",
            source: "corridors",
            paint: {
              "line-color": "#e3c37a",
              "line-width": ["interpolate", ["linear"], ["zoom"], 4, 1.4, 7, 2.6],
              "line-dasharray": [0, 2, 2],
              "line-opacity": 0.92,
            },
          },
          {
            id: "state-labels",
            type: "symbol",
            source: "india",
            minzoom: 5.6,
            layout: {
              "text-field": ["get", "NAME_1"],
              "text-font": ["Noto Sans Regular"],
              "text-size": 11,
              "text-padding": 12,
              "text-max-width": 8,
              "text-optional": true,
            },
            paint: {
              "text-color": "#c9d4e4",
              "text-halo-color": "#0c0e12",
              "text-halo-width": 1.1,
              "text-opacity": 0.7,
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
    map.on("error", (event) => setMapError(event.error?.message ?? "Map failed to load"));
    map.on("load", () => {
      setMapError(null);
      map.getContainer().querySelector(".maplibregl-ctrl-bottom-left")?.remove();
      map.resize();
      map.fitBounds(INDIA_BOUNDS, { padding: INDIA_FIT_PADDING, duration: 0 });
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const tick = () => {
      if (!mapRef.current?.getLayer("corridor-line") || reduce) return;
      dashRef.current = (dashRef.current + 0.08) % 4;
      const offset = dashRef.current;
      map.setPaintProperty("corridor-line", "line-dasharray", [offset, 1.6, 1.6]);
      frame = requestAnimationFrame(tick);
    };
    if (!reduce) frame = requestAnimationFrame(tick);

    const resize = () => map.resize();
    window.addEventListener("resize", resize);
    const observer = new ResizeObserver(resize);
    observer.observe(rootRef.current);
    requestAnimationFrame(resize);
    mapRef.current = map;
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const source = map.getSource("corridors") as GeoJSONSource | undefined;
    source?.setData(corridorsGeo(visible));
  }, [visible]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const marker of markersRef.current) marker.remove();
    markersRef.current = [];
    visible.forEach((project, index) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "work-mark";
      el.dataset.kind = project.kind;
      el.dataset.scale = project.scale;
      el.dataset.status = project.status;
      el.style.setProperty("--dot", kindColor(project.kind));
      el.style.setProperty("--pop-delay", `${Math.min(index * 0.018, 1.2)}s`);
      el.innerHTML = workGlyphSvg(project.kind, "#f4ead4", SCALE_SIZE[project.scale]);
      el.title = `${project.name} · ${formatYears(project)}`;
      el.addEventListener("mouseenter", () => setHovered(project));
      el.addEventListener("mouseleave", () => setHovered((current) => (current?.id === project.id ? null : current)));
      el.addEventListener("click", (click) => {
        click.stopPropagation();
        setSelected(project);
        map.easeTo({
          center: [project.place.longitude, project.place.latitude],
          zoom: Math.max(map.getZoom(), project.path ? 4.8 : 5.8),
          duration: 700,
          padding: { top: 28, bottom: 140, left: 28, right: 28 },
        });
      });
      const marker = new Marker({ element: el, anchor: "center" })
        .setLngLat([project.place.longitude, project.place.latitude])
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [visible]);

  function isolateKind(id: WorkKind) {
    const onlyThis = KINDS.every((kind) => enabledKinds[kind.id] === (kind.id === id));
    if (onlyThis) {
      setEnabledKinds(Object.fromEntries(KINDS.map((kind) => [kind.id, true])) as Record<WorkKind, boolean>);
      return;
    }
    setEnabledKinds(Object.fromEntries(KINDS.map((kind) => [kind.id, kind.id === id])) as Record<WorkKind, boolean>);
  }

  const focus = selected ?? hovered;
  const kind = focus ? kindOf(focus) : null;

  return (
    <>
      <div className="map-stage">
        <header className="map-head">
          <div className="map-head-top">
            <p className="map-kicker">Public works · {YEAR_MIN}–{YEAR_MAX}</p>
            <h1>Public works in India, 1947–now</h1>
            <em className="map-tools-count">{visible.length} projects</em>
          </div>
        </header>
        <div className="map-tools">
          <div className="map-tools-row">
            <div className="map-key">
              <span className="map-key-item">
                <i className="map-key-ring" data-scale="landmark" />
                landmark
              </span>
              <span className="map-key-item">
                <i className="map-key-ring" data-scale="trunk" />
                trunk
              </span>
              <span className="map-key-item">
                <i className="map-key-ring" data-scale="civic" />
                civic
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
                  onClick={() => setEnabledScales((current) => ({ ...current, [scale]: !current[scale] }))}
                >
                  {SCALE_LABEL[scale]}
                </button>
              ))}
            </div>
          </div>
          <div className="map-tools-row">
            <div className="map-filters map-legend">
              <button
                type="button"
                className={kindsAllOn ? "on" : ""}
                onClick={() =>
                  setEnabledKinds(Object.fromEntries(KINDS.map((kind) => [kind.id, true])) as Record<WorkKind, boolean>)
                }
              >
                All kinds
              </button>
              {KINDS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={enabledKinds[item.id] ? "on" : ""}
                  onClick={() => isolateKind(item.id)}
                >
                  <i className="swatch" style={{ background: item.color }} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="map-shell" id="map" data-atlas="works">
          <div className="map-canvas">
            <div
              ref={rootRef}
              className="works-map"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            />
            {mapError ? <p className="map-error">{mapError}</p> : null}
          </div>
          {focus && !selected ? (
            <p className="map-tip">
              {focus.name} · {formatYears(focus)} · {kind?.label}
            </p>
          ) : null}
          {selected ? (
            <article className="map-card" data-locked="true">
              <div className="map-strip-head">
                <div>
                  <p className="map-kicker">
                    {kind?.label} · {SCALE_LABEL[selected.scale]}
                  </p>
                  <h2>{selected.name}</h2>
                </div>
                <button type="button" className="card-close" onClick={() => setSelected(null)}>
                  Close
                </button>
              </div>
              <div className="card-meta">
                <span data-scale={selected.scale}>{selected.scale}</span>
                <span>{formatYears(selected)}</span>
                <span>{selected.status}</span>
                <span>{selected.place.label}</span>
              </div>
              <p className="map-card-summary">{selected.summary}</p>
              {selected.displacement ? (
                <p className="map-card-summary">{selected.displacement.note}</p>
              ) : null}
              <ul className="map-card-sources">
                {selected.sources.map((source) => (
                  <li key={source.url} className="map-card-source">
                    <a className="map-card-source-link" href={source.url} target="_blank" rel="noreferrer">
                      {source.title} →
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
        </div>
      </div>
      <WorksTimeline
        projects={PROJECTS.filter((project) => enabledScales[project.scale] && enabledKinds[project.kind])}
        era={era}
        selected={yearsSelected}
        hovered={hovered}
        onHover={setHovered}
        onSelect={(project) => {
          setYearsSelected(project);
          const map = mapRef.current;
          map?.easeTo({
            center: [project.place.longitude, project.place.latitude],
            zoom: Math.max(map.getZoom(), 5.4),
            duration: 700,
            padding: { top: 28, bottom: 80, left: 28, right: 28 },
          });
        }}
        onClose={() => setYearsSelected(null)}
        onFocusKind={isolateKind}
      />
    </>
  );
}
