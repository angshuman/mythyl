"use client";

import dynamic from "next/dynamic";

export const RajMapLoader = dynamic(
  () => import("./RajMap").then((mod) => mod.RajMap),
  {
    ssr: false,
    loading: () => <div className="map-shell" id="map" data-atlas="raj" />,
  },
);
