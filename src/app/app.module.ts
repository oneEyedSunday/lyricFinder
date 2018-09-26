import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import components from './components';
import containers from './containers';
import services from './services';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './containers/home.component';
import { TracksComponent } from './components/tracks.component';
import { LoadingComponent } from './components/loading.component';
import { TrackComponent } from './components/track.component';
import { LyricsComponent } from './components/lyrics.component';
@NgModule({
  declarations: [
    AppComponent,
    ...components,
    ...containers,
    HomeComponent,
    TracksComponent,
    LoadingComponent,
    TrackComponent,
    LyricsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [...services],
  bootstrap: [AppComponent]
})
export class AppModule { }
