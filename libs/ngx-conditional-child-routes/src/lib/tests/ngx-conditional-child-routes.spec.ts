/* eslint-disable @typescript-eslint/no-explicit-any */
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { Component, Injectable, Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Router, RouterModule } from '@angular/router';
import { createSpyObj } from 'jest-createspyobj';
import { of } from 'rxjs';

import {
  INgxConditionalChildRoutesLoaderWithData,
  NGX_CONDITIONAL_CHILD_ROUTES_LOADER,
} from '../interface';
import { NgxConditionalChildRoutes } from '../ngx-conditional-child-routes';
import { ChildComponent } from './lazy.module';

@Component({
  selector: 'gg-root',
  template: '<router-outlet></router-outlet>',
})
class RootComponent {}

interface TestPayload {
  data: string;
}

describe('NgxConditionalRoutes', () => {
  let fixture: ComponentFixture<RootComponent>;
  let injector: jest.Mocked<Injector>;
  let router: Router;

  beforeEach(async () => {
    injector = createSpyObj(Injector, ['get']);
    injector.get.mockImplementation((token) => TestBed.inject(token));

    @Injectable()
    class TestRouteLoader
      implements INgxConditionalChildRoutesLoaderWithData<TestPayload>
    {
      loadModule(payload: TestPayload) {
        expect(payload).toEqual({ data: 'Custom Data' });
        return of(import('./lazy.module').then((m) => m.LazyModule));
      }
    }

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserTestingModule,
        RouterModule.forRoot([
          {
            path: 'parent',
            component: RootComponent,
            loadChildren: () =>
              NgxConditionalChildRoutes.load({ data: 'Custom Data' }),
          },
        ]),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: NGX_CONDITIONAL_CHILD_ROUTES_LOADER,
          useClass: TestRouteLoader,
        },
      ],
      declarations: [RootComponent],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    NgxConditionalChildRoutes.init(injector);

    fixture = TestBed.createComponent(RootComponent);
    fixture.detectChanges();
  });

  it('should lazy-load the route', async () => {
    const before = fixture.debugElement.query(By.directive(ChildComponent));
    await router.navigate(['/parent/child']);
    const after = fixture.debugElement.query(By.directive(ChildComponent));

    expect(before).toBeNull();
    expect(after).not.toBeNull();

    const heading = after.nativeElement as HTMLHeadingElement;
    expect(heading.textContent).toBe('Test Component');
  });
});
