'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './Navbar.module.scss'

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.from(logoRef.current, {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })
      .from(linksRef.current?.children || [], {
        y: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      }, '-=0.4')
    }, navRef)

    return () => ctx.revert()
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav ref={navRef} className={styles.navbar}>
      <div className={styles.container}>
        <div ref={logoRef} className={styles.logo}>
          Portfolio
        </div>
        <ul ref={linksRef} className={styles.navLinks}>
          <li>
            <button onClick={() => scrollToSection('hero')}>Home</button>
          </li>
          <li>
            <button onClick={() => scrollToSection('about')}>About</button>
          </li>
          <li>
            <button onClick={() => scrollToSection('projects')}>Projects</button>
          </li>
          <li>
            <button onClick={() => scrollToSection('contact')}>Contact</button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar