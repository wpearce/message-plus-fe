import { REGISTRATION_GUIDE_STEPS } from './registration-guide.data';

describe('registration guide data', () => {
  it('gives every step a unique deep-link and localized copy', () => {
    const slugs = REGISTRATION_GUIDE_STEPS.map((step) => step.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    for (const step of REGISTRATION_GUIDE_STEPS) {
      expect(step.copy.en.title).toBeTruthy();
      expect(step.copy.pt.title).toBeTruthy();
      expect(step.image).toMatch(/^\/assets\/registration-guide\/.+\.svg$/);
    }
  });

  it('includes preparation, troubleshooting, and completion steps', () => {
    expect(REGISTRATION_GUIDE_STEPS.some((step) => step.slug === 'face-scan')).toBe(true);
    expect(REGISTRATION_GUIDE_STEPS.filter((step) => step.kind === 'error').length).toBeGreaterThan(
      0,
    );
    expect(REGISTRATION_GUIDE_STEPS.at(-1)?.kind).toBe('success');
  });
});
