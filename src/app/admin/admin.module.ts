import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin.routing';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductsControlComponent } from './products-control/products-control.component';
import { ArticlesControlComponent } from './articles-control/articles-control.component';
import { CopyrightComponent } from './copyright/copyright.component';
import { DataTableModule } from "angular-6-datatable";
import { SettingComponent } from './setting/setting.component';
import { NgxEditorModule } from 'ngx-editor';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    HttpClientModule,
    NgxEditorModule,
    NgxSpinnerModule
  ],
  declarations: [
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    ProductsControlComponent,
    ArticlesControlComponent,
    CopyrightComponent,
    SettingComponent
  ],
  providers: [
    AuthService
  ]
})
export class AdminModule { }
