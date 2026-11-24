"use client";

import dynamic from "next/dynamic";

export const WorksMapLoader = dynamic(
  () => import("./WorksMap").then((mod) => mod.WorksMap),
  {
    ssr: false,
    loading: () => <div className="map-shell" id="map" data-atlas="works" />,
  },
);
