import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgxConditionalChildRoutes } from 'ngx-conditional-child-routes';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((m) => NgxConditionalChildRoutes.init(m.injector))
  .catch((err) => console.error(err));
