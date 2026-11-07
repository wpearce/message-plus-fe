import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { vi } from 'vitest';
import { APPEARANCE_STORAGE_KEY, AppearanceService } from './appearance.service';

describe('AppearanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    localStorage.removeItem(APPEARANCE_STORAGE_KEY);
    document.documentElement.removeAttribute('data-appearance');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.removeItem(APPEARANCE_STORAGE_KEY);
    document.documentElement.removeAttribute('data-appearance');
  });

  it('defaults to the current UI without changing unrelated preferences', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const service = TestBed.inject(AppearanceService);
    expect(service.appearance()).toBe('current');
    expect(document.documentElement.dataset['appearance']).toBe('current');
    expect(setItem).not.toHaveBeenCalled();
  });

  it('persists both toggle states and restores the preference in a new app instance', () => {
    const service = TestBed.inject(AppearanceService);
    service.toggle();
    expect(service.appearance()).toBe('signal');
    expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe('signal');
    expect(document.documentElement.dataset['appearance']).toBe('signal');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const restored = TestBed.inject(AppearanceService);
    expect(restored.appearance()).toBe('signal');
    restored.toggle();
    expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe('current');
    expect(document.documentElement.dataset['appearance']).toBe('current');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    expect(TestBed.inject(AppearanceService).appearance()).toBe('current');
  });

  it('treats an unknown saved value as the current UI', () => {
    localStorage.setItem(APPEARANCE_STORAGE_KEY, 'invalid');
    expect(TestBed.inject(AppearanceService).appearance()).toBe('current');
  });

  it('still switches appearances when reading and writing storage are blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Blocked'); });
    const service = TestBed.inject(AppearanceService);
    expect(service.appearance()).toBe('current');
    expect(() => service.toggle()).not.toThrow();
    expect(service.appearance()).toBe('signal');
    expect(document.documentElement.dataset['appearance']).toBe('signal');
  });
});
