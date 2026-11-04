"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { display, handwriting } from "../../styles/fonts";
import styles from "./Hero.module.scss";
import { registerHeroStep } from "./heroController";
import HeroArrows from "./HeroArrows";

// Final layout order, left to right
const logos = [
  { name: "Next.js", src: "/new-hero/tech-logos/nextjs.png" },
  { name: "React", src: "/new-hero/tech-logos/react.png" },
  { name: "TypeScript", src: "/new-hero/tech-logos/typescript.png" },
  { name: "Flutter", src: "/new-hero/tech-logos/flutter.png" },
  { name: "Docker", src: "/new-hero/tech-logos/docker.png" },
  { name: "SQL", src: "/new-hero/tech-logos/sql.png" },
  { name: "GPT", src: "/new-hero/tech-logos/openai.png" },
  { name: "Claude", src: "/new-hero/tech-logos/claude.png" },
];

const SCENES = 5;
const ARROWS = 1;
const DEVELOP = 3;
const FINAL = 4;

// Strong ease-out, close to cubic-bezier(0.23, 1, 0.32, 1)
const EASE_OUT = "expo.out";
const DRAW_EASE = "power2.out";

// A trackpad swipe fires a stream of events; only a new gesture (or a long
// continuous one) should count as a step
const GESTURE_GAP = 150;
const CONTINUOUS_STEP = 800;

// Where the logos start on the invisible curve, in the same units as their slots (-1 → 1)
const CURVE_START = -1.7;

const Words = ({ text, keep }: { text: string; keep?: boolean }) => (
  <>
    {text.split(" ").map((word, i) => (
      <span key={i}>
        {i > 0 && " "}
        <span className={styles.word} data-word={keep ? "keep" : "lead"}>
          {word}
        </span>
      </span>
    ))}
  </>
);

type WindowProps = { label: string; src?: string; variant: "original" | "redesign" };

const BrowserWindow = ({ label, src, variant }: WindowProps) => (
  <div className={styles.window} data-variant={variant} data-window>
    <div className={styles.windowBar} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
    <div className={styles.windowBody}>
      {!src && <span className={styles.windowLabel}>{label} · GIF</span>}
      {src && /\.(mp4|webm)$/.test(src) && (
        <video className={styles.media} src={src} muted loop playsInline autoPlay />
      )}
      {src && !/\.(mp4|webm)$/.test(src) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.media} src={src} alt={label} />
      )}
    </div>
  </div>
);

type HeroProps = { originalSrc?: string; redesignSrc?: string };

const Hero = ({
  originalSrc = "/new-hero/redesign_1.gif",
  redesignSrc = "/new-hero/redesign_2.gif",
}: HeroProps) => {
  const rootRef = useRef<HTMLElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scenes = sceneRefs.current as HTMLDivElement[];
    const q = (scene: number, selector: string) => Array.from(scenes[scene].querySelectorAll<HTMLElement>(selector));

    let current = 0;
    let active: gsap.core.Timeline | null = null;
    let lastEvent = 0;
    let lastStep = 0;
    let go: (to: number) => void = () => {};

    const ctx = gsap.context(() => {
      // Apple-style entrance: opacity + blur + a few pixels up
      const reveal = (targets: Element[], { stagger = 0.09, y = 14, blur = 10, duration = 1 } = {}) =>
        reduced
          ? gsap.fromTo(targets, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: stagger / 3 })
          : gsap.fromTo(
              targets,
              { opacity: 0, y, filter: `blur(${blur}px)` },
              { opacity: 1, y: 0, filter: "blur(0px)", duration, ease: EASE_OUT, stagger }
            );

      const showScene = (index: number) => {
        const tl = gsap.timeline();
        tl.set(scenes[index], { autoAlpha: 1 });
        tl.set(q(index, "[data-inner]"), { opacity: 1, y: 0, filter: "blur(0px)" });
        return tl;
      };

      const outro = (index: number) =>
        gsap
          .timeline()
          .to(q(index, "[data-inner]"), {
            opacity: 0,
            ...(reduced ? {} : { y: -10, filter: "blur(8px)" }),
            duration: 0.4,
            ease: "power2.out",
          })
          .set(scenes[index], { autoAlpha: 0 });

      const drawArrows = () => {
        const tl = gsap.timeline();
        const masks = q(ARROWS, "[data-draw]");
        const labels = q(ARROWS, "[data-arrow-label]");
        tl.set(masks, { strokeDashoffset: 1 });
        tl.set(labels, { clipPath: "inset(-20% 100% -20% 0%)" });

        if (reduced) {
          tl.set(masks, { strokeDashoffset: 0 });
          tl.to(labels, { clipPath: "inset(-20% 0% -20% 0%)", duration: 0.01 });
          return tl;
        }

        for (let i = 0; i < 3; i++) {
          const at = i * 0.45;
          const shafts = q(ARROWS, `[data-arrow="${i}"] [data-draw="shaft"]`);
          const heads = q(ARROWS, `[data-arrow="${i}"] [data-draw="head"]`);
          // Both layouts (desktop + phone) animate together; only one is displayed
          const headsByLayout = [heads.filter((_, k) => k % 2 === 0), heads.filter((_, k) => k % 2 === 1)];
          tl.to(shafts, { strokeDashoffset: 0, duration: 0.9, ease: DRAW_EASE }, at);
          tl.to(headsByLayout[0], { strokeDashoffset: 0, duration: 0.22, ease: DRAW_EASE }, at + 0.8);
          tl.to(headsByLayout[1], { strokeDashoffset: 0, duration: 0.22, ease: DRAW_EASE }, at + 0.98);
          tl.to(
            q(ARROWS, `[data-arrow-label="${i}"]`),
            { clipPath: "inset(-20% 0% -20% 0%)", duration: 0.7, ease: DRAW_EASE },
            at + 1.05
          );
        }
        return tl;
      };

      // Camera follows the sentence: once a word would cross the right margin,
      // the track slides left so the newest word stays in frame
      const developIntro = () => {
        const track = q(DEVELOP, "[data-track]")[0];
        const words = q(DEVELOP, "[data-word]");
        const keep = q(DEVELOP, "[data-keep]")[0];
        const lead = q(DEVELOP, '[data-word="lead"]');
        const stageWidth = scenes[DEVELOP].clientWidth;
        const margin = stageWidth * 0.06;

        // The scene is hidden here, so resetting before measuring is invisible
        gsap.set(track, { x: 0 });
        gsap.set(keep, { clearProps: "transform,opacity,filter" });
        const trackLeft = track.getBoundingClientRect().left;
        const shiftFor = (word: HTMLElement) =>
          Math.max(0, word.getBoundingClientRect().right - trackLeft - (stageWidth - margin));

        const tl = showScene(DEVELOP);

        if (reduced) {
          tl.set(track, { x: -shiftFor(words[words.length - 1]) });
          tl.add(reveal(words));
          tl.set(lead, { opacity: 0.35 });
          return tl;
        }

        words.forEach((word, i) => {
          const at = 0.1 + i * 0.3;
          tl.fromTo(
            word,
            { opacity: 0, y: 16, filter: "blur(12px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: EASE_OUT },
            at
          );
          const shift = shiftFor(word);
          if (shift > 0) tl.to(track, { x: -shift, duration: 1.2, ease: "power3.inOut" }, at);
        });
        // Earlier words step back once "from end to end" owns the frame
        tl.to(lead, { opacity: 0.35, duration: 0.8, ease: "power2.out" }, ">-0.5");
        return tl;
      };

      const finalBody = () => {
        const tl = gsap.timeline();
        const row = q(FINAL, "[data-logos]")[0];
        const items = q(FINAL, "[data-logo]");
        const names = q(FINAL, "[data-logo-name]");
        const half = row.clientWidth / 2;
        const depth = row.clientHeight;
        const slot = (i: number) => -1 + (2 * i) / (items.length - 1);
        const place = (el: HTMLElement, u: number) => {
          gsap.set(el, { x: u * half, y: depth * (1 - u * u) });
        };

        tl.add(reveal(q(FINAL, "[data-sub] [data-word]"), { stagger: 0.05, duration: 0.9 }));
        tl.add(reveal(q(FINAL, "[data-cta]"), { y: 12, blur: 6, duration: 0.8 }), ">-0.35");

        if (reduced) {
          items.forEach((el, i) => place(el, slot(i)));
          tl.fromTo(items, { opacity: 0 }, { opacity: 1, duration: 0.3 });
          tl.fromTo(names, { opacity: 0 }, { opacity: 1, duration: 0.3 });
          return tl;
        }

        items.forEach((el) => {
          place(el, CURVE_START);
          gsap.set(el, { opacity: 0 });
        });

        // The rightmost slot departs first so no logo travels through a parked one
        const start = tl.duration() - 0.2;
        [...items].reverse().forEach((el, k) => {
          const i = items.length - 1 - k;
          const target = slot(i);
          const travel = { u: CURVE_START };
          const at = start + k * 0.14;
          tl.to(
            travel,
            {
              u: target,
              duration: 0.9 + (target - CURVE_START) * 0.18,
              ease: DRAW_EASE,
              onUpdate: () => place(el, travel.u),
            },
            at
          );
          tl.fromTo(
            el,
            { opacity: 0, filter: "blur(6px)" },
            { opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" },
            at
          );
        });
        // Names only once every logo has parked, read left to right
        tl.fromTo(
          names,
          { opacity: 0, y: -4, filter: "blur(4px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: EASE_OUT, stagger: 0.06 },
          tl.duration()
        );
        return tl;
      };

      // "from end to end" leaves the sentence and becomes the final headline
      const handoffToFinal = () => {
        const tl = gsap.timeline();
        const keep = q(DEVELOP, "[data-keep]")[0];
        const headline = q(FINAL, "[data-headline]")[0];
        gsap.set(q(FINAL, "[data-inner]"), { y: 0 });
        // Pin on the first "end": everything after it is identical in both phrases,
        // so only "f → F" and the period actually crossfade
        const keepRect = keep.getBoundingClientRect();
        const from = q(DEVELOP, '[data-word="keep"]')[1].getBoundingClientRect();
        const to = q(FINAL, "[data-anchor]")[0].getBoundingClientRect();
        const scale =
          parseFloat(getComputedStyle(headline).fontSize) / parseFloat(getComputedStyle(keep).fontSize);
        gsap.set(keep, { transformOrigin: `${from.left - keepRect.left}px ${from.top - keepRect.top}px` });

        tl.add(showScene(FINAL));
        tl.set(headline, { opacity: 0 });
        tl.set(q(FINAL, "[data-sub] [data-word], [data-cta], [data-logo], [data-logo-name]"), { opacity: 0 });
        tl.to(q(DEVELOP, '[data-word="lead"]'), {
          opacity: 0,
          ...(reduced ? {} : { filter: "blur(10px)" }),
          duration: 0.45,
          ease: "power2.out",
        });

        if (!reduced) {
          tl.to(
            keep,
            {
              x: to.left - from.left,
              y: to.top - from.top,
              scale,
              duration: 1.1,
              ease: "power3.inOut",
            },
            "<0.15"
          );
        }

        // Blur bridges the swap ("from end to end" → "From end to end.")
        tl.to(keep, { opacity: 0, filter: "blur(2px)", duration: 0.25, ease: "power2.out" });
        tl.fromTo(
          headline,
          { opacity: 0, filter: "blur(2px)" },
          { opacity: 1, filter: "blur(0px)", duration: 0.25, ease: "power2.out" },
          "<"
        );
        tl.set(scenes[DEVELOP], { autoAlpha: 0 });
        tl.add(finalBody(), "-=0.1");
        return tl;
      };

      const intro = (index: number) => {
        if (index === DEVELOP) return developIntro();

        const tl = showScene(index);
        if (index === FINAL) {
          tl.add(reveal(q(FINAL, "[data-headline]"), { y: 16 }));
          tl.add(finalBody(), "-=0.5");
          return tl;
        }

        if (index === ARROWS) {
          // Arrows reset before the scene shows so they never flash drawn
          gsap.set(q(ARROWS, "[data-draw]"), { strokeDashoffset: 1 });
          gsap.set(q(ARROWS, "[data-arrow-label]"), { clipPath: "inset(-20% 100% -20% 0%)" });
        }
        tl.add(reveal(q(index, "[data-word]")));
        const windows = q(index, "[data-window]");
        if (windows.length) tl.add(reveal(windows, { y: 24, blur: 8, duration: 1.1 }), ">-0.45");
        if (index === ARROWS) tl.add(drawArrows(), ">-0.3");
        return tl;
      };

      const settle = () => {
        active = null;
      };

      // Tweens created later (on scroll) still belong to the context, so revert() cleans them
      go = (to) =>
        ctx.add(() => {
          const from = current;
          current = to;
          const tl = gsap.timeline({ onComplete: settle });
          if (from === DEVELOP && to === FINAL) tl.add(handoffToFinal());
          else tl.add(outro(from)).add(intro(to));
          active = tl;
        });

      gsap.set(scenes, { autoAlpha: 0 });
      active = intro(0).eventCallback("onComplete", settle);
    }, root);

    const unregister = registerHeroStep((direction) => {
      const now = performance.now();
      const isNewGesture = now - lastEvent > GESTURE_GAP;
      lastEvent = now;
      if (!isNewGesture && now - lastStep < CONTINUOUS_STEP) return true;

      // While a scene is still entering, scrolling on speeds it up instead of cutting it
      if (active) {
        if (direction === 1) active.timeScale(4);
        lastStep = now;
        return true;
      }

      const next = current + direction;
      if (next < 0 || next >= SCENES) return false;
      lastStep = now;
      go(next);
      return true;
    });

    return () => {
      unregister();
      ctx.revert();
    };
  }, []);

  const scrollToProjects = () => {
    window.dispatchEvent(new CustomEvent("navigateToSection", { detail: { index: 1 } }));
  };

  const sceneRef = (index: number) => (el: HTMLDivElement | null) => {
    sceneRefs.current[index] = el;
  };

  return (
    <section ref={rootRef} id="hero" className={`${styles.hero} ${handwriting.variable} ${display.variable}`}>
      <div className={styles.glow} aria-hidden="true" />

      <div ref={sceneRef(0)} className={styles.scene}>
        <div className={styles.windowScene} data-inner>
          <h1 className={styles.statement}>
            <Words text="AI can generate an interface." />
          </h1>
          <BrowserWindow label="Original landing" src={originalSrc} variant="original" />
        </div>
      </div>

      <div ref={sceneRef(1)} className={styles.scene}>
        <div className={styles.windowScene} data-inner data-scene="arrows">
          <h2 className={styles.statement}>
            <Words text="I turn it into an experience." />
          </h2>
          <div className={styles.annotated}>
            <BrowserWindow label="Redesigned landing" src={redesignSrc} variant="redesign" />
            <HeroArrows />
          </div>
        </div>
      </div>

      <div ref={sceneRef(2)} className={styles.scene}>
        <div data-inner>
          <h2 className={styles.intro}>
            <span>
              <Words text="I’m Andrés." />
            </span>
            <span>
              <Words text="This is what I do." />
            </span>
          </h2>
        </div>
      </div>

      <div ref={sceneRef(3)} className={`${styles.scene} ${styles.developScene}`}>
        <div className={styles.developInner} data-inner>
          <h2 className={styles.develop} data-track>
            <Words text="I develop products" />{" "}
            <span className={styles.keep} data-keep>
              <Words text="from end to end" keep />
            </span>
          </h2>
        </div>
      </div>

      <div ref={sceneRef(4)} className={styles.scene}>
        <div className={styles.finalScene} data-inner>
          <h2 className={styles.headline} data-headline>
            From <span data-anchor>end</span> to end.
          </h2>
          <p className={styles.subtitle} data-sub>
            <span>
              <Words text="I orchestrate AI agents to build complete products." />
            </span>
            <span>
              <Words text="Thoughtful design." />
            </span>
          </p>
          <button className={styles.cta} onClick={scrollToProjects} data-cta>
            Explore my work
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5 11 11 5M6 5h5v5" />
            </svg>
          </button>
          <ul className={styles.logos} data-logos aria-label="Tech stack">
            {logos.map((logo) => (
              <li key={logo.name} className={styles.logo} data-logo>
                <Image src={logo.src} alt="" width={40} height={40} />
                <span className={styles.logoName} data-logo-name>
                  {logo.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Hero;
