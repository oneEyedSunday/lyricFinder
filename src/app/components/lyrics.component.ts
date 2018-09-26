import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Subscription} from 'rxjs';
import { lyricStore, TracksStore } from './../services';

@Component({
  selector: 'app-lyrics',
  template: `
    <p>
      lyrics works!, At page linked to id: {{id}}
    </p>
    <pre>
      {{ (localStore.state$ | async).lyrics }}
    </pre>
  `,
  styles: [],
  providers: [lyricStore]
})
export class LyricsComponent implements OnInit, OnDestroy {
  id: string;
  routeSub: Subscription;
  localStore: lyricStore;
  trackStore: TracksStore;
  loading: boolean;
  error: boolean;
  track;
  constructor(private route: ActivatedRoute, private _lyricStore: lyricStore, private _trackStore: TracksStore) {
    this.trackStore = _trackStore;
    this.localStore = _lyricStore;
    this.routeSub = route.params.subscribe(params => {
      this.id = params['id'];
      this.localStore.fetchLyrics(this.id);
    });

    this.trackStore.state$.subscribe(data => {
      this.track = this.trackStore.getTrackById(this.id);
    });



    // this.localStore.state$
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
