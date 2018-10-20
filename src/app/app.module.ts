
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MomentModule} from 'ngx-moment';

import { AppComponent } from './app.component';
import components from './components';
import containers from './containers';
import services from './services';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    ...components,
    ...containers,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MomentModule,
    ReactiveFormsModule
  ],
  providers: [...services],
  bootstrap: [AppComponent]
})
export class AppModule { }
