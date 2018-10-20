import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Subscription} from 'rxjs';
import { lyricStore, TracksStore } from './../services';

@Component({
  selector: 'app-lyrics',
  template: `
    <a routerLink="/" class="btn btn-dark btn-sm mb-4"><< Go Back</a>
    <app-loading *ngIf="loading"></app-loading>
    <div class="card">
      <h5 class="card-header">{{track.track_name}} by &nbsp;
      <span class="text-secondary">{{track.artist_name}}</span></h5>
      <div class="card-body">
      <p class="card-text">{{(localStore.state$ | async).lyrics}}</p>
      </div>
    </div>

    <ul class="list-group mt-3">
      <li class="list-group-item">
        <strong>Album ID</strong>: {{  track.album_id }}
      </li>
      <li class="list-group-item">
        <strong>Song Genre</strong>: {{  track.primary_genres.music_genre_list[0].music_genre.music_genre_name }}
      </li>
      <li class="list-group-item">
        <strong>Explicit Words</strong>: {{  track.explicit ? 'Yes' : 'No' }}
      </li>
      <li class="list-group-item">
        <strong>Release Date</strong>: {{  track.first_release_date | amDateFormat: 'LL'}}
      </li>
    </ul>
  `,
  styles: [],
  providers: [lyricStore]
})
export class LyricsComponent implements OnInit, OnDestroy {
  id: string;
  routeSub: Subscription;
  localStore: lyricStore;
  trackStore: TracksStore;
  route: ActivatedRoute;
  loading: boolean;
  error: boolean;
  track;
  constructor(private _route: ActivatedRoute, private _lyricStore: lyricStore, private _trackStore: TracksStore) {
    this.trackStore = _trackStore;
    this.localStore = _lyricStore;
    this.route = _route;
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.localStore.fetchLyrics(this.id);
    });

    this.trackStore.state$.subscribe(data => {
      this.track = this.trackStore.getTrackById(this.id);
      console.log(this.track);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
