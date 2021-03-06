import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { uiStore as uiState, TracksStore } from '../services';
import { TrackState as TrackStateInterface, TrackType, eContext } from '../interfaces';

@Component({
  selector: 'app-home',
  template: `
    <app-search (search)="_handleSearch($event)"></app-search>
    <h3 class="text-center mb-4">{{ (uiStore.state$ | async ).heading}}</h3>
    <p class="alert alert-danger text-center" *ngIf="( uiStore.state$ | async).error">{{ ( uiStore.state$ | async).error }} </p>
    <app-loading *ngIf=" (uiStore.state$ | async).loading "></app-loading>
    <ng-container *ngIf="tracks">
      <div class="row">
        <ng-container *ngFor="let track of tracks">
          <div class="col col-sm col-md-6 col-lg-4 col-xl-2 my-2">
            <app-track [track]="track"></app-track>
          </div>
        </ng-container>
      </div>
    </ng-container>

  `,
  styles: []
})
export class HomeComponent implements OnInit, OnDestroy {
  tracks: TrackType = undefined;
  allTracksInState: TrackStateInterface;
  tracksStoreSub: Subscription;
  constructor(public uiStore: uiState, private tracksStore: TracksStore) {}

  ngOnInit() {
    this.tracksStore.getTracksFromStoreOrAPI();
    this.tracksStoreSub = this.tracksStore.state$.subscribe(data => {
      this.allTracksInState = data;
      this.tracks = data[this._switchData(this.uiStore.state.context)];
    });
  }

  _switchData(code?: eContext): string {
    if (code === eContext.SEARCH) {
      return 'CurrentSearchTracks';
    } else {
      return 'tracklist';
    }
  }

  _handleSearch(e: any) {
    this.uiStore.setState({
      ...this.uiStore.state,
      context: e.code
    });
    this.tracks = this.allTracksInState[this._switchData(e.code)];
  }

  ngOnDestroy() {
    this.tracksStoreSub.unsubscribe();
  }
}
