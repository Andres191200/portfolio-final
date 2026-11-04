import type { CSSProperties } from "react";
import styles from "./Hero.module.scss";
import { pencilArrow, type Curve } from "./pencil";

// Coordinates live in the browser window's 2:1 box (1000 × 500) and overflow outside it.
// Each stroke is a variable-width outline revealed by a mask that follows its
// centerline, so the arrow is drawn like handwriting instead of popping in.
type Label = {
  text: string;
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
  valign: "top" | "bottom";
  rotate: number;
};

type Arrow = { shaft: Curve; label: Label; seed: number };

type Layout = { name: string; stroke: number; head: number; arrows: Arrow[] };

const wide: Layout = {
  name: "wide",
  stroke: 4.2,
  head: 30,
  arrows: [
    {
      shaft: [[0, 70], [-60, 72], [-118, 55], [-140, 15]],
      label: { text: "Cleaner", x: -190, y: -4, anchor: "middle", valign: "bottom", rotate: -6 },
      seed: 7,
    },
    {
      shaft: [[1000, 98], [1040, 98], [1070, 80], [1088, 46]],
      label: { text: "More intuitive", x: 1080, y: 26, anchor: "start", valign: "bottom", rotate: -6 },
      seed: 19,
    },
    {
      shaft: [[1000, 455], [1045, 452], [1080, 478], [1092, 522]],
      label: { text: "Built with purpose", x: 1086, y: 532, anchor: "start", valign: "top", rotate: -7 },
      seed: 31,
    },
  ],
};

// Phones: no room at the sides, so the arrows leave through the top and bottom edges
const narrow: Layout = {
  name: "narrow",
  stroke: 9,
  head: 48,
  arrows: [
    {
      shaft: [[100, 0], [95, -40], [75, -80], [70, -112]],
      label: { text: "Cleaner", x: 20, y: -128, anchor: "start", valign: "bottom", rotate: -6 },
      seed: 7,
    },
    {
      shaft: [[900, 0], [905, -40], [925, -80], [930, -112]],
      label: { text: "More intuitive", x: 1000, y: -128, anchor: "end", valign: "bottom", rotate: -6 },
      seed: 19,
    },
    {
      shaft: [[880, 500], [885, 540], [905, 580], [920, 614]],
      label: { text: "Built with purpose", x: 1000, y: 640, anchor: "end", valign: "top", rotate: -5 },
      seed: 31,
    },
  ],
};

const anchorShift = { start: "0%", middle: "-50%", end: "-100%" };

const build = (layout: Layout) =>
  layout.arrows.map((arrow) => {
    const { shaft, head } = pencilArrow(arrow.shaft, {
      width: layout.stroke,
      seed: arrow.seed,
      headLength: layout.head,
    });
    return { ...arrow, strokes: [shaft, ...head] };
  });

const layouts = [
  { ...wide, className: styles.arrowsWide, built: build(wide) },
  { ...narrow, className: styles.arrowsNarrow, built: build(narrow) },
];

const HeroArrows = () => (
  <>
    {layouts.map((layout) => (
      <div key={layout.name} className={`${styles.arrows} ${layout.className}`} aria-hidden="true">
        <svg viewBox="0 0 1000 500" className={styles.arrowsSvg}>
          {layout.built.map((arrow, i) => (
            <g key={i} data-arrow={i}>
              {arrow.strokes.map((stroke, j) => {
                const id = `hero-arrow-${layout.name}-${i}-${j}`;
                return (
                  <g key={j}>
                    <mask id={id} maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="5000" height="5000">
                      <path
                        d={stroke.center}
                        data-draw={j === 0 ? "shaft" : "head"}
                        className={styles.drawMask}
                        strokeWidth={layout.stroke * 3}
                        pathLength={1}
                      />
                    </mask>
                    <path d={stroke.outline} mask={`url(#${id})`} className={styles.arrowInk} />
                  </g>
                );
              })}
            </g>
          ))}
        </svg>

        {layout.built.map(({ label }, i) => (
          <span
            key={i}
            data-arrow-label={i}
            className={styles.arrowLabel}
            style={
              {
                left: `${label.x / 10}%`,
                top: `${label.y / 5}%`,
                transform: `translate(${anchorShift[label.anchor]}, ${label.valign === "bottom" ? "-100%" : "0%"}) rotate(${label.rotate}deg)`,
              } as CSSProperties
            }
          >
            {label.text}
          </span>
        ))}
      </div>
    ))}
  </>
);

export default HeroArrows;
