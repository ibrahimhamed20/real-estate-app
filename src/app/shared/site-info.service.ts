import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from './config';
import { ExceptionService } from './exception.service';
import { map, catchError, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
const aboutUrl = CONFIG.baseUrls.about;
const contactUrl = CONFIG.baseUrls.contact;

@Injectable({
  providedIn: 'root'
})
export class SiteInfoService {

  constructor(private http: HttpClient, private _exceptionService: ExceptionService) { }

  getAbout() {
    return this.http.get(aboutUrl, httpOptions)
      .pipe(
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
        finalize(() => null)
      );
  }

  getContact() {
    return this.http.get(contactUrl, httpOptions)
      .pipe(
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
        finalize(() => null)
      );
  }
}
