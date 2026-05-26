'use client'

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
  imageStyle?: 'contain' | 'cover',
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
    image: '/projects-media/nike-air-landing/nike-air-1.png',
    subtitle: 'A test landing hero section for a fictional nike sneakers',
    tags: ['React.JS', 'Claude code', 'CSS', 'Typescript'],
    link: 'https://github.com/Andres191200/nike-sneakers-landing-test',
    github: 'https://github.com/Andres191200/nike-sneakers-landing-test',
  },
  {
    id: 2,
    title: 'Hour logger',
    image: '/projects-media/hour-load/hour-load-1.png',
    subtitle: 'A custom hour logger to log hours in my company',
    tags: ['Next.JS', 'Claude code', 'Recharts', 'NextAuth', 'MotionJS', 'SASS'],
    link: 'https://github.com/Andres191200/hours-logger',
    github: 'https://github.com/Andres191200/hours-logger',
  },
  {
    id: 3,
    title: 'Todo App',
    image: '/projects-media/todo-app/todo-1.png',
    subtitle: 'A simple todo app',
    tags: ['Next.js', 'AI Skills', 'SASS', 'Claude code', 'Typescript', 'Recharts'],
    link: 'https://github.com/Andres191200/todo-app-ai-skills',
    github: 'https://github.com/Andres191200/todo-app-ai-skills',
  },
  {
    id: 4,
    title: 'Fleet app',
    subtitle: 'A fleet app for truck drivers (company project)',
    image: '/projects-media/sgi-mobile/sgi-mobile-1.gif',
    imageStyle: 'contain',
    tags: ['Flutter', 'Riverpod', 'Firebase', 'iOS', 'Android'],
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
    title: 'MCP Server Chat',
    subtitle: 'AI chat that logs work hours via an MCP server',
    tags: ['Ollama', 'Node.js', 'Mistral AI', 'TypeScript', 'Firebase'],
    link: 'https://github.com/Andres191200/mcp-ai-chat',
    github: 'https://github.com/Andres191200/mcp-ai-chat',
  },
]

const Projects = () => (
  <section id="projects" className={styles.projects} aria-labelledby="projects-heading">
    <div className={styles.header}>
      <span className={styles.label}>Portfolio</span>
      <h2 id="projects-heading" className={styles.title}>My stuff!</h2>
    </div>

    <div className={styles.deck} role="list">
      {projects.map((project, i) => {
        const [gradFrom, gradTo] = cardGradients[i % cardGradients.length]
        return (
          <div key={project.id} className={styles.card} role="listitem">
            {/* Background: gradient or real image */}
            <div
              className={styles.cardBg}
              style={{ background: `linear-gradient(160deg, ${gradFrom} 0%, ${gradTo} 100%)` }}
            >
              {project.image && (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  style={{ objectFit: project.imageStyle || 'cover' }}
                />
              )}
            </div>

            {/* Permanent dark overlay for readability */}
            <div className={styles.cardOverlay} aria-hidden="true" />

            {/* Collapsed state: vertical number + title */}
            <div className={styles.cardCollapsed} aria-hidden="true">
              <span className={styles.cardNumber}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.cardVerticalTitle}>{project.title}</span>
            </div>

            {/* Expanded state: full info */}
            <div className={styles.cardExpanded}>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardSubtitle}>{project.subtitle}</p>
              <div className={styles.cardTags}>
                {project.tags.slice(0, 4).map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <div className={styles.cardActions}>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionLink}
                    onClick={e => e.stopPropagation()}
                  >
                    GitHub
                  </a>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.actionLink} ${styles.actionLinkPrimary}`}
                  >
                    View →
                  </a>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  </section>
)

export default Projects
