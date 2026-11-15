"use client";

import dynamic from "next/dynamic";

export const ConflictMapLoader = dynamic(
  () => import("./ConflictMap").then((mod) => mod.ConflictMap),
  {
    ssr: false,
    loading: () => <div className="map-shell" />,
  },
);
