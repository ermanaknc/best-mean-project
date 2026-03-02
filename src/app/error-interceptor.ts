import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { ErrorComponent } from './error/error.component';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const dialog = inject(MatDialog);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = error?.error?.message ?? 'An unexpected error occurred. Please try again later.';
      dialog.open(ErrorComponent, { data: { message } });
      return throwError(() => error);
    })
  );
};
