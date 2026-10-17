import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { TagService } from '../../core/services/tag.service';
import { AuthorizationService } from '../../core/services/authorization.service';
import TemplatesListComponent from './templates-list.component';

describe('TemplatesListComponent pagination', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatesListComponent],
      providers: [
        provideZonelessChangeDetection(), provideRouter([]),
        provideHttpClient(), provideHttpClientTesting(),
        { provide: TagService, useValue: { getAll: () => of([{ id: 'tag-1', name: 'Welcome' }]) } },
        { provide: AuthorizationService, useValue: { hasTemplatesWriteScope$: of(true) } },
        { provide: OidcSecurityService, useValue: {} },
        { provide: MatDialog, useValue: { open: vi.fn(() => ({ afterClosed: () => of(true) })) } },
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function request(page: number) {
    const req = http.expectOne(r => r.method === 'GET' && r.url.endsWith('/templates'));
    expect(req.request.params.get('page')).toBe(String(page));
    expect(req.request.params.get('size')).toBe('5');
    expect(req.request.params.has('paged')).toBe(false);
    return req;
  }

  function response(number: number, totalElements: number) {
    return {
      content: totalElements > 0 ? [{ id: 'template-1', title: `Message on page ${number + 1}` }] : [],
      number, size: 5, totalElements, totalPages: Math.ceil(totalElements / 5),
    };
  }

  it('loads server pages using the next/back buttons and displays page counts', async () => {
    const fixture = TestBed.createComponent(TemplatesListComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const paginator = element.querySelector<HTMLElement>('mat-paginator')!;
    expect(element.querySelector('p[role="status"]')?.textContent).toBe('Loading…');
    expect(paginator.style.display).toBe('none');
    request(0).flush(response(0, 11));
    await fixture.whenStable();
    expect(element.querySelector('p[role="status"]')).toBeNull();
    expect(paginator.style.display).toBe('');
    const next = () => element.querySelector<HTMLButtonElement>('.mat-mdc-paginator-navigation-next')!;
    const back = () => element.querySelector<HTMLButtonElement>('.mat-mdc-paginator-navigation-previous')!;
    expect(element.textContent).toContain('Page 1 of 3');
    expect(back().getAttribute('aria-disabled')).toBe('true');
    next().click();
    await fixture.whenStable();
    expect(element.querySelector('p[role="status"]')?.textContent).toBe('Loading…');
    expect(paginator.style.display).toBe('none');
    expect(next().getAttribute('aria-disabled')).toBe('true');
    request(1).flush(response(1, 11));
    await fixture.whenStable();
    expect(element.querySelector('p[role="status"]')).toBeNull();
    expect(paginator.style.display).toBe('');
    expect(element.textContent).toContain('Page 2 of 3');
    next().click();
    request(2).flush(response(2, 11));
    await fixture.whenStable();
    expect(element.textContent).toContain('Page 3 of 3');
    expect(next().getAttribute('aria-disabled')).toBe('true');
    back().click();
    request(1).flush(response(1, 11));
    await fixture.whenStable();
    expect(element.textContent).toContain('Page 2 of 3');
  });

  it('resets filters to the first page and cancels stale requests', () => {
    const fixture = TestBed.createComponent(TemplatesListComponent);
    request(0).flush(response(0, 11));
    fixture.componentInstance.onPageChanged({ pageIndex: 2, pageSize: 5, length: 11 });
    const stale = request(2);
    fixture.componentInstance.onTagSelectionChanged(['tag-1']);
    expect(stale.cancelled).toBe(true);
    const filtered = request(0);
    expect(filtered.request.params.getAll('tagNames')).toEqual(['Welcome']);
    filtered.flush(response(0, 0));
    expect(fixture.componentInstance.totalPages()).toBe(0);
    expect(fixture.componentInstance.templates()).toEqual([]);
  });

  it('returns to the last available page after deleting its final item', () => {
    const fixture = TestBed.createComponent(TemplatesListComponent);
    fixture.autoDetectChanges();
    request(0).flush(response(0, 6));
    fixture.componentInstance.onPageChanged({ pageIndex: 1, pageSize: 5, length: 6 });
    request(1).flush(response(1, 6));
    fixture.componentInstance.onDeleteRequested({ id: 'template-1', title: 'Delete me' });
    http.expectOne(r => r.method === 'DELETE').flush(null);
    request(1).flush({ ...response(1, 5), content: [] });
    request(0).flush(response(0, 5));
    expect(fixture.componentInstance.pageIndex()).toBe(0);
    expect(fixture.componentInstance.totalPages()).toBe(1);
    expect(fixture.componentInstance.templates()).toHaveLength(1);
  });

  it('can navigate again after a failed page request', async () => {
    const fixture = TestBed.createComponent(TemplatesListComponent);
    fixture.autoDetectChanges();
    request(0).flush(response(0, 6));
    await fixture.whenStable();
    const next = fixture.nativeElement.querySelector('.mat-mdc-paginator-navigation-next') as HTMLButtonElement;
    next.click();
    request(1).flush('Unavailable', { status: 500, statusText: 'Error' });
    await fixture.whenStable();
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.componentInstance.error()).toBe('Failed to load templates.');
    next.click();
    request(1).flush(response(1, 6));
    expect(fixture.componentInstance.error()).toBeNull();
    expect(fixture.componentInstance.pageIndex()).toBe(1);
  });
});
