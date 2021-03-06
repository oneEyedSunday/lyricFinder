import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Subscription} from 'rxjs';
import { lyricStore, TracksStore, uiStore } from './../services';
import { TrackType as TrackModel, LyricInterface as LyricModel } from '../interfaces';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-lyrics',
  template: `
    <a routerLink="/" class="btn btn-dark btn-sm mb-4"><< Go Back</a>
    <div class="card">
    <ng-template [ngIf]="track">
      <h5 class="card-header">{{track.track_name}} <span class="font-italic">by</span> &nbsp;
      <span class="text-secondary">{{track.artist_name}}</span></h5>
    </ng-template>

      <div class="card-body">
      <ng-container *ngIf="!(_uiState.state$ | async).error">
        <app-loading *ngIf="!track || !lyrics"></app-loading>
        <p @lyricsAnimation
        *ngIf="track && lyrics && lyrics.text">
          {{ lyrics.text }}
        </p>
        <p
        *ngIf="track && lyrics && lyrics.error"
        class="alert alert-danger text-center">
          {{ lyrics.error }}
        </p>
      </ng-container>
      <p *ngIf="(_uiState.state$ | async ).error" class="alert alert-danger text-center">{{ (_uiState.state$ | async).error }}</p>
      </div>
    </div>
    <ng-template [ngIf]="track">
      <ul class="list-group mt-3">
        <li class="list-group-item">
          <strong>Album</strong>: {{  track.album_name }}
        </li>
        <li class="list-group-item">
          <strong>Song Genre</strong>: {{  genre }}
        </li>
        <li class="list-group-item">
          <strong>Explicit Words</strong>: {{  track.explicit ? 'Yes' : 'No' }}
        </li>
      </ul>
    </ng-template>
  `,
  animations: [
    trigger('lyricsAnimation', [
      transition(':enter', [
        style({ opacity: 0.2, color: 'pink', transform: 'translateX(100%) scale(1.2)'}),
        animate('0.6s ease-in-out', keyframes([
          style({ transform: 'translateX(75%) scale(1.3)', opacity: 0.3, offset: 0 }),
          style({ transform: 'translateX(50%) scale(1.2)', color: 'red', opacity: 0.5, offset: 0.4 }),
          style({ transform: 'translateX(0%) scale(1.1)',  opacity: 0.9, offset: 1 })
        ])),
        ])
    ])
  ],
  styles: [],
})
export class LyricsComponent implements OnInit, OnDestroy {
  id: string;
  routeSub: Subscription;
  lyricStoreSubscription: Subscription;
  trackStoreSubscription: Subscription;
  track: TrackModel;
  lyrics: LyricModel;
  apiCallSent: boolean;
  constructor(private _route: ActivatedRoute, private _lyricStore: lyricStore,
    private _trackStore: TracksStore,
    public _uiState: uiStore) {}

  ngOnInit() {
    this.apiCallSent = false;
    this.routeSub = this._route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.trackStoreSubscription = this._trackStore.state$.subscribe(() => {
      this.track = this._trackStore.getTrackById(this.id);
      if (this.track) {
        this._uiState.setError(undefined);
        if (!this.apiCallSent) {
          // prevent another call to fetch lyrics
          this._lyricStore.fetchLyrics(this.track.track_id, this.track.track_name);
          this.apiCallSent = true;
        }
      }
    });

    this.lyricStoreSubscription = this._lyricStore.state$.subscribe(lyricState => {
      if (this.track) {
        this.lyrics = lyricState.lyrics[this.track.track_id];
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.trackStoreSubscription.unsubscribe();
    this.lyricStoreSubscription.unsubscribe();
  }

  get genre(): string {
    const genreList: Array<any> = this.track.primary_genres.music_genre_list;
    return genreList.length ? genreList[0].music_genre.music_genre_name : 'NO GENRE';
  }
}
