import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ArticlesControlService } from './../../shared/articles-control.service';
import { takeUntil } from 'rxjs/operators';
import { Articles } from './../../types.interface';
import { UserSessionService } from '../../shared/app-user-session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  articles: Articles[] = [];
  constructor(
    private _articleService: ArticlesControlService,
    private _uss: UserSessionService,
    private _router: Router) { }

  ngOnInit() {
    this.getAllArticles();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
          // console.log(this.articles);
        });
  }

  //////// go to product detail
  gotoDetailPage(article: Articles) {
    if (article) {
      this._uss.setSessionKey('ARTICLEDATA', article);
      localStorage.setItem('Article', JSON.stringify(article));
      this._router.navigate(['/articles', article.id]);
    }
  }
}
