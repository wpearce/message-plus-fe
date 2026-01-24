import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tag } from '../models/message-template';

@Injectable({ providedIn: 'root' })
export class TagService {
  private readonly http = inject(HttpClient);
  private readonly tagsBaseUrl = `${environment.apiBaseUrl}/tags`;
  private readonly cacheDurationMs = 2 * 60 * 1000;
  private cachedTags: Tag[] | null = null;
  private lastFetchedAt = 0;
  private inFlight$: Observable<Tag[]> | null = null;

  getAll(): Observable<Tag[]> {
    const now = Date.now();
    if (this.cachedTags && now - this.lastFetchedAt < this.cacheDurationMs) {
      return of(this.cachedTags);
    }

    if (this.inFlight$) {
      return this.inFlight$;
    }

    this.inFlight$ = this.http.get<Tag[]>(this.tagsBaseUrl).pipe(
      tap((tags) => {
        this.cachedTags = tags;
        this.lastFetchedAt = Date.now();
        this.inFlight$ = null;
      }),
      shareReplay(1)
    );

    return this.inFlight$;
  }
}
