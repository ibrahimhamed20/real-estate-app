import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONFIG } from './config';
import { ExceptionService } from './exception.service';
import { map, catchError, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

const productsUrl = CONFIG.baseUrls.products;
const productUrl = CONFIG.baseUrls.product;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProductsControlService {
  constructor(private http: HttpClient, private _exceptionService: ExceptionService) { }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getAll(): Observable<any> {
    return this.http.get(productsUrl, httpOptions)
      .pipe(
        // map(this.extractData)
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
  getById(id: number) {
    const formData = new FormData();
    formData.append('id', id.toString());
    return this.http.post(productUrl, formData
    ).pipe(
      map(response => {
        return response;
      }),
      catchError(this._exceptionService.catchBadResponse),
      finalize(() => null));
  }

  create(product: FormData) {
    return this.http.post(`${productUrl}/create`, product
    ).pipe(
      map(response => {
        return response;
      }),
      catchError(this._exceptionService.catchBadResponse),
      finalize(() => null));
  }

  update(product: FormData) {
    return this.http.post(`${productUrl}/update`, product
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
    return this.http.post(`${productUrl}/delete`, formData
    ).pipe(
      map(response => {
        return response;
      }),
      catchError(this._exceptionService.catchBadResponse),
      finalize(() => null));
  }
}
