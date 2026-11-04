// Bridge between the Hero (owns its frames) and ScrollContainer (owns section navigation)
type HeroStep = (direction: 1 | -1) => boolean;

let step: HeroStep | null = null;

export const registerHeroStep = (fn: HeroStep) => {
  step = fn;
  return () => {
    if (step === fn) step = null;
  };
};

// Returns true when the hero consumed the gesture, so the section must not change
export const heroStep = (direction: 1 | -1) => step?.(direction) ?? false;
