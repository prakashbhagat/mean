import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { SnackbarService } from '../../shared/service/snackbar';
import { inject } from '@angular/core'; 
import { UserService } from '../../services/user/user.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbar = inject(SnackbarService);
  const userService = inject(UserService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('HTTP Error Interceptor:', error);

      if (error.status === 401) {
        snackbar.error('Session expired. Please login again.');
        userService.logout();
      } else if (error.status >= 400 && error.status < 500) {
        snackbar.error(`${error.error.message || 'Client Error'}`);
      } else if (error.status >= 500) {
        snackbar.error(`${error.error.message || 'Server Error'}`);
      } else {
        snackbar.info('Something unexpected happened!');
      }

      return throwError(() => error);
    })
  );
};
