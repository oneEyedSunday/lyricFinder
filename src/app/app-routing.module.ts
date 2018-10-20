import { TrackGuard } from './guards/track.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as fromContainers from './containers';
import { LyricsComponent } from './components/lyrics.component';


const routes: Routes = [
  {path: '', component: fromContainers.HomeComponent},
  {path: 'lyrics/track/:id', component: LyricsComponent, canActivate: [TrackGuard] }
];

@NgModule({
  imports: [
 RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
