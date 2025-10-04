import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MessageTemplate } from '../models/message-template';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TemplatesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/templates?paged=false`;

  getAll(): Observable<MessageTemplate[]> {
    return this.http.get<MessageTemplate[]>(this.baseUrl);
  }
}
