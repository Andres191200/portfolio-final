'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TechIcons } from './TechIcons'
import styles from './WhoAmI.module.scss'

gsap.registerPlugin(ScrollTrigger)

const WhoAmI = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const dynamicWordRef = useRef<HTMLSpanElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const techGridRef = useRef<HTMLDivElement>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  const words = ['Productive', 'Seamless', 'Detailed', 'Focused']

  const technologies = [
    { name: 'React', icon: TechIcons.React },
    { name: 'Next.js', icon: TechIcons.NextJs },
    { name: 'TypeScript', icon: TechIcons.TypeScript },
    { name: 'JavaScript', icon: TechIcons.JavaScript },
    { name: 'SASS', icon: TechIcons.SASS },
    { name: 'CSS3', icon: TechIcons.CSS3 },
    { name: 'GSAP', icon: TechIcons.GSAP },
    { name: 'Git', icon: TechIcons.Git },
    { name: 'Figma', icon: TechIcons.Figma },
    { name: 'Node.js', icon: TechIcons.NodeJs },
    { name: 'HTML5', icon: TechIcons.HTML5 },
    { name: 'Webpack', icon: TechIcons.Webpack }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 50%',
        }
      })

      tl.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })
      .from(descriptionRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4')

      // Tech icons animation
      const techItems = techGridRef.current?.children || []

      gsap.from(techItems, {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: {
          amount: 0.8,
          from: 'random'
        },
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: techGridRef.current,
          start: 'top 85%',
          end: 'top 55%',
        }
      })

      // Floating animation for each tech icon
      Array.from(techItems).forEach((item, index) => {
        const delay = index * 0.2
        const duration = 2 + (Math.random() * 2) // Random duration between 2-4 seconds

        gsap.to(item, {
          y: -15,
          rotation: 5 - (index % 3) * 5, // Slight rotation variation
          duration: duration,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: delay
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      gsap.to(dynamicWordRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
          gsap.fromTo(dynamicWordRef.current,
            {
              opacity: 0,
              y: 20
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: 'power2.out'
            }
          )
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [words.length])

  return (
    <section ref={sectionRef} id="about" className={styles.whoami}>
      <div className={styles.container}>
        <h2 ref={titleRef} className={styles.title}>
          A <span ref={dynamicWordRef} className={styles.dynamicWord}>{words[currentWordIndex]}</span> frontend developer
        </h2>
        <div ref={descriptionRef} className={styles.description}>
          <p>
            I&apos;m a passionate frontend developer with a keen eye for detail and a commitment to creating
            exceptional user experiences. With expertise in modern web technologies, I transform ideas
            into interactive, responsive, and visually appealing digital solutions.
          </p>
          <p>
            My approach combines technical proficiency with creative problem-solving, ensuring that every
            project not only meets functional requirements but also delivers an intuitive and engaging
            user interface. I believe in writing clean, maintainable code that scales.
          </p>
        </div>

        <div className={styles.techSection}>
          <h3 className={styles.techTitle}>Technologies I Work With</h3>
          <div ref={techGridRef} className={styles.techGrid}>
            {technologies.map((tech, index) => (
              <div
                key={tech.name}
                className={styles.techItem}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className={styles.techIcon}>
                  <span className={styles.iconSvg}>{tech.icon}</span>
                </div>
                <span className={styles.techLabel}>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhoAmI