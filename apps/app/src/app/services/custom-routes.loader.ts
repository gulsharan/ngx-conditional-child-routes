/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { INgxConditionalChildRoutesLoader } from 'ngx-conditional-child-routes';
import { map } from 'rxjs';

import { AuthService, UserRole } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CustomRoutesLoader implements INgxConditionalChildRoutesLoader {
  constructor(private authService: AuthService) {}

  loadModule() {
    return this.authService.role$.pipe(
      map((role) => {
        switch (role) {
          case UserRole.user:
            return import('../modules/user/user.module').then(
              (m) => m.UserModule,
            );
          case UserRole.admin:
            return import('../modules/admin/admin.module').then(
              (m) => m.AdminModule,
            );
        }
      }),
    );
  }
}
