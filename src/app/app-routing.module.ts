import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as fromContainers from './containers';


const routes: Routes = [
  {path: '', component: fromContainers.HomeComponent}
];

@NgModule({
  imports: [
   RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
