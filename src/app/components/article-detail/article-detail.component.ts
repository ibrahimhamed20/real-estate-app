import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserSessionService } from './../../shared/app-user-session.service';
import { Articles } from './../../types.interface';
import { ArticlesControlService } from './../../shared/articles-control.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  articleDetails: Articles;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private _route: ActivatedRoute,
    private _uss: UserSessionService,
    private _articleServ: ArticlesControlService) { }

  ngOnInit() {
    let id = +this._route.snapshot.paramMap.get('id');
    if (id) {
      this.getArticleDetails(id);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getArticleDetails(id: number) {
    if (id > 0) {
      this._articleServ.getById(id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          res => {
            if (res) {
              this.articleDetails = res.article;
              // console.table(this.articleDetails);
            }
          },
          err => console.error(err),
          () => {
            if (!this.articleDetails || Object.keys(this.articleDetails).length == 0) {
              this.getDataFromSession();
            }
          });

    }
  }
  getDataFromSession() {
    this._uss.subscribeToKey$('ARTICLEDATA')
      .subscribe((res: any) => {
        if (res.value) {
          this.articleDetails = res.value
        } else {
          this.articleDetails = JSON.parse(localStorage.getItem('Article'));
        }
      },
        err => console.error(err)
      );
  }

}
