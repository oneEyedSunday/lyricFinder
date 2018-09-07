import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import components from './components/index';
import containers from './containers/index';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './containers/home.component';
import { TracksComponent } from './components/tracks.component';
@NgModule({
  declarations: [
    AppComponent,
    ...components,
    ...containers,
    HomeComponent,
    TracksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
