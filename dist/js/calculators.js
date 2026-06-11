import { mathCalculators } from './math.js';
import { financialCalculators } from './financial.js';
import { healthCalculators } from './health.js';
import { otherCalculators } from './other.js';

export const categories = {
  financial: {
    name: "Financial Calculators",
    description: "Manage your money with calculators for mortgages, loans, compound interest, and personal finance.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cat-icon"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`
  },
  health: {
    name: "Fitness & Health Calculators",
    description: "Track your body mass index (BMI), fitness goals, and general body health metrics.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cat-icon"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
  },
  math: {
    name: "Math Calculators",
    description: "Solve expressions, compute percentages, fractions, and handle scientific mathematics calculations.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cat-icon"><line x1="5" y1="9" x2="19" y2="9"></line><line x1="5" y1="15" x2="19" y2="15"></line><line x1="12" y1="5" x2="12" y2="19"></line></svg>`
  },
  other: {
    name: "Other Calculators",
    description: "Helpful daily calculators including age difference, date shifting, and time zone converters.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cat-icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
  }
};

export const calculators = [
  ...mathCalculators,
  ...financialCalculators,
  ...healthCalculators,
  ...otherCalculators
];
