import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../../shared/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './../../types.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  authData: AuthData = <AuthData>{};
  loginFlag: boolean = false;
  AuthDataForm: FormGroup;

  editUser: AuthData = <AuthData>{};
  userData: AuthData = <AuthData>{};
  userId: number;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _authData: AuthService, private _router: Router, private _toastr: ToastrService) { }
  ngOnInit() {
    // first get user fron localStorage
    this.userData = JSON.parse(localStorage.getItem('userData'));
    // init login form
    this.initilizeForm();
    // set user id 
    this.userId = this.userData.id;
    // check if user exists then get user data by id
    if (this.userId) {
      this.getUserData(this.userId);
    }
    // check if user found in local storage then redirect to dashoard
    if (this.userData || this.userData != null) {
      this._router.navigate(['/admin/dashboard']);
    }
  }

  getUserData(id: number) {
    this._authData.getUserData(id)
      .subscribe(
        (res: any) => {
          if (res)
            this.editUser = res.user;
        },
        err => console.log(err),
        () => {
          if (this.editUser) {
            localStorage.setItem('userData', JSON.stringify(this.editUser));
            this._router.navigate(['/admin/dashboard', { user: this.editUser.userId }]);
          } else {
            this._router.navigate(['/admin/login']);
          }
        });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initilizeForm() {
    this.AuthDataForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });
  }

  login() {
    this.authData = this.AuthDataForm.value;
    const formData = new FormData();
    formData.append('username', this.authData.username);
    formData.append('password', this.authData.password);
    this._authData.checkAuth(formData)
      .subscribe(
        msg => {
          if (msg && msg.user_id > 0) {
            this.getUserData(msg.user_id);
            this._toastr.success('تم تسجيل الدخول', 'مرحبا');
          }
        },
        err => {
          this._toastr.error('اسم المستخدم او كلة المرور غير صحيحه!', 'خطأ');
        });
  }

}
