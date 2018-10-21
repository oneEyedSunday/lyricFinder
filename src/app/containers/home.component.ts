import { Component, OnInit, OnDestroy } from '@angular/core';
import { uiStore } from '../services/ui.service';
import { TracksStore } from '../services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  template: `
    <app-loading *ngIf=" (uiStore.state$ | async).loading "></app-loading>
    <app-search></app-search>
    <h3 class="text-center mb-4">{{ (uiStore.state$ | async ).heading}}</h3>
    <app-tracks [tracks]="tracks" *ngIf=" (!(uiStore.state$ | async)).error && tracks"></app-tracks>
    <p class="lead alert alert-danger" *ngIf="( uiStore.state$ | async).error">{{ ( uiStore.state$ | async).error }} </p>
  `,
  styles: []
})
export class HomeComponent implements OnInit, OnDestroy {
  uiStore: uiStore;
  tracksStore: TracksStore;
  tracks = undefined;
  trackstore$: Subscription;
  uiStore$: Subscription;
  constructor(uStore: uiStore, tracksStore: TracksStore) {
    this.uiStore = uStore;
    this.tracksStore = tracksStore;
  }

  ngOnInit() {
    this.tracksStore.getTracksFromStoreOrAPI();
    this.trackstore$ = this.tracksStore.state$.subscribe(data => {
      this.tracks = data;
    });
  }

  ngOnDestroy() {
    this.trackstore$.unsubscribe();
  }
}
