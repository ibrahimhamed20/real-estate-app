import { Component, OnInit } from '@angular/core';
import { ProductsControlService } from './../../shared/products-control.service';
import { ArticlesControlService } from './../../shared/articles-control.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Products, Articles } from 'src/app/types.interface';
import { UserSessionService } from './../../shared/app-user-session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  products: Products[] = [];
  topProducts: Products[] = [];

  articles: Articles[] = [];
  topArticles: Articles[] = [];

  constructor(
    private _productService: ProductsControlService,
    private _articleService: ArticlesControlService,
    private _router: Router,
    private _uss: UserSessionService) { }

  ngOnInit() {
    this.getAllProducts();
    this.getAllArticles();
  }
  getAllArticles() {
    this._articleService.getAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (data: any) => {
          if (data) {
            this.articles = data.articles;
          }
        },
        err => console.error(err),
        () => {
          this.articles.forEach((element, i) => {
            if (i <= 3) {
              this.topArticles.push(element);
            }
          });
        });
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
          this.products.forEach((element, i) => {
            if (i <= 6) {
              this.topProducts.push(element);
            }
          });
        });
  }

  getItemDetail(item: Products | Articles, type: number) {
    if (item && type == 1) {
      this._uss.setSessionKey('PRODUCTDATA', item);
      sessionStorage.setItem('Product', JSON.stringify(item));
      this._router.navigate(['/products', item.id]);
    } else if (item && type == 2) {
      this._uss.setSessionKey('ARTICLEDATA', item);
      sessionStorage.setItem('Article', JSON.stringify(item));
      this._router.navigate(['/articles', item.id]);
    }
  }

}
