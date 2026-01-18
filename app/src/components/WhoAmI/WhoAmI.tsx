"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./WhoAmI.module.scss";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const WhoAmI = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const techGridRef = useRef<HTMLDivElement>(null);

  const technologies = [
    { name: "React", icon: "/react_logo.svg", background: "dark" },
    { name: "Next.js", icon: "/nextjs_logo.svg", background: "light" },
    { name: "TypeScript", icon: "/typescript_logo.svg", background: "dark" },
    { name: "HTML5", icon: "/html_logo.svg", background: "dark" },
    { name: "Sass", icon: "/sass_logo.svg", background: "dark" },
    { name: "GitHub", icon: "/github_logo.svg", background: "light" },
    { name: "Figma", icon: "/figma_logo.svg", background: "dark" },
    { name: "Firebase", icon: "/firebase_logo.svg", background: "dark" },
    { name: "Git", icon: "/git_logo.svg", background: "dark" },
    { name: "Flutter", icon: "/flutter_logo.svg", background: "dark" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }).from(
        descriptionRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // Tech icons animation
      const techItems = techGridRef.current?.children || [];

      gsap.from(techItems, {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: {
          amount: 0.8,
          from: "random",
        },
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: techGridRef.current,
          start: "top 85%",
          end: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      // Floating animation for each tech icon
      Array.from(techItems).forEach((item, index) => {
        const delay = index * 0.2;
        const duration = 2 + Math.random() * 2; // Random duration between 2-4 seconds

        gsap.to(item, {
          y: -15,
          rotation: 5 - (index % 3) * 5, // Slight rotation variation
          duration: duration,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: delay,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className={styles.whoami}>
      <div className={styles.container}>
        <div className={styles.mainInfo}>
          <h2 ref={titleRef} className={styles.title}>
            More than a developer
          </h2>
          <div ref={descriptionRef} className={styles.description}>
            <p>
              I&apos;m a passionate frontend  NextJS developer and UX/UI designer with a
              keen eye for detail and a commitment to creating exceptional user
              experiences. With almost 4 years expertise in modern web
              technologies, I transform ideas into interactive, responsive, and
              visually appealing digital solutions.
            </p>
          </div>
        </div>
        <div className={styles.techSection}>
          <h3>My tech stack</h3>
          <div ref={techGridRef} className={styles.techGrid}>
            {technologies.map((tech) => (
              <div key={tech.name} className={styles.techItem} title={tech.name}>
                <Image src={tech.icon} alt={tech.name} height={50} width={50} className={tech.background === "light" ? styles.lightBackground : styles.darkBackground}/>
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoAmI;
