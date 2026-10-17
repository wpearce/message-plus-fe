import { REGISTRATION_GUIDE_STEPS } from './registration-guide.data';

describe('registration guide data', () => {
  it('gives every step a unique deep-link and localized copy', () => {
    const slugs = REGISTRATION_GUIDE_STEPS.map((step) => step.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    for (const step of REGISTRATION_GUIDE_STEPS) {
      expect(step.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      for (const language of ['en', 'pt'] as const) {
        expect(step.copy[language].explanation.trim()).toBeTruthy();
        expect(step.imageAlt[language].trim()).toBeTruthy();
        if (step.copy[language].title !== undefined) {
          expect(step.copy[language].title?.trim()).toBeTruthy();
        }
      }
      expect(step.image).toMatch(/^\/assets\/registration-guide\/.+\.(?:png|svg)$/);
    }
  });

  it('includes preparation, confirmation, completion, and troubleshooting steps', () => {
    expect(REGISTRATION_GUIDE_STEPS[0]?.slug).toBe('welcome');
    expect(REGISTRATION_GUIDE_STEPS[0]?.kind).toBe('intro');
    expect(REGISTRATION_GUIDE_STEPS.find((step) => step.slug === 'selfie')?.kind).toBe('step');
    expect(REGISTRATION_GUIDE_STEPS.find((step) => step.slug === 'confirmar')?.kind).toBe('step');
    expect(REGISTRATION_GUIDE_STEPS.find((step) => step.slug === 'sucesso')?.kind).toBe('success');
    expect(REGISTRATION_GUIDE_STEPS.at(-1)?.slug).toBe('error');
    expect(REGISTRATION_GUIDE_STEPS.at(-1)?.kind).toBe('error');
  });
});
