import { HttpInterceptorFn } from '@angular/common/http';
import { UserService } from '../../services/user/user.service';
import { inject } from '@angular/core/primitives/di';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(UserService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
