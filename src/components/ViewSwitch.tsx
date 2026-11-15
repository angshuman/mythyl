"use client";

import { useEffect, useRef, useState } from "react";

type View = "map" | "years" | "essays";

export function ViewSwitch() {
  const [at, setAt] = useState<View>("map");
  const pinUntil = useRef(0);

  useEffect(() => {
    let io: IntersectionObserver | null = null;
    let tries = 0;
    const timer = window.setInterval(() => {
      const map = document.getElementById("map");
      const years = document.getElementById("years");
      const essays = document.getElementById("essays");
      tries += 1;
      if (!map || !years || !essays) {
        if (tries > 40) window.clearInterval(timer);
        return;
      }
      window.clearInterval(timer);
      io = new IntersectionObserver(
        (entries) => {
          if (Date.now() < pinUntil.current) return;
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!visible?.target.id) return;
          const id = visible.target.id;
          setAt(id === "years" ? "years" : id === "essays" ? "essays" : "map");
        },
        { threshold: [0.08, 0.25, 0.5], rootMargin: "-10% 0px -45% 0px" },
      );
      io.observe(map);
      io.observe(years);
      io.observe(essays);
    }, 50);
    return () => {
      window.clearInterval(timer);
      io?.disconnect();
    };
  }, []);

  function jump(view: View) {
    setAt(view);
    pinUntil.current = Date.now() + 900;
  }

  return (
    <nav className="view-switch" aria-label="On this page">
      <a href="#map" className={at === "map" ? "on" : ""} onClick={() => jump("map")}>
        Map
      </a>
      <a href="#years" className={at === "years" ? "on" : ""} onClick={() => jump("years")}>
        Years
      </a>
      <a href="#essays" className={at === "essays" ? "on" : ""} onClick={() => jump("essays")}>
        Essays
      </a>
    </nav>
  );
}
