import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationCancellationCode, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmIdentity, LoginUser, RegisterUser } from '../Interfaces/user';
import jwt_decode from 'jwt-decode' 
import {nanoid} from 'nanoid';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http : HttpClient, 
    private router : Router
  ) { }

  private registerUrl: string = 'http://localhost:3000/u';
  private loginUrl: string = 'http://localhost:3000/u/login';
  private confirmUrl : string = 'http://localhost:3000/u/confirm';

  _sessionId: string | undefined = this.loggedIn() && this.getSessionIdFromToken() ? this.getSessionIdFromToken() : nanoid(21);
  _userId: string | undefined = this.loggedIn() && this.getUserIdFromToken() ? this.getUserIdFromToken() : `guest${nanoid(16)}`;

  registerUser (user : RegisterUser) : Observable<any>{
    return this.http.post<any>(this.registerUrl, user);
  }

  loginUser (user : LoginUser) : Observable<any> {
    return this.http.post<any>(this.loginUrl, user);
  }

  confirmIdentity(identity : ConfirmIdentity) : Observable<any> {
    return this.http.post<any>(this.confirmUrl, identity);
  }

  loggedIn () : boolean {
    return !!localStorage.getItem('token');
  }

  identityLoggedIn() : boolean {
    return !!localStorage.getItem('identity-token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUserIdFromToken() : string | undefined {
    let token = this.getToken();
    if (token !== null) {
      let userId : {userId : string, iat : number} = jwt_decode(token);
      return userId.userId
    } else {
      return undefined;
    }
  }

  logOut () : void {
    localStorage.removeItem('token');
    localStorage.removeItem('identity-token');
  }

  getSessionIdFromToken () : string | undefined {
    let token = this.getToken();
    if (token !== null) {
      let user : {userId : string, sessionId: string, iat : number} = jwt_decode(token);
      return user.sessionId
    } else {
      return undefined;
    }
  }
}
