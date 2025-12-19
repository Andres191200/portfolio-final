'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Projects.module.scss'

gsap.registerPlugin(ScrollTrigger)

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Placeholder projects for now
  const projects = Array(6).fill(null).map((_, index) => ({
    id: index + 1,
    title: `Project ${index + 1}`,
    description: 'Project description will go here'
  }))

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          end: 'top 50%',
        }
      })

      // Grid items animation
      const gridItems = gridRef.current?.children || []
      gsap.from(gridItems, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: {
          amount: 0.4,
          from: 'start'
        },
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          end: 'top 50%',
        }
      })

      // Hover animations
      Array.from(gridItems).forEach((item) => {
        const hoverTl = gsap.timeline({ paused: true })

        hoverTl.to(item, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        })

        item.addEventListener('mouseenter', () => hoverTl.play())
        item.addEventListener('mouseleave', () => hoverTl.reverse())
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="projects" className={styles.projects}>
      <div className={styles.container}>
        <h2 ref={titleRef} className={styles.title}>
          Featured Projects
        </h2>
        <div ref={gridRef} className={styles.grid}>
          {projects.map((project) => (
            <article key={project.id} className={styles.projectCard}>
              <div className={styles.projectContent}>
                <div className={styles.projectNumber}>
                  {project.id.toString().padStart(2, '0')}
                </div>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
                <div className={styles.projectTech}>
                  <span className={styles.techTag}>React</span>
                  <span className={styles.techTag}>TypeScript</span>
                  <span className={styles.techTag}>SASS</span>
                </div>
                <button className={styles.projectLink}>
                  View Project →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects