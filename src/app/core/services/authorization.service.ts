import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  private readonly authService = inject(AuthService);

  readonly hasTemplatesWriteScope$ = this.authService.getAccessToken().pipe(
    map((token) => this.hasScope(token, 'templates_write'))
  );

  private hasScope(token: string | null | undefined, requiredScope: string): boolean {
    if (!token) return false;

    const payload = this.parseJwtPayload(token);
    if (!payload) return false;

    const scopeClaim = payload['scope'];
    if (typeof scopeClaim !== 'string') return false;

    return scopeClaim.split(' ').includes(requiredScope);
  }

  private parseJwtPayload(token: string): Record<string, unknown> | null {
    const [, payload] = token.split('.');
    if (!payload) return null;

    try {
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
      const decoded = atob(padded);
      return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}
