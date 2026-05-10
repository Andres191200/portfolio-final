'use client'

import { useRef, useCallback } from 'react'
import Image from 'next/image'
import styles from './Projects.module.scss'

interface Project {
  id: number
  title: string
  subtitle: string
  tags: string[]
  link: string
  github?: string
  image?: string
}

const cardGradients = [
  ['#1a1040', '#3b2f6e'],
  ['#0f2027', '#2c5364'],
  ['#1a0a2e', '#4a1942'],
  ['#0a2818', '#1a5c3a'],
  ['#1f1a00', '#4d3d00'],
  ['#0f0f2e', '#1e3a6e'],
  ['#2a0a0a', '#6e1a1a'],
  ['#0a1a2e', '#1a3a5c'],
]

const projects: Project[] = [
  {
    id: 1,
    title: 'Airmax Sneakers landing',
    image: '/nike-air-landing/nike-air-1.png',
    subtitle: 'A test landing hero section for a fictional nike sneakers',
    tags: ['React.JS', 'Claude code', 'CSS', 'Typescript'],
    link: 'https://github.com/Andres191200/nike-sneakers-landing-test',
    github: 'https://github.com/Andres191200/nike-sneakers-landing-test',
  },
  {
    id: 2,
    title: 'Hour logger',
    subtitle: 'A custom hour logger to log hours in my company',
    tags: ['Next.JS', 'Claude code', 'Recharts', 'NextAuth', 'MotionJS', 'SASS'],
    link: 'https://github.com/Andres191200/hours-logger',
    github: 'https://github.com/Andres191200/hours-logger',
  },
  {
    id: 3,
    title: 'Todo App',
    subtitle: 'A simple todo app',
    tags: ['Next.js', 'AI Skills', 'SASS', 'Claude code', 'Typescript', 'Recharts'],
    link: 'https://github.com/Andres191200/todo-app-ai-skills',
    github: 'https://github.com/Andres191200/todo-app-ai-skills',
  },
  {
    id: 4,
    title: 'Fleet app',
    subtitle: 'A fleet app for truck drivers (company project)',
    tags: ['Flutter', 'Riverpod', 'Firebase', 'iOS', 'Android', 'Remote notifications', 'Realtime location'],
    link: '',
    github: '',
  },
  {
    id: 5,
    title: 'Portfolio v1',
    subtitle: 'First portfolio, built with plain HTML & CSS',
    tags: ['HTML', 'CSS', 'JavaScript'],
    link: 'https://github.com/Andres191200',
  },
  {
    id: 6,
    title: 'Design System',
    subtitle: 'Component library with design tokens',
    tags: ['React', 'Storybook', 'SASS', 'TypeScript'],
    link: 'https://github.com/Andres191200',
  },
  {
    id: 7,
    title: 'Flutter Mobile App',
    subtitle: 'Cross-platform app with Firebase backend',
    tags: ['Flutter', 'Firebase', 'Dart'],
    link: 'https://github.com/Andres191200',
  },
  {
    id: 8,
    title: 'Open Source Contributions',
    subtitle: 'Bug fixes and features across the ecosystem',
    tags: ['Open Source', 'GitHub', 'Community'],
    link: 'https://github.com/Andres191200',
  },
]

// Duration in seconds for one full orbit
const ORBIT_DURATION = 60;

interface OrbitCardProps {
  project: Project
  gradIndex: number
}

const OrbitCard = ({ project, gradIndex }: OrbitCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    const glare = glareRef.current
    if (!card || !glare) return

    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    rafRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2

      card.style.transform = `perspective(600px) rotateX(${-ny * 10}deg) rotateY(${nx * 10}deg) scale3d(1.06, 1.06, 1.06)`

      const gx = 50 + nx * 30
      const gy = 50 + ny * 30
      glare.style.opacity = '1'
      glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.14) 0%, transparent 60%)`
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    const glare = glareRef.current
    if (!card || !glare) return

    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
    card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    glare.style.opacity = '0'

    setTimeout(() => {
      if (cardRef.current) cardRef.current.style.transition = ''
    }, 500)
  }, [])

  const [gradFrom, gradTo] = cardGradients[gradIndex % cardGradients.length]

  return (
    <div
      ref={cardRef}
      className={styles.orbitCard}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={glareRef} className={styles.glare} aria-hidden="true" />

      <div
        className={styles.cardImage}
        style={{ background: `linear-gradient(135deg, ${gradFrom} 0%, ${gradTo} 100%)` }}
        aria-hidden="true"
      >
        {project.image ? (
          <Image src={project.image} alt={project.title} fill style={{ objectFit: 'cover' }} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.25">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <p className={styles.cardSubtitle}>{project.subtitle}</p>
      </div>

      <div className={styles.cardLinks}>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
            aria-label={`${project.title} source code`}
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        )}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.iconLink}
          aria-label={`View ${project.title}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </div>
    </div>
  )
}

const Projects = () => (
  <section id="projects" className={styles.projects} aria-labelledby="projects-heading">
    {/* Faint orbit path rings */}
    <div className={styles.orbitRing} aria-hidden="true" />
    <div className={styles.orbitRingOuter} aria-hidden="true" />

    {/* Center sun */}
    <div className={styles.center}>
      <span className={styles.label}>Portfolio</span>
      <h2 id="projects-heading" className={styles.title}>My stuff!</h2>
    </div>

    {/* 4 orbiting planets */}
    {projects.slice(0, 4).map((project, i) => (
      <div
        key={project.id}
        className={styles.orbitItem}
        style={{ animationDelay: `${-(i / 4) * ORBIT_DURATION}s` } as React.CSSProperties}
        role="listitem"
      >
        <OrbitCard project={project} gradIndex={i} />
      </div>
    ))}
  </section>
)

export default Projects
