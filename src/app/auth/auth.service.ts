import { Injectable, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map } from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly oidc = inject(OidcSecurityService);

  // Emits login state
  readonly isAuthenticated$ = this.oidc.isAuthenticated$.pipe(map(x => x.isAuthenticated));

  // Current access token
  getAccessToken(): Observable<string> {
    return this.oidc.getAccessToken();
  }

  login(): void {
    this.oidc.authorize();
  }

  logout(): void {
    this.oidc.logoff().subscribe();
  }

  // call this on /auth/callback
  handleCallback() {
    return this.oidc.checkAuth();
  }
}
