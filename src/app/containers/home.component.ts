import { Component, OnInit } from '@angular/core';
import { uiStore } from '../services/ui.service';
import { TracksStore } from '../services';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  template: `
    <h3 class="text-center mb-4">{{heading}}</h3>
    <app-loading *ngIf="loading"></app-loading>
    <app-tracks [tracks]="tracks" *ngIf="!loading && tracks"></app-tracks>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  heading = 'Not Set';
  uiStore: uiStore;
  tracksStore: TracksStore;
  tracks;
  loading: boolean;
  error: boolean;
  constructor(uStore: uiStore, tracksStore: TracksStore) {
    this.uiStore = uStore;
    this.tracksStore = tracksStore;
  }

  ngOnInit() {
    this.loading = true;
    this.tracksStore.fetchTracks();
    this.tracksStore.state$.pipe(
      skip(1),
    )
    .subscribe(data => {
      console.log(data);
      this.tracks = data;
    //  if (this.tracks.tracklist.length > 0) { this.loading = false; } // hack for initial value
    this.loading = false;
     console.log(this.loading);
    },
  err => {
    console.error(err);
    this.loading = false;
    this.error = true;
  });

    this.uiStore.state$.subscribe(data => {
      this.heading = data.heading;
    });
  }

}
