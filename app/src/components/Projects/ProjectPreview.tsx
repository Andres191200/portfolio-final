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

const ProjectPreview = ({ project, index }: { project: Project; index: number }) => (
  <div className={styles.preview} data-preview>
    <div className={styles.media} data-media>
      {project.device === "mobile" ? (
        // Phone rising from the bottom edge over the artwork; the screen is cropped by the frame
        <div className={styles.placeholder}>
          <Artwork index={index} />
          <div className={styles.phone}>
            {project.image ? (
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                unoptimized
                sizes="240px"
              />
            ) : (
              <span>Project preview</span>
            )}
          </div>
        </div>
      ) : project.image ? (
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(min-width: 1024px) 760px, (min-width: 900px) 50vw, 100vw"
        />
      ) : (
        <div className={styles.placeholder} aria-hidden="true">
          <Artwork index={index} />
          <span>Project preview</span>
        </div>
      )}
    </div>
  </div>
);

export default ProjectPreview;
