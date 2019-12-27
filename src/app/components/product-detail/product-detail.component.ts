import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSessionService } from './../../shared/app-user-session.service';
import { Products } from '../../types.interface';
import { ProductsControlService } from '../../shared/products-control.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  currentRate = 6;
  productDetails: Products;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private _route: ActivatedRoute,
    private _uss: UserSessionService,
    private _productServ: ProductsControlService,
    private _router: Router) { }

  ngOnInit() {
    let id = +this._route.snapshot.paramMap.get('id');
    if (id) {
      this.getProductDetails(id);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  gotoAllProducts() {
    this._router.navigate(['/products']);
  }

  getProductDetails(id: number) {
    if (id > 0) {
      this._productServ.getById(id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            if (res) {
              this.productDetails = res;
              // console.table(this.productDetails);
            }
          },
          err => console.error(err),
          () => {
            if (!this.productDetails || Object.keys(this.productDetails).length == 0) {
              this.getDataFromSession();
            }
          });
    }
  }
  getDataFromSession() {
    this._uss.subscribeToKey$('PRODUCTDATA')
      .subscribe((res: any) => {
        if (res.value) {
          this.productDetails = res.value
        } else {
          this.productDetails = JSON.parse(localStorage.getItem('Product'));
        }
      },
        err => console.error(err)
      );
  }

}
