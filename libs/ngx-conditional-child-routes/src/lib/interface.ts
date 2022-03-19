/* eslint-disable @typescript-eslint/no-explicit-any */
import { InjectionToken, Type } from '@angular/core';
import { Observable } from 'rxjs';

export const NGX_CONDITIONAL_CHILD_ROUTES_LOADER = new InjectionToken(
  'NGX_CONDITIONAL_CHILD_ROUTES_LOADER',
);

export interface INgxConditionalChildRoutesLoader {
  loadModule(): Observable<Promise<Type<any>>>;
}

export interface INgxConditionalChildRoutesLoaderWithData<T> {
  loadModule(data?: T): Observable<Promise<Type<any>>>;
}
