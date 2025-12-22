import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import { routes } from './app.routes';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAuth, withAppInitializerAuthCheck, authInterceptor} from 'angular-auth-oidc-client';
import { oidcConfig } from './auth/oidc.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor()])),
    provideZonelessChangeDetection(),

    provideAuth(
      { config: oidcConfig },
      withAppInitializerAuthCheck()
    ),
  ],
};
