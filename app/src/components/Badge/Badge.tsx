import type { CSSProperties } from "react";
import styles from "./Badge.module.scss";

const icons = {
  // Circled check mark
  check: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M7.5 12.5l3 3 6-6.5" />
    </svg>
  ),
  // Person with a code tag at their side
  role: (
    <svg viewBox="0 0 28 24" aria-hidden="true">
      <circle cx="9" cy="6.5" r="4" />
      <path d="M2.5 19.5C2.5 15.6 5.4 13 9 13M2.5 19.5H9" />
      <path d="M16 14.5l-3 2.75 3 2.75M20.5 13l-2 8.5M23 14.5l3 2.75-3 2.75" />
    </svg>
  ),
};

type BadgeProps = {
  title: string;
  text: string;
  // Any CSS color, e.g. "#4ade80". Tints the icon and the title.
  color: string;
  icon: keyof typeof icons;
};

const Badge = ({ title, text, color, icon }: BadgeProps) => (
  <div className={styles.badge} style={{ "--badge-color": color } as CSSProperties}>
    <span className={styles.icon}>{icons[icon]}</span>
    <div className={styles.content}>
      <p className={styles.title}>{title}</p>
      <p className={styles.text}>{text}</p>
    </div>
  </div>
);

export default Badge;
