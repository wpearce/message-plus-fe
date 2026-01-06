import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MessageTemplate } from '../models/message-template';
import { Observable } from 'rxjs';
import {AiResponse} from '../models/AiResponse';

@Injectable({ providedIn: 'root' })
export class TemplatesService {
  private readonly http = inject(HttpClient);
  private readonly templatesBaseUrl = `${environment.apiBaseUrl}/templates`;
  private readonly aiBaseUrl = `${environment.apiBaseUrl}/ai`;

  getAll(): Observable<MessageTemplate[]> {
    return this.http.get<MessageTemplate[]>(`${this.templatesBaseUrl}?paged=false`);
  }

  getById(id: string): Observable<MessageTemplate> {
    return this.http.get<MessageTemplate>(`${this.templatesBaseUrl}/${id}`);
  }

  create(body: Omit<MessageTemplate, 'id'>): Observable<MessageTemplate> {
    return this.http.post<MessageTemplate>(this.templatesBaseUrl, body);
  }

  update(id: string, body: Partial<MessageTemplate>): Observable<MessageTemplate> {
    return this.http.put<MessageTemplate>(`${this.templatesBaseUrl}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.templatesBaseUrl}/${id}`);
  }

  improveText(text: string): Observable<AiResponse> {
    return this.http.post<AiResponse>(`${this.aiBaseUrl}/improve`, { model: 'GPT4o', prompt: text});
  }

  translateText(text: string): Observable<AiResponse> {
    return this.http.post<AiResponse>(`${this.aiBaseUrl}/translate`, { model: 'GPT4o', prompt: text});

  }
}
