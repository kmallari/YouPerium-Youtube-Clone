import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import {

  HttpEvent,
 
  HttpInterceptor,
 
  HttpHandler,
 
  HttpRequest,
 
  HttpErrorResponse
 
 } from '@angular/common/http';
 
 import { Observable, throwError } from 'rxjs';
 
 import { catchError } from 'rxjs/operators';
declare let alertify : any;

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements HttpInterceptor {

  constructor(
    private authService : AuthService,
    private router : Router,
  ) {}

  intercept(
    request : HttpRequest<any>,
    next : HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 404 || error.status === 400) {
            if (error.error.customCode === 1010) {
              alertify.error("invalid username or email");
            }
            if (error.error.customCode == 1012) {
              alertify.error("Incorrect password");
            }
          } else if (error.status === 401) {
            alertify.error(error.error.message);
            this.authService.logOut();
            this.router.navigate(['']);
          }
          return throwError(() => error);
        } else {
          return throwError(() => error);
        }
      })
    )
  }
}
