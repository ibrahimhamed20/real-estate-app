import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { CONFIG } from './config';
import { map, catchError, finalize } from 'rxjs/operators';
import { ExceptionService } from 'src/app/shared/exception.service';

let settingUrl = CONFIG.baseUrls.settings;

let headers = new HttpHeaders();
headers.append('Content-Type', 'multipart/form-data');
let params = new HttpParams();
const options = {
  headers: headers,
  params: params,
  reportProgress: true
};


@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient, private _exceptionService: ExceptionService) { }

  setSettingData(setting: FormData) {
    return this.http.post(`${settingUrl}/create`, setting);
  }

  updateSettingData(setting: FormData) {
    return this.http.post(`${settingUrl}/update`, setting);
  }

  getSettingData() {
    return this.http.get(settingUrl).pipe(
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
}
