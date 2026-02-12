'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Projects.module.scss'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  link: string
  github?: string
  featured?: boolean
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Simple realtime auto-destructive chat',
    description: 'A full-stack chat application with real-time messaging, basic authentication and the fun part: The room is automatically destroyed after 10 minutes.',
    tags: ['Next.js', 'TypeScript', 'ElysiaJS', 'Redis', 'SASS', 'Upstash'],
    link: '#',
    github: '#',
    featured: true,
  },
  {
    id: 2,
    title: 'MCP Server chat',
    description: 'A project for my company about loading my worked hours to my company web through a chat with an MCP ',
    tags: ['Ollama', 'Node JS', 'Mistral AI', 'TypeScript', 'SASS', 'React JS', 'Firebase', 'GSAP', 'Zod'],
    link: '#',
    github: '#',
  },
  {
    id: 3,
    title: 'Todo Vibe Coding app',
    description: 'A simple todo app built using Claude Code',
    tags: ['Next JS', 'AI Skills', 'LLM Agent', 'UX Pilot', 'Claude'],
    link: '#',
    github: '#',
  },
  {
    id: 4,
    title: 'Expenses App',
    description: 'A simple expenses tracking application with budgeting features and visual analytics.',
    tags: ['Next JS', 'React', 'TypeScript', 'Recharts', 'SASS', 'Prisma'] ,
    link: '#',
  },
]

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const featuredRef = useRef<HTMLAnchorElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const featuredProject = projects.find(p => p.featured)
  const otherProjects = projects.filter(p => !p.featured)

  const handleKeyDown = useCallback((e: React.KeyboardEvent, link: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      window.open(link, '_blank', 'noopener,noreferrer')
    }
  }, [])

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) return

    // Find the scrollable container (sectionContent parent)
    const scrollContainer = sectionRef.current?.parentElement

    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: headerRef.current,
          scroller: scrollContainer,
          start: 'top 85%',
        }
      })

      // Featured card animation
      if (featuredRef.current) {
        gsap.from(featuredRef.current, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: featuredRef.current,
            scroller: scrollContainer,
            start: 'top 85%',
          }
        })
      }

      // Grid items staggered animation
      const gridItems = gridRef.current?.children || []
      if (gridItems.length > 0) {
        gsap.from(gridItems, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: gridRef.current,
            scroller: scrollContainer,
            start: 'top 85%',
          }
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="projects"
      className={styles.projects}
      aria-labelledby="projects-heading"
    >
      <div className={styles.container}>
        {/* Header */}
        <div ref={headerRef} className={styles.header}>
          <span className={styles.label}>Portfolio</span>
          <h2 id="projects-heading" className={styles.title}>
            My stuff!
          </h2>
        </div>

        {/* Project Grid */}
        <div ref={gridRef} className={styles.grid} role="list">
          {/* Featured Project */}
        {featuredProject && (
          <a
            ref={featuredRef}
            href={featuredProject.link}
            className={styles.featuredCard}
            onKeyDown={(e) => handleKeyDown(e, featuredProject.link)}
            aria-label={`View ${featuredProject.title} project`}
          >
            <div className={styles.featuredImageWrapper}>
              <div className={styles.featuredImage}>
                <span className={styles.featuredNumber}>01</span>
              </div>
            </div>
            <div className={styles.featuredContent}>
              <span className={styles.featuredBadge}>Featured Project</span>
              <h3 className={styles.featuredTitle}>{featuredProject.title}</h3>
              <p className={styles.featuredDescription}>
                {featuredProject.description}
              </p>
              <div className={styles.featuredTags}>
                {featuredProject.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <div className={styles.featuredActions}>
                <span className={styles.viewLink}>
                  View Project
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </span>
                {featuredProject.github && (
                  <span
                    className={styles.githubLink}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      window.open(featuredProject.github, '_blank', 'noopener,noreferrer')
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        window.open(featuredProject.github, '_blank', 'noopener,noreferrer')
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${featuredProject.title} source code on GitHub`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    Source Code
                  </span>
                )}
              </div>
            </div>
          </a>
        )}
          {otherProjects.map((project, index) => (
            <a
              key={project.id}
              href={project.link}
              className={styles.card}
              onKeyDown={(e) => handleKeyDown(e, project.link)}
              role="listitem"
              aria-label={`View ${project.title} project`}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardNumber}>
                  {String(index + 2).padStart(2, '0')}
                </span>
                <div className={styles.cardIcons}>
                  {project.github && (
                    <span
                      className={styles.cardIcon}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        window.open(project.github, '_blank', 'noopener,noreferrer')
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          e.stopPropagation()
                          window.open(project.github, '_blank', 'noopener,noreferrer')
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`View ${project.title} source code on GitHub`}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </span>
                  )}
                  <span className={styles.cardIcon} aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDescription}>{project.description}</p>
              </div>
              <div className={styles.cardFooter}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
