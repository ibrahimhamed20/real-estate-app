import { Component, OnInit } from '@angular/core';
import { ProductsControlService } from './../../shared/products-control.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Products } from 'src/app/types.interface';
import { UserSessionService } from './../../shared/app-user-session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  products: Products[] = [];
  constructor(
    private _productService: ProductsControlService,
    private _uss: UserSessionService,
    private _router: Router) { }

  ngOnInit() {
    this.getAllProducts();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getAllProducts() {
    this._productService.getAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (data: any) => {
          if (data) {
            this.products = data.products;
          }
        },
        err => console.error(err),
        () => {
          // console.log(this.products);
        });
  }

  //////// go to product detail
  gotoDetailPage(product: Products) {
    if (product) {
      this._uss.setSessionKey('PRODUCTDATA', product);
      localStorage.setItem('Product', JSON.stringify(product));
      this._router.navigate(['/products', product.id]);
    }
  }
}
