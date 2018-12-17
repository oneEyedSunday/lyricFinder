import { Component, OnInit, OnDestroy } from '@angular/core';
import { uiStore as uiState } from '../services/ui.service';
import { TracksStore } from '../services';
import { Subscription } from 'rxjs';
import { TrackState } from '../interfaces/Track';

@Component({
  selector: 'app-home',
  template: `
    <app-search (search)="_handleSearch($event)"></app-search>
    <h3 class="text-center mb-4">{{ (uiStore.state$ | async ).heading}}</h3>
    <app-loading *ngIf=" (uiStore.state$ | async).loading "></app-loading>
    <ng-container *ngIf="!(uiStore.state$ | async).error && tracks">
      <app-track *ngFor="let track of tracks" [track]="track"></app-track>
    </ng-container>
    <p class="alert alert-danger" *ngIf="( uiStore.state$ | async).error">{{ ( uiStore.state$ | async).error }} </p>
  `,
  styles: []
})
export class HomeComponent implements OnInit, OnDestroy {
  tracks = undefined;
  allTracksInState: TrackState;
  tracksStoreSub: Subscription;
  switch: number;
  constructor(public uiStore: uiState, public tracksStore: TracksStore) {}

  ngOnInit() {
    // TODO (oneeyesunday)
    // prepopulate serach bar et al.

    // Search component still holds Search params
    // or again, push to Ui service
    this.tracksStore.getTracksFromStoreOrAPI();
    this.tracksStoreSub = this.tracksStore.state$.subscribe(data => {
      console.log(data);
      this.allTracksInState = data;
      this.tracks = data[this._switchData(this.switch)];
    });
  }

  // TODO (oneeyedsunday)
  // consider pushing to UIService
  _switchData(code?): string {
    if (code === 1) {
      return 'CurrentSearchTracks';
    } else {
      return 'tracklist';
    }
  }

  _handleSearch(e: any) {
    this.switch = e.code;
    // swap tracks
    console.log(e);
  }

  ngOnDestroy() {
    this.tracksStoreSub.unsubscribe();
  }
}
