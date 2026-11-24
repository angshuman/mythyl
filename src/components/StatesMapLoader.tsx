"use client";

import dynamic from "next/dynamic";

export const StatesMapLoader = dynamic(
  () => import("./StatesMap").then((mod) => mod.StatesMap),
  {
    ssr: false,
    loading: () => <div className="map-shell" id="map" data-atlas="states" />,
  },
);
