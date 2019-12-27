import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProductsControlComponent } from './products-control/products-control.component';
import { ArticlesControlComponent } from './articles-control/articles-control.component';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [
     {
          path: '',
          children: [
               { path: '', redirectTo: 'admin', pathMatch: 'full' },
               { path: 'dashboard', component: DashboardComponent },
               { path: 'products', component: ProductsControlComponent },
               { path: 'articles', component: ArticlesControlComponent },
               { path: 'login', component: LoginComponent },
               { path: 'profile', component: SettingComponent }
          ]
     }
];

@NgModule({
     imports: [
          RouterModule.forChild(routes),
     ],
     exports: [
          RouterModule
     ]
})
export class AdminRoutingModule { }