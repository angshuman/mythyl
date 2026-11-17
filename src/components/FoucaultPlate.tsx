"use client";

import { useEffect, useId, useState } from "react";
import type { FoucaultMark, FoucaultTaxonomy } from "@/lib/foucault";

type Props = {
  data: FoucaultTaxonomy;
  showOrigin?: boolean;
};

export function FoucaultPlate({ data, showOrigin = true }: Props) {
  const trayId = useId();
  const [ready, setReady] = useState(false);
  const [hot, setHot] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const currentId = pinned ?? hot;
  let current: { category: string; mark: FoucaultMark } | null = null;
  for (const category of data.categories) {
    const mark = category.marks.find((item) => item.id === currentId);
    if (mark) {
      current = { category: category.title, mark };
      break;
    }
  }

  return (
    <section
      className="foucault-plate"
      data-ready={ready ? "true" : "false"}
      data-filled={current ? "true" : "false"}
      onMouseLeave={() => setHot(null)}
    >
      {showOrigin ? (
        <div className="foucault-origin">
          <span className="foucault-bindu" aria-hidden="true" />
          <p className="foucault-span">{data.span}</p>
          <h1 className="foucault-thesis">{data.origin}</h1>
        </div>
      ) : (
        <h2 className="foucault-list-head">The same split, as a list</h2>
      )}

      <div className="foucault-fork" data-plain={showOrigin ? "false" : "true"} aria-hidden="true">
        <span className="foucault-stem" />
        <span className="foucault-bar" />
      </div>

      <div className="foucault-grid">
        {data.categories.map((category, col) => {
          const colHot = category.marks.some((mark) => mark.id === currentId);
          return (
            <article
              key={category.id}
              className="foucault-col"
              data-hot={colHot ? "true" : "false"}
            >
              <h2 className="foucault-cat">{category.title}</h2>
              <ul className="foucault-list">
                {category.marks.map((mark, row) => {
                  const isHot = mark.id === currentId;
                  const delay = 0.38 + col * 0.055 + row * 0.045;
                  return (
                    <li key={mark.id}>
                      <button
                        type="button"
                        className="foucault-mark"
                        data-hot={isHot ? "true" : "false"}
                        aria-pressed={pinned === mark.id}
                        aria-describedby={trayId}
                        style={{ transitionDelay: `${delay}s` }}
                        onMouseEnter={() => setHot(mark.id)}
                        onFocus={() => setHot(mark.id)}
                        onClick={() =>
                          setPinned((prev) => (prev === mark.id ? null : mark.id))
                        }
                      >
                        <span className="foucault-tick" aria-hidden="true" />
                        <span className="foucault-line">{mark.line}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </article>
          );
        })}
      </div>

      <aside
        className="foucault-tray"
        id={trayId}
        data-filled={current ? "true" : "false"}
        aria-live="polite"
      >
        {current ? (
          <>
            <p className="foucault-tray-cat">{current.category}</p>
            <p className="foucault-tray-line">{current.mark.line}</p>
            <p className="foucault-tray-gloss">{current.mark.gloss}</p>
            <p className="foucault-tray-source">{current.mark.source}</p>
          </>
        ) : (
          <p className="foucault-tray-empty">Hover a mark. The point splits.</p>
        )}
      </aside>
    </section>
  );
}
