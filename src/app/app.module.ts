
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MomentModule} from 'ngx-moment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import * as fromServices from './services';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    ...fromComponents.components,
    ...fromContainers.containers,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MomentModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [...fromServices.services],
  bootstrap: [AppComponent]
})
export class AppModule { }
