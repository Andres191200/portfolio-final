'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import styles from './Hero.module.scss'

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const welcomeRef = useRef<HTMLSpanElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const [currentWelcomeIndex, setCurrentWelcomeIndex] = useState(0)

  const welcomeWords = ['Welcome', 'Bienvenido', 'Bem-vindo', 'Bienvenue']

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 })

      tl.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      })
      .from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.5')
      .from(ctaRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.4')
      .from(avatarRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)'
      }, '-=1')

      // Floating animation for avatar
      gsap.to(avatarRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      gsap.to(welcomeRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentWelcomeIndex((prev) => (prev + 1) % welcomeWords.length)
          gsap.fromTo(welcomeRef.current,
            {
              opacity: 0,
              y: 20
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out'
            }
          )
        }
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [welcomeWords.length])

  const scrollToProjects = () => {
    const element = document.getElementById('projects')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} id="hero" className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 ref={titleRef} className={styles.title}>
            <span ref={welcomeRef} className={styles.welcome}>
              {welcomeWords[currentWelcomeIndex]}
            </span> to My
            <span className={styles.accent}> Portfolio!</span>
          </h1>
          <p ref={subtitleRef} className={styles.subtitle}>
            Creating seamlessly experiences from 2022
          </p>
          <button ref={ctaRef} className={styles.cta} onClick={scrollToProjects}>
            View My Work
          </button>
        </div>
        <div className={styles.avatarContainer}>
          <div ref={avatarRef} className={styles.avatar}>
            <div className={styles.avatarPlaceholder}>
              <svg viewBox="0 0 200 200" className={styles.avatarSvg}>
                <defs>
                  <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="60" r="35" fill="url(#avatarGradient)" opacity="0.9" />
                <ellipse cx="100" cy="130" rx="45" ry="55" fill="url(#avatarGradient)" opacity="0.9" />
                <text x="100" y="110" textAnchor="middle" fill="#f5f5f5" fontSize="14" fontWeight="bold">
                  Ghibli Style
                </text>
                <text x="100" y="130" textAnchor="middle" fill="#f5f5f5" fontSize="12">
                  Avatar
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero