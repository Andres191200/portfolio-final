import { useState } from "react";
import Image from "next/image";
import type { Project } from "../../data/projects";
import styles from "./Projects.module.scss";

// Quiet local artwork for projects without a screenshot yet, one shape per slot
const shapes = [
  <>
    <path d="M0 120 L260 240 L0 240Z" />
    <path d="M400 10 L210 240 L400 240Z" opacity="0.55" />
  </>,
  <>
    <circle cx="400" cy="330" r="260" />
    <ellipse cx="90" cy="250" rx="170" ry="70" opacity="0.6" />
  </>,
  <>
    <path d="M0 160 C90 110 170 190 260 140 S370 80 400 95 V240 H0Z" opacity="0.6" />
    <path d="M0 210 C110 170 200 230 300 190 S380 160 400 170 V240 H0Z" />
  </>,
  <>
    <path d="M0 200 L90 140 L140 178 L270 70 L400 170 V240 H0Z" />
  </>,
];

const Artwork = ({ index }: { index: number }) => (
  <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id={`preview-fill-${index}`} x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#b4a6f8" stopOpacity="0.38" />
        <stop offset="1" stopColor="#b4a6f8" stopOpacity="0.06" />
      </linearGradient>
    </defs>
    <g fill={`url(#preview-fill-${index})`}>{shapes[index % shapes.length]}</g>
  </svg>
);

// Wide screenshots fill the preview; several of them become a slider with arrows and dots
const Slider = ({ project }: { project: Project }) => {
  const images = project.images ?? [];
  const [current, setCurrent] = useState(0);
  const count = images.length;
  const go = (step: number) => setCurrent((i) => (i + step + count) % count);
  const sizes = "(min-width: 1024px) 760px, (min-width: 900px) 50vw, 100vw";

  if (count === 1) {
    return <Image src={images[0]} alt={project.imageAlt} fill sizes={sizes} />;
  }

  return (
    <div
      className={styles.slider}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${project.name} screenshots`}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      <div className={styles.track} style={{ transform: `translateX(-${current * 100}%)` }}>
        {images.map((src, i) => (
          <div
            key={src}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== current}
          >
            <Image
              src={src}
              alt={`${project.imageAlt} (${i + 1} of ${count})`}
              fill
              sizes={sizes}
              // Slides waiting off to the side never intersect the viewport, so load them up front
              loading={i === 0 ? undefined : "eager"}
            />
          </div>
        ))}
      </div>

      <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={() => go(-1)} aria-label="Previous image">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M10 3L5 8l5 5" />
        </svg>
      </button>
      <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => go(1)} aria-label="Next image">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 3l5 5-5 5" />
        </svg>
      </button>

      <div className={styles.dots}>
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className={styles.dot}
            aria-label={`Show image ${i + 1}`}
            aria-current={i === current ? "true" : undefined}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
      <p className={styles.counter} aria-live="polite">
        {current + 1} / {count}
      </p>
    </div>
  );
};

const ProjectPreview = ({ project, index }: { project: Project; index: number }) => {
  const image = project.images?.[0];

  return (
    <div className={styles.preview} data-preview>
      <div className={styles.media} data-media>
        {project.device === "mobile" ? (
          // Phone rising from the bottom edge over the artwork; the screen is cropped by the frame
          <div className={styles.placeholder}>
            <Artwork index={index} />
            <div className={styles.phone}>
              {image ? (
                <Image src={image} alt={project.imageAlt} fill unoptimized sizes="240px" />
              ) : (
                <span>Project preview</span>
              )}
            </div>
          </div>
        ) : image ? (
          <Slider project={project} />
        ) : (
          <div className={styles.placeholder} aria-hidden="true">
            <Artwork index={index} />
            <span>Project preview</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPreview;
