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
  const [currentWelcomeIndex, setCurrentWelcomeIndex] = useState(0);

  const welcomeMessages = [
    "Welcome to my portfolio!",
    "Bienvenido a mi portafolio!",
    "Bem-vindo ao Meu portfólio!",
    "Bienvenue dans mon portfolio!",
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      tl.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
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
    const element = document.getElementById("projects");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="hero" className={styles.hero}>
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
