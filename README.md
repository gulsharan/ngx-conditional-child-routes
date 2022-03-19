# ngx-conditional-child-routes

A lightweight Angular library to conditionally lazy-load child routes.

# Installation
```bash
npm install --save ngx-conditional-child-routes
```

# Usage Steps

## 1. Initialize
```typescript
import { NgxConditionalChildRoutes } from 'ngx-conditional-child-routes';

// ...

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((m) => NgxConditionalChildRoutes.init(m.injector)) /* Set the injector */
  .catch((err) => console.error(err));
```

## 2. Create your conditional route loader
Your loader should implement one of the following interfaces:
- `INgxConditionalChildRoutesLoader`
- `INgxConditionalChildRoutesLoaderWithData<T>`

Here's a sample implementation, with the `loadModule()` method returning an Observable of (lazy-loaded) module.
```typescript
import { Type } from '@angular/core';
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CustomRoutesLoader implements INgxConditionalChildRoutesLoader {
  constructor(private authService: AuthService) {}

  loadModule(): Observable<Promise<Type<any>>> {
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
```

## 3. Register your conditional route loader in the root module
```typescript
import { NGX_CONDITIONAL_ROUTES_LOADER } from 'ngx-conditional-child-routes';

providers: [
  {
    provide: NGX_CONDITIONAL_ROUTES_LOADER,
    useExisting: CustomRoutesLoader,
  }
]
```

## 4. Conditionally lazy-load your child routes
```typescript
import { NgxConditionalChildRoutes } from 'ngx-conditional-child-routes';

RouterModule.forRoot([
  // ... other routes
  {
    path: 'dashboard',
    loadChildren: () => NgxConditionalChildRoutes.load(),
  },
])
```

# Pass custom data to your Route Loader
If you need to pass data to your conditional route loader,
you need to implement `INgxConditionalChildRoutesLoaderWithData<T>` interface.

```typescript
export enum PageType {
  Dashboard,
  Profile
}

@Injectable({ providedIn: 'root' })
export class CustomRoutesLoader implements INgxConditionalChildRoutesLoader<PageType> {
  loadModule(data: PageType): Observable<Promise<Type<any>>> {
    // ...
  }
}
```

And then just pass the data while loading the modules.

```typescript
RouterModule.forRoot([
  // ... other routes
  {
    path: 'dashboard',
    loadChildren: () => NgxConditionalChildRoutes.load(MyEnum.Dashboard),
  },
])
```
