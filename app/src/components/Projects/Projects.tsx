"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../../data/projects";
import { display } from "../../styles/fonts";
import ProjectPreview from "./ProjectPreview";
import styles from "./Projects.module.scss";

gsap.registerPlugin(ScrollTrigger);

// The deck only runs when a whole card and the final grid fit comfortably on screen;
// everywhere else the static grid is the experience
const DECK_QUERY =
  "(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)";

// The timeline is 100 units long: one unit per percent of the section's scroll
const SWAPS = [12, 30, 48]; // each one sends the front card away and brings the next
const SWAP = 16;
const FADE_OUT = 78; // card text steps aside before the layout changes
const LAYOUT = 82; // deck becomes grid
const SETTLE = 11;
const FADE_IN = 90;
// Scroll progress where each project rests, and where the grid is complete
const STOPS = [0.05, 0.29, 0.47, 0.72];
const GRID_STOP = 1;
const RADIUS = 20;

type Box = { x: number; y: number; w: number; h: number };

// Layout box relative to an ancestor, unaffected by transforms on the way
const box = (el: HTMLElement, base: HTMLElement): Box => {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== base) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
};

const scrollParent = (el: HTMLElement): HTMLElement | null => {
  for (let node = el.parentElement; node; node = node.parentElement) {
    if (/(auto|scroll)/.test(getComputedStyle(node).overflowY)) return node;
  }
  return null;
};

const pad = (i: number) => String(i + 1).padStart(2, "0");

const Projects = () => {
  const rootRef = useRef<HTMLElement>(null);
  const navigateRef = useRef<(target: number | "all") => void>(() => {});
  // -1: no single project in focus (static layout or the final grid)
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const area = q("[data-cards]")[0] as HTMLElement;
    const cards = q("[data-card]") as HTMLElement[];
    const scroller = scrollParent(root);
    const viewport = () => scroller?.clientHeight ?? window.innerHeight;
    const media = window.matchMedia(DECK_QUERY);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let ctx: gsap.Context | null = null;
    let trigger: ScrollTrigger | null = null;
    let current = -2;

    const focus = (index: number, deck: boolean) => {
      if (index === current) return;
      current = index;
      setActive(index);
      cards.forEach((card, i) => {
        // Cards waiting in the deck can't be clicked or tabbed into
        card.inert = deck && index >= 0 && i !== index;
        card.toggleAttribute("data-active", deck && i === index);
      });
    };

    const progressToProject = (progress: number) => {
      const at = progress * 100;
      if (at >= LAYOUT) return -1;
      return SWAPS.filter((start) => at >= start + SWAP * 0.55).length;
    };

    const buildDeck = () => {
      const surfaces = cards.map((c) => c.querySelector("[data-surface]") as HTMLElement);
      const previews = cards.map((c) => c.querySelector("[data-preview]") as HTMLElement);
      const mediaEls = cards.map((c) => c.querySelector("[data-media]") as HTMLElement);
      const peeks = cards.map((c) => c.querySelector("[data-peek]") as HTMLElement);
      const articles = cards.map((c) => c.querySelector("article") as HTMLElement);
      const last = cards.length - 1;

      // Measure both layouts once; every motion below is a transform between them
      area.dataset.layout = "grid";
      const grid = cards.map((c, i) => ({ card: box(c, area), preview: box(previews[i], c) }));
      area.dataset.layout = "deck";
      const deck = cards.map((c, i) => ({ card: box(c, area), preview: box(previews[i], c) }));
      const width = deck[0].card.w;

      // depth 0 is the front card, positive depths wait behind it, negative ones were seen.
      // Seen cards dim their content, not the card, so stacked cards never show through.
      const pose = (depth: number) => {
        if (depth >= 0) {
          return { x: depth * 56, y: -depth * 10, rotation: depth * 2.4, dim: 1 };
        }
        const t = -depth - 1;
        return { x: -width * 0.72 - t * 40, y: -32 - t * 12, rotation: -6 - t * 1.5, dim: 0.4 - t * 0.1 };
      };
      // Front card on top, then the ones waiting, then the ones already seen
      const layer = (depth: number) => (depth >= 0 ? 20 - depth : 9 + depth);

      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      const move = (i: number, depth: number, vars: gsap.TweenVars, at: number) => {
        const { dim, ...transform } = pose(depth);
        tl.to(cards[i], { ...transform, ...vars }, at);
        tl.to(articles[i], { opacity: dim, ...vars }, at);
      };
      cards.forEach((card, i) => {
        const { dim, ...transform } = pose(i);
        gsap.set(card, { ...transform, zIndex: layer(i) });
        gsap.set(articles[i], { opacity: dim });
        gsap.set(peeks[i], { opacity: i === 0 ? 0 : 1 });
      });
      tl.to(q("[data-hint]"), { opacity: 0, duration: 5 }, 0);

      SWAPS.forEach((start, s) => {
        cards.forEach((card, i) => {
          const before = i - s;
          const after = before - 1;
          const swapAt = start + SWAP * 0.55;
          if (before === 0) {
            // Pulled clear of the deck first, so it can tuck behind the next card
            // without ever crossing it
            const leg = { duration: SWAP * 0.55, ease: "power1.inOut" };
            tl.to(card, { x: -width * 1.08, y: -48, rotation: -8, ...leg }, start);
            tl.to(articles[i], { opacity: 0.6, ...leg }, start);
            move(i, after, { duration: SWAP * 0.45, ease: "power1.inOut" }, swapAt);
          } else if (before === 1) {
            move(i, after, { duration: SWAP * 0.7, ease: "power2.inOut" }, start + SWAP * 0.3);
            // Its own header takes over from the edge number
            tl.to(peeks[i], { opacity: 0, duration: SWAP * 0.2 }, start);
          } else {
            move(i, after, { duration: SWAP * 0.8, ease: "power2.inOut" }, start + SWAP * 0.2);
          }
          tl.set(card, { zIndex: layer(after) }, swapAt);
        });
      });

      // Deck → grid: text steps aside, the boxes travel to their grid cells, text returns
      const fades = q("[data-fade]");
      tl.to(fades, { opacity: 0, y: -6, duration: LAYOUT - FADE_OUT, ease: "power1.out" }, FADE_OUT);
      tl.set(area, { attr: { "data-layout": "grid" } }, LAYOUT);
      cards.forEach((card, i) => {
        const d = deck[i];
        const g = grid[i];
        const from = pose(i - last);
        const sx = d.card.w / g.card.w;
        const sy = d.card.h / g.card.h;
        const px = d.preview.w / g.preview.w;
        const py = d.preview.h / g.preview.h;
        const uniform = Math.max(px, py);
        const settle = { duration: SETTLE, ease: "power2.inOut" };

        tl.set(
          card,
          {
            x: d.card.x + d.card.w / 2 + from.x - (g.card.x + g.card.w / 2),
            y: d.card.y + d.card.h / 2 + from.y - (g.card.y + g.card.h / 2),
          },
          LAYOUT
        );
        // Only the empty surface stretches; radius is corrected so corners stay round
        tl.set(surfaces[i], { scaleX: sx, scaleY: sy, borderRadius: `${RADIUS / sx}px / ${RADIUS / sy}px` }, LAYOUT);
        tl.set(
          previews[i],
          {
            x: d.preview.x + d.preview.w / 2 - d.card.w / 2 - (g.preview.x + g.preview.w / 2 - g.card.w / 2),
            y: d.preview.y + d.preview.h / 2 - d.card.h / 2 - (g.preview.y + g.preview.h / 2 - g.card.h / 2),
            scaleX: px,
            scaleY: py,
          },
          LAYOUT
        );
        // Counter-scale the artwork so the frame reshapes without stretching the image
        tl.set(mediaEls[i], { scaleX: uniform / px, scaleY: uniform / py }, LAYOUT);

        tl.to(card, { x: 0, y: 0, rotation: 0, ...settle }, LAYOUT);
        tl.to(articles[i], { opacity: 1, ...settle }, LAYOUT);
        tl.to(surfaces[i], { scaleX: 1, scaleY: 1, borderRadius: `${RADIUS}px / ${RADIUS}px`, ...settle }, LAYOUT);
        tl.to(previews[i], { x: 0, y: 0, scaleX: 1, scaleY: 1, ...settle }, LAYOUT);
        tl.to(mediaEls[i], { scaleX: 1, scaleY: 1, ...settle }, LAYOUT);
      });
      tl.to(fades, { opacity: 1, y: 0, duration: 5, ease: "power2.out", stagger: 0.4 }, FADE_IN);
      tl.set({}, {}, 100);

      trigger = ScrollTrigger.create({
        trigger: root,
        scroller: scroller ?? undefined,
        start: () => root.offsetTop,
        end: () => root.offsetTop + root.offsetHeight - viewport(),
        animation: tl,
        scrub: 0.5,
        onUpdate: (self) => focus(progressToProject(self.progress), true),
      });
      // Land on the current scroll position without scrubbing through from zero
      tl.progress(trigger.progress);
      focus(progressToProject(trigger.progress), true);
    };

    const build = () => {
      ctx?.revert();
      trigger = null;
      current = -2;
      const deck = media.matches;
      root.dataset.mode = deck ? "deck" : "static";
      if (!deck) {
        delete area.dataset.layout;
        focus(-1, false);
        return;
      }
      ctx = gsap.context(buildDeck, root);
    };

    let pending = 0;
    const schedule = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(build);
    };

    navigateRef.current = (target) => {
      if (trigger) {
        const progress = target === "all" ? GRID_STOP : STOPS[target];
        const top = trigger.start + (trigger.end - trigger.start) * progress;
        if (scroller) scroller.scrollTop = top;
        else window.scrollTo({ top });
        focus(progressToProject(progress), true);
        return;
      }
      const el = target === "all" ? area : cards[target];
      el.scrollIntoView({ block: "start", behavior: reduced.matches ? "auto" : "smooth" });
    };

    build();
    let alive = true;
    document.fonts?.ready.then(() => alive && schedule());
    const resize = new ResizeObserver(schedule);
    resize.observe(scroller ?? document.documentElement);
    media.addEventListener("change", schedule);
    // Late images can change line heights around them
    root.addEventListener("load", schedule, true);

    return () => {
      alive = false;
      cancelAnimationFrame(pending);
      resize.disconnect();
      media.removeEventListener("change", schedule);
      root.removeEventListener("load", schedule, true);
      ctx?.revert();
      delete root.dataset.mode;
      delete area.dataset.layout;
      cards.forEach((card) => {
        card.inert = false;
        card.removeAttribute("data-active");
      });
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="projects"
      className={`${styles.projects} ${display.variable}`}
      aria-labelledby="projects-heading"
    >
      <div className={styles.stage}>
        <div className={styles.glow} aria-hidden="true" />

        <header className={styles.header}>
          <div>
            <h2 id="projects-heading" className={styles.title}>
              Selected work.
            </h2>
            <p className={styles.subtitle}>Ideas turned into real products.</p>
          </div>
          <p className={styles.count}>
            <strong>{String(projects.length).padStart(2, "0")}</strong> projects
          </p>
        </header>

        <nav className={styles.navRow} aria-label="Projects">
          <ul className={styles.controls}>
            {projects.map((project, i) => (
              <li key={project.id}>
                <button
                  type="button"
                  className={styles.control}
                  aria-current={active === i ? "true" : undefined}
                  onClick={() => navigateRef.current(i)}
                >
                  <span className={styles.controlNumber}>{pad(i)}</span>
                  {project.name}
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className={styles.viewAll} onClick={() => navigateRef.current("all")}>
            View all projects
          </button>
        </nav>

        <ul className={styles.cards} data-cards>
          {projects.map((project, i) => (
            <li key={project.id} className={styles.card} data-card data-device={project.device}>
              <div className={styles.surface} data-surface aria-hidden="true" />
              <span className={styles.peek} data-peek aria-hidden="true">
                {pad(i)}
              </span>
              <article className={styles.article} aria-labelledby={`${project.id}-name`}>
                <header className={styles.cardHeader} data-fade>
                  <span className={styles.number}>{pad(i)}</span>
                  <h3 id={`${project.id}-name`} className={styles.name}>
                    {project.name}
                  </h3>
                  {project.category && <p className={styles.category}>{project.category}</p>}
                </header>

                <ProjectPreview project={project} index={i} />

                <div className={styles.body} data-fade>
                  <p className={styles.description}>{project.description}</p>
                  <ul className={styles.tags} aria-label="Contributions">
                    {project.contributions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {project.technologies.length > 0 && (
                    <ul className={`${styles.tags} ${styles.technologies}`} aria-label="Technologies">
                      {project.technologies.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className={styles.hint} data-hint aria-hidden="true">
          Scroll to explore
          <svg viewBox="0 0 16 16">
            <path d="M8 3v10M4 9l4 4 4-4" />
          </svg>
        </p>
      </div>
    </section>
  );
};

export default Projects;
