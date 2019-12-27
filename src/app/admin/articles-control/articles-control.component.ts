import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Articles } from 'src/app/types.interface';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ArticlesControlService } from '../../shared/articles-control.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-articles-control',
  templateUrl: './articles-control.component.html',
  styleUrls: ['./articles-control.component.css']
})
export class ArticlesControlComponent implements OnInit {
  articles: Articles[] = [];
  editArticle: Articles = <Articles>{};
  articleForm: FormGroup;
  htmlContent: any;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  data: Articles = <Articles>{};
  editorConfig = {
    editable: true,
    spellcheck: false,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Type something. Test the Editor... ヽ(^。^)丿',
    translate: 'no'
  };

  constructor(
    private modalService: NgbModal,
    private _toustr: ToastrService,
    private renderer: Renderer2,
    private _articleService: ArticlesControlService
  ) { }

  ngOnInit() {
    this.initArticleForm();
    this.getAllArticles();
  }

  initArticleForm() {
    this.articleForm = new FormGroup({
      id: new FormControl(),
      title: new FormControl(''),
      short_desc: new FormControl(''),
      image: new FormControl(''),
      author: new FormControl(''),
      content: new FormControl('')
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  //# start crud operation of Articles
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
  getArticlesById(code: number) {
    this._articleService.getById(code)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        data => {
          this.editArticle = data[0];
        },
        err => console.error(err),
        () => {
          console.table(this.editArticle);
        });
  }

  saveArticle() {
    this.editArticle = this.articleForm.value;

    const formData: FormData = new FormData();

    formData.append('title', this.editArticle.title);
    formData.append('short_desc', this.editArticle.short_desc);
    formData.append('content', this.editArticle.content);
    formData.append('author', this.editArticle.author);
    // formData.append('newFlag', String(this.editArticle.newFlag));

    if (this.fileData && this.fileData != null) {
      formData.append('image', this.fileData, this.fileData.name);
    }

    if (!this.editArticle.id || this.editArticle.id == null || this.editArticle.id == 0) {
      this._articleService.create(formData)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(msg => {
          this._toustr.success('تم حفظ المقال بنجاح!', 'عملية ناجحة');
          this.getAllArticles();
        }, err => {
          this._toustr.error(err, 'خطأ!');
        },
          () => {
            null
          });
    } else {
      // console.log(this.editArticle.id);
      formData.append('id', this.editArticle.id.toString());
      this._articleService.update(formData)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          msg => {
            this._toustr.success('تم تعديل المقال بنجاح!', 'عملية ناجحة');
            this.getAllArticles();
          },
          err => {
            this._toustr.error(err, 'خطأ!');
          },
          () => {
            null
          });
    }
  }

  deleteArticles(id: number) {
    if (id > 0) {
      this._articleService.delete(id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          msg => {
            this._toustr.success('تم حذف المقال بنجاح!', 'عملية ناجحة');
            this.getAllArticles();
          },
          err => {
            this._toustr.error(err, 'خطأ!');
          },
          () => {
            null
          });
    }
  }
  //# end crud operation of Articles

  // popup functions  --> open --> dismiss
  openModal(content, data: Articles) {
    if (data.id > 0) {
      this.articleForm.patchValue(data);
    } else {
      this.articleForm.reset();
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      this.saveArticle();
    }, (reason) => {
      console.log(`Dismissed => ${reason}`);
    });
  }



  ///////////////////////////////////////////////////////////////////
  @ViewChild('image', { static: false }) private image: ElementRef;

  createImageBitmap(src) {
    var srcArr = src.split('=');
    var numArr = srcArr[srcArr.length - 1].split('.');
    if (+numArr[0] > 0) {
      src = src + '&' + String(Math.random());
    }
    const div: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(div, 'reset-image');
    const img: HTMLImageElement = this.renderer.createElement('img');

    img.src = src;
    this.renderer.addClass(img, 'w-100');
    this.renderer.addClass(img, 'h-100');
    this.renderer.addClass(img, 'mx-auto');
    this.renderer.addClass(img, 'mt-2');
    this.renderer.addClass(img, 'd-block');

    const a: HTMLAnchorElement = this.renderer.createElement('a');
    this.renderer.addClass(a, 'delete-btn');
    this.renderer.addClass(a, 'btn');
    this.renderer.addClass(a, 'btn-danger');
    this.renderer.addClass(a, 'text-white');
    this.renderer.addClass(a, 'rounded-circle');
    this.renderer.appendChild(this.image.nativeElement, div);
    this.renderer.appendChild(div, img);
  }


  // another way to upload file
  fileData: File = null;
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
  }
}


