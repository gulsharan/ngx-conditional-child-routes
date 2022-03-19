import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService, UserRole } from '../services/auth.service';

@Component({
  selector: 'gg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'app';
  role$: Observable<UserRole>;
  constructor(private auth: AuthService, private router: Router) {
    this.role$ = auth.role$;
  }

  private _loginAs(role: UserRole) {
    this.auth.setRole(role);
    return this.router.navigate(['/dashboard']);
  }

  loginAsAdmin() {
    return this._loginAs(UserRole.admin);
  }

  loginAsUser() {
    return this._loginAs(UserRole.user);
  }

  reset() {
    window.location.href = '/';
  }
}
