import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'gg-child',
  template: '<h1>Test Component</h1>',
})
export class ChildComponent {}

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'child',
        component: ChildComponent,
      },
    ]),
  ],
  declarations: [ChildComponent],
})
export class LazyModule {}
