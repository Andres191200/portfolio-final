// Hand-drawn pencil strokes: each stroke is a filled outline with variable width
// and a wobbly centerline, never a uniform `stroke`. Seeded so SSR and client match.

export type Point = [number, number];
export type Curve = [Point, Point, Point, Point];

type StrokeOptions = {
  width: number;
  seed: number;
  samples?: number;
  wobble?: number;
};

export type PencilStroke = {
  outline: string;
  // Centerline, kept for the future mask-based draw-on animation
  center: string;
};

const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const bezier = ([p0, p1, p2, p3]: Curve, t: number): Point => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ];
};

const fmt = ([x, y]: Point) => `${x.toFixed(1)} ${y.toFixed(1)}`;

export const pencilStroke = (
  curve: Curve,
  { width, seed, samples = 36, wobble = 1.4 }: StrokeOptions
): PencilStroke => {
  const rand = mulberry32(seed);
  // Low-frequency hand tremor plus per-point jitter
  const phaseA = rand() * Math.PI * 2;
  const phaseB = rand() * Math.PI * 2;
  const freqA = 3 + rand() * 3;
  const freqB = 9 + rand() * 6;

  const center: Point[] = [];
  const left: Point[] = [];
  const right: Point[] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const [x, y] = bezier(curve, t);
    const [nx0, ny0] = bezier(curve, Math.min(1, t + 0.01));
    const [px0, py0] = bezier(curve, Math.max(0, t - 0.01));
    const dx = nx0 - px0;
    const dy = ny0 - py0;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    const tremor =
      wobble *
      (Math.sin(t * Math.PI * freqA + phaseA) * 0.7 +
        Math.sin(t * Math.PI * freqB + phaseB) * 0.3 +
        (rand() - 0.5) * 0.6);
    const cx = x + nx * tremor;
    const cy = y + ny * tremor;
    center.push([cx, cy]);

    // Pressure: thin at both ends, heavier near the start like a real hand
    const pressure = Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.15)), 0.55);
    const half = (width / 2) * (0.18 + 0.82 * pressure) * (0.82 + rand() * 0.36);
    left.push([cx + nx * half, cy + ny * half]);
    right.push([cx - nx * half, cy - ny * half]);
  }

  const outline = `M${[...left, ...right.reverse()].map(fmt).join(" L")} Z`;
  return { outline, center: `M${center.map(fmt).join(" L")}` };
};

const rotate = ([x, y]: Point, angle: number): Point => [
  x * Math.cos(angle) - y * Math.sin(angle),
  x * Math.sin(angle) + y * Math.cos(angle),
];

// Straight-ish stroke between two points with a slight hand-drawn bow
export const pencilLine = (
  from: Point,
  to: Point,
  options: StrokeOptions & { bow?: number }
) => {
  const { bow = 0.06 } = options;
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const nx = -dy * bow;
  const ny = dx * bow;
  return pencilStroke(
    [
      from,
      [from[0] + dx / 3 + nx, from[1] + dy / 3 + ny],
      [from[0] + (dx * 2) / 3 + nx, from[1] + (dy * 2) / 3 + ny],
      to,
    ],
    options
  );
};

// Shaft plus two separate head strokes, drawn outward from the tip like a hand would
export const pencilArrow = (
  shaft: Curve,
  { width, seed, headLength = 30 }: { width: number; seed: number; headLength?: number }
) => {
  const tip = shaft[3];
  const ctrl = shaft[2];
  const back = Math.hypot(ctrl[0] - tip[0], ctrl[1] - tip[1]) || 1;
  const dir: Point = [(ctrl[0] - tip[0]) / back, (ctrl[1] - tip[1]) / back];

  const barb = (angle: number, s: number) => {
    const [bx, by] = rotate(dir, angle);
    return pencilLine(tip, [tip[0] + bx * headLength, tip[1] + by * headLength], {
      width: width * 0.85,
      seed: s,
      samples: 14,
      wobble: 0.5,
      bow: angle > 0 ? 0.04 : -0.04,
    });
  };

  return {
    shaft: pencilStroke(shaft, { width, seed }),
    head: [barb(0.5, seed + 11), barb(-0.46, seed + 23)],
  };
};
