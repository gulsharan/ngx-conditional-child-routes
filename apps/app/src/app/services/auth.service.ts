import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  role$ = new ReplaySubject<UserRole>();
  setRole(role: UserRole) {
    this.role$.next(role);
  }
}

export enum UserRole {
  user = 'user',
  admin = 'admin',
}
