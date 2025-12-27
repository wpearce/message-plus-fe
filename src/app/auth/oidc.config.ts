import { environment } from '../../environments/environment';
import { OpenIdConfiguration } from 'angular-auth-oidc-client';

export const oidcConfig: OpenIdConfiguration = {
  authority: environment.oidcAuthority,
  clientId: environment.oidcClientId,

  redirectUrl: window.location.origin + '/auth/callback',
  postLogoutRedirectUri: window.location.origin + '/',

  responseType: 'code',
  scope: environment.oidcScope,

  silentRenew: true,

  useRefreshToken: true,
  renewTimeBeforeTokenExpiresInSeconds: 300,

  secureRoutes: [environment.apiBaseUrl],
};
