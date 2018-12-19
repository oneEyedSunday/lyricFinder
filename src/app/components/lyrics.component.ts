import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Subscription} from 'rxjs';
import { lyricStore, TracksStore, uiStore } from './../services';
import { TrackType as TrackModel, LyricInterface as LyricModel } from '../interfaces';
import { trigger, transition, group, query, style, animate, stagger, keyframes } from '@angular/animations';

@Component({
  selector: 'app-lyrics',
  template: `
    <a routerLink="/" class="btn btn-dark btn-sm mb-4"><< Go Back</a>
    <div class="card">
    <ng-template [ngIf]="track">
      <h5 class="card-header">{{track.track_name}} by &nbsp;
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
        class="alert alert-danger">
          {{ lyrics.error }}
        </p>
      </ng-container>
      <p *ngIf="(_uiState.state$ | async ).error" class="alert alert-danger">{{ (_uiState.state$ | async).error }}</p>
      </div>
    </div>
    <ng-template [ngIf]="track">
      <ul class="list-group mt-3">
        <li class="list-group-item">
          <strong>Album ID</strong>: {{  track.album_id }}
        </li>
        <li class="list-group-item">
          <strong>Song Genre</strong>: {{  genre }}
        </li>
        <li class="list-group-item">
          <strong>Explicit Words</strong>: {{  track.explicit ? 'Yes' : 'No' }}
        </li>
        <li class="list-group-item">
          <strong>Release Date</strong>: {{  track.first_release_date | amDateFormat: 'LL'}}
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
  track: TrackModel;
  lyrics: LyricModel;
  constructor(private _route: ActivatedRoute, private _lyricStore: lyricStore,
    private _trackStore: TracksStore,
    public _uiState: uiStore) {}

  ngOnInit() {
    this.routeSub = this._route.params.subscribe(params => {
      this.id = params['id'];
    });

    this._trackStore.state$.subscribe(data => {
      console.log('trackState change', data);
      this.track = this._trackStore.getTrackById(this.id);
      if (this.track) {
        this._uiState.setError(undefined);
        this._lyricStore.fetchLyrics(this.track.track_id, this.track.track_name);
      }
    });


    this._lyricStore.state$.subscribe(lyricState => {
      console.log('Lyric state update', lyricState);
      if (this.track) {
        this.lyrics = lyricState.lyrics[this.track.track_id];
      }
    });


    this._uiState.state$.subscribe(state => console.log(state));
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    // TODO : unsubcribe from subscriptions
  }

  get genre(): string {
    const genreList: Array<any> = this.track.primary_genres.music_genre_list;
    return genreList.length ? genreList[0].music_genre.music_genre_name : 'NO GENRE';
  }
}
