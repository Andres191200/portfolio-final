"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ScrollContainer.module.scss";
import Hero from "../Hero/Hero";
import WhoAmI from "../WhoAmI/WhoAmI";
import Projects from "../Projects/Projects";
import Contact from "../Contact/Contact";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { id: "hero", label: "Home", Component: Hero },
  { id: "whoami", label: "About", Component: WhoAmI },
  { id: "projects", label: "Work", Component: Projects },
  { id: "contact", label: "Contact", Component: Contact },
];

const ScrollContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Wait for next frame to ensure DOM is fully rendered
    const timeoutId = setTimeout(() => {
      const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=300%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          snap: {
            snapTo: 1 / 3, // 4 sections = 3 transitions, snap every 1/3
            duration: { min: 0.2, max: 0.6 },
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            const progress = self.progress;
            const sectionIndex = Math.floor(progress * 4);
            setActiveSection(Math.min(sectionIndex, 3));
          },
        },
      });

      // Hero to WhoAmI - Staggered Columns
      const whoamiSection = sectionsRef.current[1];
      if (whoamiSection) {
        const columns = whoamiSection.querySelectorAll(`.${styles.columnMask}`);

        tl.set(whoamiSection, { visibility: "visible", zIndex: 2 })
          .fromTo(
            columns.length > 0 ? columns : whoamiSection,
            {
              scaleY: 0,
              transformOrigin: "top center",
            },
            {
              scaleY: 1,
              duration: 1,
              stagger: {
                each: 0.1,
                from: "random",
              },
              ease: "power3.inOut",
            },
            0
          )
          .fromTo(
            whoamiSection.querySelector(`.${styles.sectionContent}`) || whoamiSection,
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
            },
            0.5
          )
          .to(
            sectionsRef.current[0]!.querySelector(`.${styles.sectionContent}`),
            {
              opacity: 0,
              scale: 0.95,
              duration: 1,
              ease: "power2.inOut",
            },
            0
          );

        // Additional animations for WhoAmI elements
        const whoamiContent = whoamiSection.querySelector(`.${styles.sectionContent}`);
        if (whoamiContent && whoamiContent.children.length > 0) {
          tl.fromTo(
            whoamiContent.children,
            {
              y: 30,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out",
            },
            0.8
          );
        }
      }

      // WhoAmI to Projects - Mask Reveal from Right
      const projectsSection = sectionsRef.current[2];
      if (projectsSection) {
        tl.set(projectsSection, { visibility: "visible", zIndex: 3 })
          .fromTo(
            projectsSection.querySelector(`.${styles.maskReveal}`) || projectsSection,
            {
              clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
            },
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              duration: 1.2,
              ease: "power3.inOut",
            }
          )
          .fromTo(
            projectsSection.querySelector(`.${styles.sectionContent}`) || projectsSection,
            {
              opacity: 0,
              x: 100,
            },
            {
              opacity: 1,
              x: 0,
              duration: 1,
              ease: "power2.out",
            },
            "-=0.8"
          )
          .to(
            whoamiSection,
            {
              opacity: 0,
              x: -100,
              duration: 1,
              ease: "power2.inOut",
            },
            "-=1.2"
          );

        // Additional animations for Projects elements
        const projectsContent = projectsSection.querySelector(`.${styles.sectionContent}`);
        if (projectsContent && projectsContent.children.length > 0) {
          tl.fromTo(
            projectsContent.children,
            {
              x: 50,
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.05,
              ease: "power2.out",
            },
            "-=0.5"
          );
        }
      }

      // Projects to Contact - Wave Scale Up
      const contactSection = sectionsRef.current[3];
      if (contactSection) {
        tl.set(contactSection, { visibility: "visible", zIndex: 4 })
          .fromTo(
            contactSection,
            {
              scale: 0,
              rotation: 5,
              transformOrigin: "center center",
            },
            {
              scale: 1,
              rotation: 0,
              duration: 1,
              ease: "back.out(1.5)",
            }
          )
          .fromTo(
            contactSection.querySelector(`.${styles.sectionContent}`) || contactSection,
            {
              opacity: 0,
              y: 50,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
            },
            "-=0.5"
          )
          .to(
            projectsSection,
            {
              scale: 0.9,
              opacity: 0,
              duration: 1,
              ease: "power2.inOut",
            },
            "-=1"
          );

        // Additional animations for Contact elements
        const contactContent = contactSection.querySelector(`.${styles.sectionContent}`);
        if (contactContent && contactContent.children.length > 0) {
          tl.fromTo(
            contactContent.children,
            {
              scale: 0.9,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              stagger: 0.05,
              ease: "power2.out",
            },
            "-=0.5"
          );
        }
      }
      }, container);

      return () => ctx.revert();
    }, 100); // Small delay to ensure components are mounted

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.scrollContainer}>
      {/* Persistent background pattern */}
      <div className={styles.backgroundPattern} aria-hidden="true" />

      {/* Navigation Dots */}
      <div className={styles.navDots} aria-hidden="true">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`${styles.dot} ${
              activeSection === index ? styles.active : ""
            }`}
            title={section.label}
          >
            <span className={styles.dotInner} />
          </div>
        ))}
      </div>

      {/* Sections */}
      {sections.map((section, index) => {
        const { Component, id } = section;
        return (
          <section
            key={id}
            ref={(el) => {sectionsRef.current[index] = el}}
            className={`${styles.section} ${styles[`section-${id}`]}`}
            style={{ visibility: index === 0 ? "visible" : "hidden" }}
          >
            {/* Transition Masks */}
            {index === 1 && (
              <div className={styles.columnMasks}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={styles.columnMask} />
                ))}
              </div>
            )}
            {index === 2 && <div className={styles.maskReveal} />}

            <div className={styles.sectionContent}>
              <Component />
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ScrollContainer;