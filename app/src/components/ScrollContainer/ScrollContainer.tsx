"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import styles from "./ScrollContainer.module.scss";
import Hero from "../Hero/Hero";
import WhoAmI from "../WhoAmI/WhoAmI";
import Projects from "../Projects/Projects";
import Contact from "../Contact/Contact";

gsap.registerPlugin(Observer);

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
  const isAnimatingRef = useRef(false);
  const currentIndexRef = useRef(0);

  // Navigate to a specific section
  const goToSection = useCallback((index: number, direction: 1 | -1) => {
    // Clamp index to valid range
    const targetIndex = Math.max(0, Math.min(sections.length - 1, index));

    // Don't animate if already at target or currently animating
    if (targetIndex === currentIndexRef.current || isAnimatingRef.current) {
      return;
    }

    isAnimatingRef.current = true;
    const currentSection = sectionsRef.current[currentIndexRef.current];
    const targetSection = sectionsRef.current[targetIndex];

    if (!currentSection || !targetSection) {
      isAnimatingRef.current = false;
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        currentIndexRef.current = targetIndex;
        setActiveSection(targetIndex);
        isAnimatingRef.current = false;
      },
    });

    // Get content elements
    const currentContent = currentSection.querySelector(`.${styles.sectionContent}`);
    const targetContent = targetSection.querySelector(`.${styles.sectionContent}`);

    if (direction === 1) {
      // Scrolling DOWN - next section

      // Animate out current section
      tl.to(currentContent, {
        opacity: 0,
        scale: 0.95,
        y: -30,
        duration: 0.5,
        ease: "power2.inOut",
      }, 0);

      // Make target visible and animate in
      tl.set(targetSection, { visibility: "visible", zIndex: targetIndex + 1 }, 0);

      // Different entrance animations based on section
      if (targetIndex === 1) {
        // Hero to WhoAmI - Column reveal
        const columns = targetSection.querySelectorAll(`.${styles.columnMask}`);
        if (columns.length > 0) {
          tl.fromTo(columns,
            { scaleY: 0, transformOrigin: "top center" },
            { scaleY: 1, duration: 0.6, stagger: { each: 0.08, from: "random" }, ease: "power3.inOut" },
            0
          );
        }
        tl.fromTo(targetContent,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          0.3
        );
      } else if (targetIndex === 2) {
        // WhoAmI to Projects - Mask reveal from right
        const mask = targetSection.querySelector(`.${styles.maskReveal}`);
        if (mask) {
          tl.fromTo(mask,
            { clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" },
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 0.8, ease: "power3.inOut" },
            0
          );
        }
        tl.fromTo(targetContent,
          { opacity: 0, x: 60 },
          { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
          0.2
        );
      } else if (targetIndex === 3) {
        // Projects to Contact - Scale up
        tl.fromTo(targetSection,
          { scale: 0.9, transformOrigin: "center center" },
          { scale: 1, duration: 0.6, ease: "power2.out" },
          0
        );
        tl.fromTo(targetContent,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          0.2
        );
      }

    } else {
      // Scrolling UP - previous section

      // Make target section visible first
      tl.set(targetSection, { visibility: "visible", zIndex: targetIndex + 1 }, 0);

      // Animate out current section
      tl.to(currentContent, {
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: "power2.inOut",
      }, 0);

      // Reset current section's special elements
      if (currentIndexRef.current === 1) {
        const columns = currentSection.querySelectorAll(`.${styles.columnMask}`);
        tl.to(columns, { scaleY: 0, duration: 0.4, ease: "power2.in" }, 0);
      } else if (currentIndexRef.current === 2) {
        const mask = currentSection.querySelector(`.${styles.maskReveal}`);
        if (mask) {
          tl.to(mask, { clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)", duration: 0.4 }, 0);
        }
      } else if (currentIndexRef.current === 3) {
        tl.to(currentSection, { scale: 0.9, duration: 0.4 }, 0);
      }

      // Hide current after animation
      tl.set(currentSection, { visibility: "hidden", zIndex: 0 }, 0.5);

      // Animate in previous section
      tl.fromTo(targetContent,
        { opacity: 0, scale: 0.98, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" },
        0.2
      );
    }

  }, []);

  // Handle navigation dot clicks
  const handleDotClick = useCallback((index: number) => {
    if (index === currentIndexRef.current || isAnimatingRef.current) return;
    const direction = index > currentIndexRef.current ? 1 : -1;
    goToSection(index, direction as 1 | -1);
  }, [goToSection]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      // Create Observer for scroll hijacking
      const observer = Observer.create({
        target: container,
        type: "wheel,touch,pointer",
        tolerance: 10,
        preventDefault: true,
        onDown: (self) => {
          // Block scroll at last section
          if (currentIndexRef.current >= sections.length - 1) {
            self.disable();
            setTimeout(() => self.enable(), 100);
            return;
          }
          // Scroll down = go to next section
          if (!isAnimatingRef.current) {
            goToSection(currentIndexRef.current + 1, 1);
          }
        },
        onUp: (self) => {
          // Block scroll at first section
          if (currentIndexRef.current <= 0) {
            self.disable();
            setTimeout(() => self.enable(), 100);
            return;
          }
          // Scroll up = go to previous section
          if (!isAnimatingRef.current) {
            goToSection(currentIndexRef.current - 1, -1);
          }
        },
      });

      // Keyboard navigation
      const handleKeyDown = (e: KeyboardEvent) => {
        if (isAnimatingRef.current) return;

        if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
          e.preventDefault();
          if (currentIndexRef.current < sections.length - 1) {
            goToSection(currentIndexRef.current + 1, 1);
          }
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          if (currentIndexRef.current > 0) {
            goToSection(currentIndexRef.current - 1, -1);
          }
        } else if (e.key === "Home") {
          e.preventDefault();
          goToSection(0, -1);
        } else if (e.key === "End") {
          e.preventDefault();
          goToSection(sections.length - 1, 1);
        }
      };

      // Custom event listener for programmatic navigation (e.g., from buttons)
      const handleNavigateToSection = (e: CustomEvent<{ index: number }>) => {
        const targetIndex = e.detail.index;
        if (targetIndex !== currentIndexRef.current && !isAnimatingRef.current) {
          const direction = targetIndex > currentIndexRef.current ? 1 : -1;
          goToSection(targetIndex, direction as 1 | -1);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("navigateToSection", handleNavigateToSection as EventListener);

      return () => {
        observer.kill();
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("navigateToSection", handleNavigateToSection as EventListener);
      };
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [goToSection]);

  return (
    <div ref={containerRef} className={styles.scrollContainer}>
      {/* Persistent background pattern */}
      <div className={styles.backgroundPattern} aria-hidden="true" />

      {/* Navigation Dots */}
      <nav className={styles.navDots} aria-label="Section navigation">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`${styles.dot} ${
              activeSection === index ? styles.active : ""
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to ${section.label} section`}
            aria-current={activeSection === index ? "true" : undefined}
          >
            <span className={styles.dotLabel}>{section.label}</span>
            <span className={styles.dotInner} />
          </button>
        ))}
      </nav>

      {/* Sections */}
      {sections.map((section, index) => {
        const { Component, id } = section;
        return (
          <section
            key={id}
            ref={(el) => {sectionsRef.current[index] = el}}
            className={`${styles.section} ${styles[`section-${id}`]}`}
            style={{
              visibility: index === 0 ? "visible" : "hidden",
              zIndex: index === 0 ? 1 : 0,
            }}
            aria-hidden={activeSection !== index}
          >
            {/* Transition Masks */}
            {index === 1 && (
              <div className={styles.columnMasks} aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={styles.columnMask} />
                ))}
              </div>
            )}
            {index === 2 && <div className={styles.maskReveal} aria-hidden="true" />}

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
