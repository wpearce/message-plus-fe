import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

const ZITADEL_ROLES_CLAIM = 'urn:zitadel:iam:org:project:337686608499219119:roles';
const TEMPLATES_WRITE_ROLE = 'templates_write';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  private readonly authService = inject(AuthService);

  readonly hasTemplatesWriteScope$ = this.authService.getAccessToken().pipe(
    map((token) => this.hasTemplatesWritePermission(token))
  );

  private hasTemplatesWritePermission(token: string | null | undefined): boolean {
    if (!token) return false;

    const payload = this.parseJwtPayload(token);
    if (!payload) return false;

    const projectRoles = payload[ZITADEL_ROLES_CLAIM];
    if (!this.isRecord(projectRoles)) return false;

    const templatesWriteRole = projectRoles[TEMPLATES_WRITE_ROLE];
    return this.isRecord(templatesWriteRole) && Object.keys(templatesWriteRole).length > 0;
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

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
