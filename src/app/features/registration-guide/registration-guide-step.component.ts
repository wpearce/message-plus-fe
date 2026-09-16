import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { REGISTRATION_GUIDE_STEPS, GuideLanguage } from './registration-guide.data';

const STEP_KEY = 'messageplus.registrationGuide.step';
const LANGUAGE_KEY = 'messageplus.registrationGuide.language';

@Component({
  selector: 'mp-registration-guide-step',
  imports: [RouterLink],
  templateUrl: './registration-guide-step.component.html',
  styleUrl: './registration-guide-step.component.scss',
})
export default class RegistrationGuideStepComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly steps = REGISTRATION_GUIDE_STEPS;
  readonly language = signal<GuideLanguage>(this.savedLanguage());
  readonly index = signal(0);
  readonly step = computed(() => this.steps[this.index()]);
  readonly copy = computed(() => this.step().copy[this.language()]);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('step');
      const index = this.steps.findIndex((step) => step.slug === slug);
      if (index === -1) {
        const saved = localStorage.getItem(STEP_KEY);
        void this.router.navigate(
          [
            '/guide/registration',
            this.steps.some((step) => step.slug === saved) ? saved : 'welcome',
          ],
          { replaceUrl: true },
        );
        return;
      }
      this.index.set(index);
      localStorage.setItem(STEP_KEY, this.steps[index].slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    effect(() => localStorage.setItem(LANGUAGE_KEY, this.language()));
  }

  setLanguage(language: GuideLanguage): void {
    this.language.set(language);
  }

  private savedLanguage(): GuideLanguage {
    return localStorage.getItem(LANGUAGE_KEY) === 'pt' ? 'pt' : 'en';
  }
}
