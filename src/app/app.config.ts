import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import { routes } from './app.routes';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  provideAuth,
  withAppInitializerAuthCheck,
  authInterceptor,
  AbstractSecurityStorage, DefaultLocalStorageService
} from 'angular-auth-oidc-client';
import { oidcConfig } from './auth/oidc.config';
import {MatDialogModule} from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor()])),
    provideZonelessChangeDetection(),
    importProvidersFrom(MatDialogModule),

    provideAuth(
      { config: oidcConfig },
      withAppInitializerAuthCheck()
    ),

    { provide: AbstractSecurityStorage, useClass: DefaultLocalStorageService },
  ],
};
