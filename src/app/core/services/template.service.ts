import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MessageTemplate } from '../models/message-template';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TemplatesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/templates`;

  getAll(): Observable<MessageTemplate[]> {
    return this.http.get<MessageTemplate[]>(`${this.baseUrl}?paged=false`);
  }

  getById(id: string): Observable<MessageTemplate> {
    return this.http.get<MessageTemplate>(`${this.baseUrl}/${id}`);
  }

  create(body: Omit<MessageTemplate, 'id'>): Observable<MessageTemplate> {
    return this.http.post<MessageTemplate>(this.baseUrl, body);
  }

  update(id: string, body: Partial<MessageTemplate>): Observable<MessageTemplate> {
    return this.http.put<MessageTemplate>(`${this.baseUrl}/${id}`, body);
  }
}
