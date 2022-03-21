<div style="text-align:center">

  <h3>
    ngx-conditional-child-routes
  </h3>

  <p>
    Lightweight Angular library for conditionally lazy-loading child routes.
  </p>

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/gulsharan/ngx-conditional-child-routes)](https://github.com/gulsharan/ngx-conditional-child-routes/releases)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/ngx-conditional-child-routes)](https://bundlephobia.com/package/ngx-conditional-child-routes)
[![NPM](https://img.shields.io/npm/l/ngx-conditional-child-routes)](https://github.com/gulsharan/ngx-conditional-child-routes/blob/main/LICENSE)
[![CircleCI](https://img.shields.io/circleci/build/gh/gulsharan/ngx-conditional-child-routes?token=b9fff275a3dc37e1c72bba5dc27bb3d99075488e)](https://app.circleci.com/pipelines/github/gulsharan/ngx-conditional-child-routes)
[![GitHub issues](https://img.shields.io/github/issues/gulsharan/ngx-conditional-child-routes)](https://github.com/gulsharan/ngx-conditional-child-routes/issues)

</div>

## Table Of Contents

- [About](#about)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Example: Custom Child Route Loader](#example-custom-child-route-loader)
  - [Pass data to Child Route Loader](#pass-data-to-child-route-loader)
- [Contributing](#contributing)
- [License](#license)

## About

A lightweight Angular library that makes it super-easy to conditionally lazy-load child routes.

## Installation
```
npm install --save ngx-conditional-child-routes
```
If you are using yarn
```
yarn add ngx-conditional-child-routes
```

## Getting Started

1. Initialize `NgxConditionalChildRoutes` in your Angular app's <kbd>main.ts</kbd> file.

    ```typescript
    import { NgxConditionalChildRoutes } from 'ngx-conditional-child-routes';
    
    // ...
    
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .then((m) => NgxConditionalChildRoutes.init(m.injector)) /* Set the injector */
      .catch((err) => console.error(err));
    ```

2. Create your conditional route loader
   Your loader should implement one of the following interfaces. Refer to [sample implementation](#example-custom-child-route-loader) provided below.

    ```typescript
    export interface INgxConditionalChildRoutesLoader {
      loadModule(): Observable<Promise<Type<any>>>;
    }
    
    export interface INgxConditionalChildRoutesLoaderWithData<T> {
      loadModule(data?: T): Observable<Promise<Type<any>>>;
    }
    ```    

3. Register your conditional route loader in the root module
    ```typescript
    import { NGX_CONDITIONAL_ROUTES_LOADER } from 'ngx-conditional-child-routes';
    
    providers: [
      {
        provide: NGX_CONDITIONAL_ROUTES_LOADER,
        useExisting: CustomRoutesLoader,
      }
    ]
    ```

4. Conditionally lazy-load your child routes
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

### Example: Custom Child Route Loader
Here's a sample implementation of the child route loader, with the `loadModule()` method returning an Observable of (lazy-loaded) module.

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

### Pass data to Child Route Loader
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

## Contributing
Any contributions to make this project better are much appreciated. Please follow the following guidelines
before getting your hands dirty.

- Fork the repository
- Run `yarn`
- Make your changes, and don't forget to add unit tests.
- Run lint
  ```
  npm run lint
  ```
- Run test
  ```
  npm run test
  ```
- Commit/Push any changes to your repository
- Open a pull request

## License
Distributed under the MIT License. See [LICENSE](https://github.com/gulsharan/ngx-pusher/blob/main/LICENSE) for more information.

## Acknowledgements
- [Nx](https://www.npmjs.com/package/nx)
