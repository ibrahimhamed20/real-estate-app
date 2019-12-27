import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from './config';
import { map, catchError, finalize } from 'rxjs/operators';
import { ExceptionService } from './exception.service';

let usersUrl = CONFIG.baseUrls.user;
let loginUrl = CONFIG.baseUrls.login;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private _exceptionService: ExceptionService) { }

  checkAuth(data: FormData) {
    return this.http.post(loginUrl, data).pipe(
      map(response => {
        let temp = response;
        if (typeof temp === 'object' || Array.isArray(temp)) {
          return temp;
        }
        else {
          return [];
        }
      }),
      catchError(this._exceptionService.catchBadResponse),
      finalize(() => null));
  }

  getUserData(id: number) {
    const formData = new FormData();
    formData.append('userid', id.toString());
    return this.http.post(usersUrl, formData).pipe(
      map(response => {
        return response;
      }),
      catchError(this._exceptionService.catchBadResponse),
      finalize(() => null));
  }

  logout() {
    localStorage.clear();
    localStorage.removeItem('userData');
  }

  updateUserData(user: FormData) {
    return this.http.post(`${usersUrl}/update`, user).pipe(
      map(response => {
        return response;
      }),
      catchError(this._exceptionService.catchBadResponse),
      finalize(() => null));;
  }
}
