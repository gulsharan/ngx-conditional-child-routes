import { Injector } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {
  INgxConditionalChildRoutesLoader,
  INgxConditionalChildRoutesLoaderWithData,
  NGX_CONDITIONAL_CHILD_ROUTES_LOADER,
} from './interface';

type RouteLoader<T> =
  | INgxConditionalChildRoutesLoader
  | INgxConditionalChildRoutesLoaderWithData<T>;

export class NgxConditionalChildRoutes {
  static _appInjector = new ReplaySubject<Injector>();

  static init(injector: Injector) {
    this._appInjector.next(injector);
  }

  static load<T>(data?: T) {
    return this._appInjector.pipe(
      map((injector) =>
        injector.get<RouteLoader<T>>(NGX_CONDITIONAL_CHILD_ROUTES_LOADER),
      ),
      switchMap((loader) => loader.loadModule(data)),
      switchMap((_) => _),
    );
  }
}
