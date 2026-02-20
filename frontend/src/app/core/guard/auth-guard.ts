import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    if (authService.isAuthenticated()) {
      return true;
    }
    return router.createUrlTree(['auth/login']);
  }

  return true;
};
