import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, debounceTime, distinctUntilChanged, map, Subject} from 'rxjs';
import { Injectable } from '@angular/core';
import { ChangePassword, PatchUser, ReceivedBannerUrl, ReceivedImageUrl, ReceivedPatchUser, ReceivedSubscriptions, ReceivedUser, User } from '../Interfaces/user';
import { NewSubscribe, SubscriptionResponse } from '../Interfaces/subscribe';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userInfo$ = new BehaviorSubject<any>({});
  selectedUser$ = this.userInfo$.asObservable();

  private userItem$ = new Subject<User>();
  currentUser$ = this.userItem$.asObservable();

  private requestUser$ = new Subject<null>();
  observeRequest$ = this.requestUser$.asObservable();

  private fromAnalytics$ = new Subject<boolean>();
  observeStudio$ = this.fromAnalytics$.asObservable();

  private sideToggle = new Subject<null>();
  sideToggle$ = this.sideToggle.asObservable();

  setUser(user: any) {
    this.userInfo$.next(user);
  }

  userRoute: string = 'http://localhost:3000/u'
  constructor(
    private http: HttpClient
  ) { }

  userItem(user: User): void {
    this.userItem$.next(user);
  }

  requestUser(): void {
    this.requestUser$.next(null);
  }

  fromAnalytics(analytics: boolean): void {
    this.fromAnalytics$.next(analytics);
  }

  onSideToggle(): void {
    this.sideToggle.next(null);
  }

  getUserById(id: string | undefined): Observable<ReceivedUser> {
    return this.http.get<ReceivedUser>(this.userRoute + `/id/${id}`);
  }

  getUserByUsername(username: string): Observable<ReceivedUser> {
    return this.http.get<ReceivedUser>(this.userRoute + `/${username}`);
  }

  subscriptionCheck(subscirbeeID : string | undefined): Observable<SubscriptionResponse> {
    return this.http.get<SubscriptionResponse>(this.userRoute + `/subscribed/${subscirbeeID}`);
  }

  subscribe(userName : string) : Observable<any> {
    return this.http.post<any>(this.userRoute + `/${userName}/subscribe`, null);
  }

  unsubscribe(userName : string) : Observable<any> {
    return this.http.post<any>(this.userRoute + `/${userName}/unsubscribe`, null);
  }

  changePassword(cp : ChangePassword) : Observable<any> {
    return this.http.post<any>(this.userRoute + `/changePassword`, cp);
  }

  updateProfilePicture(fd : FormData, userId : string | undefined) : Observable<ReceivedImageUrl> {
    return this.http.post<ReceivedImageUrl>(this.userRoute + `/uploadProfilePicture/${userId}`, fd);
  }

  updateChannelBanner(fd : FormData, userId : string | undefined) : Observable<ReceivedBannerUrl> {
    return this.http.post<ReceivedBannerUrl>(this.userRoute + `/uploadChannelBanner/${userId}`, fd);
  }

  patchUser(sendData : PatchUser) : Observable<ReceivedPatchUser> {
    return this.http.patch<ReceivedPatchUser>(this.userRoute, sendData);
  }

  getSubscriptions() : Observable<ReceivedSubscriptions>{
    return this.http.get<ReceivedSubscriptions>(this.userRoute + `/subscriptions`);
  }

  userAsyncValidator() : AsyncValidatorFn {
    return (control : AbstractControl) : Observable<ValidationErrors | null> => {
      if (String(control.value).length === 0) {
        return of(null)
      } else {
        let pattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
        let url = ""
        if (control.value.match(pattern) == null) {
          url = this.userRoute + `/check?type=username`
        } else {
          url = this.userRoute + `/check?type=email`
        }

        return this.http.post<any>(url, {value: control.value}).pipe(
          debounceTime(1000),
          distinctUntilChanged(),
          map((response) => (response.data.user? {userExists : true} : null))
        )
      }
    }
      
  }
}
