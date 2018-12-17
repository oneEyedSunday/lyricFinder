import { Component, OnInit, OnDestroy } from '@angular/core';
import { uiStore as uiState } from '../services/ui.service';
import { TracksStore } from '../services';
import { Subscription } from 'rxjs';
import { TrackState } from '../interfaces/Track';
import { eContext } from '../interfaces/Ui';

@Component({
  selector: 'app-home',
  template: `
    <app-search (search)="_handleSearch($event)"></app-search>
    <h3 class="text-center mb-4">{{ (uiStore.state$ | async ).heading}}</h3>
    <p class="alert alert-danger" *ngIf="( uiStore.state$ | async).error">{{ ( uiStore.state$ | async).error }} </p>
    <app-loading *ngIf=" (uiStore.state$ | async).loading "></app-loading>
    <ng-container *ngIf="tracks">
      <app-track *ngFor="let track of tracks" [track]="track"></app-track>
    </ng-container>
  `,
  styles: []
})
export class HomeComponent implements OnInit, OnDestroy {
  tracks = undefined;
  allTracksInState: TrackState;
  tracksStoreSub: Subscription;
  constructor(public uiStore: uiState, public tracksStore: TracksStore) {}

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
