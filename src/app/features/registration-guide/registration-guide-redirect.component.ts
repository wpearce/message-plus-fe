import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { REGISTRATION_GUIDE_STEPS } from './registration-guide.data';

@Component({
  selector: 'mp-registration-guide-redirect',
  template: '',
})
export default class RegistrationGuideRedirectComponent {
  constructor() {
    const router = inject(Router);
    const saved = localStorage.getItem('messageplus.registrationGuide.step');
    const destination = REGISTRATION_GUIDE_STEPS.some((step) => step.slug === saved)
      ? saved
      : 'welcome';

    void router.navigate(['/guide/registration', destination], { replaceUrl: true });
  }
}
