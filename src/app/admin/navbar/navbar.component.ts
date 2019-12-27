import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { AuthData } from 'src/app/types.interface';

@Component({
  selector: 'admin-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: string;
  userData: AuthData = <AuthData>{};
  constructor(
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    if (this.userData) {
      this.user = this.userData.username;
    }
  }

  logout() {
    this._authService.logout();
    this._router.navigate(['/admin/login']);
  }
}
