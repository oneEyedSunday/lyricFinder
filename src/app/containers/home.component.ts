import { Component, OnInit, OnDestroy } from '@angular/core';
import { uiStore as uiState } from '../services/ui.service';
import { TracksStore } from '../services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  template: `
    <app-loading *ngIf=" (uiStore.state$ | async).loading "></app-loading>
    <app-search></app-search>
    <h3 class="text-center mb-4">{{ (uiStore.state$ | async ).heading}}</h3>
    <app-tracks [tracks]="tracks" *ngIf=" (!(uiStore.state$ | async)).error && tracks"></app-tracks>
    <p class="alert alert-danger" *ngIf="( uiStore.state$ | async).error">{{ ( uiStore.state$ | async).error }} </p>
  `,
  styles: []
})
export class HomeComponent implements OnInit, OnDestroy {
  tracks = undefined;
  tracksStoreSub: Subscription;
  constructor(public uiStore: uiState, public tracksStore: TracksStore) {}

  ngOnInit() {
    this.tracksStore.getTracksFromStoreOrAPI();
    this.tracksStoreSub = this.tracksStore.state$.subscribe(data => {
      this.tracks = data;
    });
  }

  ngOnDestroy() {
    this.tracksStoreSub.unsubscribe();
  }
}
