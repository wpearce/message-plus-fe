import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthorizationService } from '../services/authorization.service';

export const templatesWriteGuard: CanActivateFn = () => {
  const authorizationService = inject(AuthorizationService);
  const router = inject(Router);

  return authorizationService.hasTemplatesWriteScope$.pipe(
    map((hasWriteScope) => hasWriteScope ? true : router.createUrlTree(['/']))
  );
};
