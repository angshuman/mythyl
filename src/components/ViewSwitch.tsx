"use client";

import { useEffect, useState } from "react";

type View = "map" | "years";

export function ViewSwitch() {
  const [at, setAt] = useState<View>("map");

  useEffect(() => {
    let io: IntersectionObserver | null = null;
    let tries = 0;
    const timer = window.setInterval(() => {
      const map = document.getElementById("map");
      const years = document.getElementById("years");
      tries += 1;
      if (!map || !years) {
        if (tries > 40) window.clearInterval(timer);
        return;
      }
      window.clearInterval(timer);
      io = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!visible?.target.id) return;
          setAt(visible.target.id === "years" ? "years" : "map");
        },
        { threshold: [0.12, 0.35, 0.6], rootMargin: "-10% 0px -50% 0px" },
      );
      io.observe(map);
      io.observe(years);
    }, 50);
    return () => {
      window.clearInterval(timer);
      io?.disconnect();
    };
  }, []);

  return (
    <nav className="view-switch" aria-label="Map or years">
      <a href="#map" className={at === "map" ? "on" : ""}>
        Map
      </a>
      <a href="#years" className={at === "years" ? "on" : ""}>
        Years
      </a>
    </nav>
  );
}
