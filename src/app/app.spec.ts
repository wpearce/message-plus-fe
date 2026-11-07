import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { APPEARANCE_STORAGE_KEY } from './core/services/appearance.service';

describe('App', () => {
  beforeEach(async () => {
    localStorage.removeItem(APPEARANCE_STORAGE_KEY);
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])]
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.removeItem(APPEARANCE_STORAGE_KEY);
    document.documentElement.removeAttribute('data-appearance');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand')?.textContent).toContain('Message+');
  });

  it('exposes the selected appearance through a persistent, accessible toggle', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const toggle = element.querySelector<HTMLInputElement>('.appearance-switch')!;
    const outlet = element.querySelector('router-outlet');

    expect(toggle.getAttribute('role')).toBe('switch');
    expect(toggle.checked).toBe(false);
    toggle.click();
    await fixture.whenStable();
    expect(toggle.checked).toBe(true);
    expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe('signal');
    expect(element.querySelector('router-outlet')).toBe(outlet);

    toggle.click();
    await fixture.whenStable();
    expect(toggle.checked).toBe(false);
    expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe('current');
  });
});
