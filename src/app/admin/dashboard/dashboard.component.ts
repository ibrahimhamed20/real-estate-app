import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { AuthData } from './../../types.interface';
import { ArticlesControlService } from 'src/app/shared/articles-control.service';
import { ProductsControlService } from 'src/app/shared/products-control.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: AuthData = <AuthData>{};
  articlesLength: number = 0;
  productsLength: number = 0;
  // userId: number;

  constructor(
    private _route: ActivatedRoute, 
    private _auth: AuthService, 
    private _router: Router,
    private _articleService: ArticlesControlService,
    private _productService: ProductsControlService) { }

  ngOnInit() {
    // this.userId = +this._route.snapshot.paramMap.get('user');
    this.user = JSON.parse(localStorage.getItem('userData'));
    if (!this.user || this.user == null) {
      this._router.navigate(['/admin/login']);
    }

    this.getArticlesLength();
    this.getProductsLength();
  }
  getProductsLength(): any {
    this._articleService.getAll()
      .subscribe(
        (data: any) => {
          this.articlesLength = data.articles.length;
        },
        err => console.error(err),
        () => {
          // console.log(this.articlesLength);
        });
  }
  getArticlesLength(): any {
    this._productService.getAll()
      .subscribe(
        (data: any) => {
          this.productsLength = data.products.length;
        },
        err => console.error(err),
        () => {
          // console.log(this.productsLength);
        });
  }

}
