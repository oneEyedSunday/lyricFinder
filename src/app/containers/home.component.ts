import { Component, OnInit } from '@angular/core';
import { uiStore } from '../services/ui.service';
import { TracksStore } from '../services';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  template: `
    <app-loading *ngIf="loading"></app-loading>
    <app-search></app-search>
    <h3 class="text-center mb-4">{{heading}}</h3>
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
    this.tracksStore.state$.subscribe(data => {
      console.log('tracksStore$', data);
      if (data.tracklist && data.tracklist.length > 0) {
        this.tracks = data;
        console.log('using cached data')
        this.loading = false;
      } else {
        console.log('making API call')
        this.tracksStore.fetchTracks();
        this.tracksStore.state$.pipe(
          skip(1),
        )
        .subscribe(data => {
          console.log(data);
          this.tracks = data;
          this.loading = false;
        },
      err => {
        console.error(err);
        this.loading = false;
        this.error = true;
      });
      }
    });
    this.uiStore.state$.subscribe(data => {
      this.heading = data.heading;
    });
  }

}
