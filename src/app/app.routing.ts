import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './util/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // modules
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  // components
  { path: 'home', component: HomeComponent, data: { title: 'Home Page' } },
  { path: 'products', component: ProductsComponent, data: { title: 'All Products Page' } },
  { path: 'products/:id', component: ProductDetailComponent, data: { title: 'Poduct Page' } },
  { path: 'articles', component: ArticlesComponent, data: { title: 'All Articles Page' } },
  { path: 'articles/:id', component: ArticleDetailComponent, data: { title: 'Single Article Page' } },
  { path: 'about', component: AboutComponent, data: { title: 'About Us Page' } },
  { path: 'contact', component: ContactComponent, data: { title: 'Contact Us Page' } },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
