import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tag } from '../models/message-template';

@Injectable({ providedIn: 'root' })
export class TagService {
  private readonly http = inject(HttpClient);
  private readonly tagsBaseUrl = `${environment.apiBaseUrl}/tags`;

  getAll(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.tagsBaseUrl);
  }
}
