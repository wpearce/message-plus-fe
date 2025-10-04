import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'mp-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="shell">
      <a class="brand" routerLink="/">Message+</a>
    </header>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    .shell { padding: 1rem; border-bottom: 1px solid #e5e7eb; }
    .brand { font-weight: 600; text-decoration: none; }
    main { padding: 1rem; }
  `]
})
export class AppComponent {}
