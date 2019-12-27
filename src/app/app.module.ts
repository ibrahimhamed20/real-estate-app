import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// main utilities import
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './util/not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
// components import
import { HeaderComponent } from './util/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';
import { FooterComponent } from './util/footer/footer.component';
import { UserSessionService } from './shared/app-user-session.service';
import { ToastService, ToastComponent } from './util/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StorageService } from './shared/storage.service';
import { ProductsControlService } from './shared/products-control.service';
import { ArticlesControlService } from './shared/articles-control.service';
import { ExceptionService } from './shared/exception.service';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { SiteInfoService } from './shared/site-info.service';
import { SettingService } from './shared/setting.service';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProductsComponent,
    ProductDetailComponent,
    ArticlesComponent,
    ArticleDetailComponent,
    ToastComponent,
    AboutComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule
  ],
  providers: [
    UserSessionService,
    ToastService,
    StorageService,
    ProductsControlService,
    ArticlesControlService,
    ExceptionService,
    SiteInfoService,
    SettingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
