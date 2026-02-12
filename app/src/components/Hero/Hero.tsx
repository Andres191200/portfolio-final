"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./Hero.module.scss";
import Image from "next/image";

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const welcomeRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [currentWelcomeIndex, setCurrentWelcomeIndex] = useState(0);

  const welcomeMessages = [
    "Welcome to my portfolio! (In progress)",
    "Bienvenido a mi portafolio! (En progreso)",
    "Bem-vindo ao Meu portfólio! (Em andamento)",
    "Bienvenue dans mon portfolio! (En cours)",
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      // Glow light spreading from top to bottom
      gsap.set(glowRef.current, { transformOrigin: "top center" });
      tl.fromTo(
        glowRef.current,
        {
          opacity: 0,
          scaleY: 0,
          scaleX: 0.3,
        },
        {
          opacity: 1,
          scaleY: 1,
          scaleX: 1,
          duration: 1.2,
          ease: "power2.out",
        },
        0
      );

      tl.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      }, 0.3)
        .from(
          subtitleRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .from(
          ctaRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          avatarRef.current,
          {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.7)",
          },
          "-=1"
        );

      // Subtle pulsing glow animation
      gsap.to(glowRef.current, {
        opacity: 0.7,
        scaleY: 1.1,
        scaleX: 1.05,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 1.5,
      });

      // Floating animation for avatar
      gsap.to(avatarRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      gsap.to(welcomeRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setCurrentWelcomeIndex((prev) => (prev + 1) % welcomeMessages.length);
          gsap.fromTo(
            welcomeRef.current,
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "power2.out",
            }
          );
        },
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [welcomeMessages.length]);

  const scrollToProjects = () => {
    // Dispatch custom event for ScrollContainer to handle navigation
    window.dispatchEvent(new CustomEvent("navigateToSection", { detail: { index: 2 } }));
  };

  return (
    <section ref={sectionRef} id="hero" className={styles.hero}>
      {/* Glimmer light effect */}
      <div ref={glowRef} className={styles.glowLight} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.content}>
          <h1 ref={titleRef} className={styles.title}>
            <span ref={welcomeRef} className={styles.welcome}>
              {welcomeMessages[currentWelcomeIndex]}
            </span>
          </h1>
          <p ref={subtitleRef} className={styles.subtitle}>
            Crafting seamless web projects <span>since 2022</span>
          </p>
          <button
            ref={ctaRef}
            className={styles.cta}
            onClick={scrollToProjects}
          >
            View My Work
          </button>
        </div>
        
          <div ref={avatarRef} className={styles.avatar}>
              <Image alt="avatar" height={600} width={600} priority src="/avatar.png" />
          </div>

      </div>
    </section>
  );
};

export default Hero;
