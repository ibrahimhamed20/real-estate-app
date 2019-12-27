import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from './config';
import { ExceptionService } from './exception.service';
import { map, catchError, finalize } from 'rxjs/operators';

let articlesUrl = CONFIG.baseUrls.articles;
let articleUrl = CONFIG.baseUrls.article;

@Injectable({
  providedIn: 'root'
})
export class ArticlesControlService {

  constructor(private http: HttpClient, private _exceptionService: ExceptionService) { }

  getAll() {
    return this.http.get(articlesUrl).pipe(
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
  getById(id: number) {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post(articleUrl, formData
    ).pipe(
      map(response => {
        return response;
      }),
      catchError(this._exceptionService.catchBadResponse),
      finalize(() => null));
  }

  create(article: FormData) {
    return this.http.post(`${articleUrl}/create`, article
    ).pipe(
      map(response => {
        return response;
      }),
      catchError(this._exceptionService.catchBadResponse),
      finalize(() => null));
  }

  update(article: FormData) {
    return this.http.post(`${articleUrl}/update`, article
    ).pipe(
      map(response => {
        return response;
      }),
      catchError(this._exceptionService.catchBadResponse),
      finalize(() => null));
  }

  delete(id: number) {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post(`${articleUrl}/delete`, formData
    ).pipe(
      map(response => {
        return response;
      }),
      catchError(this._exceptionService.catchBadResponse),
      finalize(() => null));
  }
}
