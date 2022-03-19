import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  NGX_CONDITIONAL_CHILD_ROUTES_LOADER,
  NgxConditionalChildRoutes,
} from 'ngx-conditional-child-routes';

import { AppComponent } from './components/app.component';
import { CustomRoutesLoader } from './services/custom-routes.loader';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'dashboard',
        loadChildren: () => NgxConditionalChildRoutes.load(),
      },
    ]),
  ],
  providers: [
    {
      provide: NGX_CONDITIONAL_CHILD_ROUTES_LOADER,
      useExisting: CustomRoutesLoader,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
