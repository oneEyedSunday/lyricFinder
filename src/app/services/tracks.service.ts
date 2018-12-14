import { Injectable } from '@angular/core';
import {Store} from 'rxjs-observable-store';
import { skip, finalize, take } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {uiStore} from './ui.service';
import ENV from './../../../env';
import { Observable } from 'rxjs';
import { SearchQuery as SearchQueryInterface } from './../interfaces/Search';
import { TrackType, TrackState } from './../interfaces/Track';


@Injectable({
  providedIn: 'root'
})
export class TracksStore extends Store<TrackState> {
  constructor(private http: HttpClient, private uiState: uiStore) {
    super(new TrackState());
    // TODO (oneeyedsunday)
    // make search params customizable
  }

  // TODO (oneeyedsunday)
  // follow observable pattern
  getTracksFromStoreOrAPI(): Observable<any> | any {
    if (this.state.tracklist && this.state.tracklist.length > 0 ) {
      console.log('using data from store');
    } else {
      this.fetchTracks();
      console.log('making API call');
        return this.state$.pipe(
          skip(1)
        );
    }
  }

  // TODO: add env file and config
  fetchTracks() {
    this.uiState.loading();
    // tslint:disable-next-line:max-line-length
    this.http.get(`/api/ws/1.1/chart.tracks.get?page=1&page_size=30&country=NA&f_has_lyrics=1&apikey=${ENV.apiKey}`).pipe(
      finalize(() => { this.uiState.notloading(); }),
      take(1)
    ).subscribe(
      json => {
        // console.log(json['message'].body.track_list);
        this.setState({
          ...this.state,
          tracklist : this.beatDown(json['message'].body.track_list)
        });
      }, (err: HttpErrorResponse) => {
        this.uiState.setError(`An error occured, sorry: ${err.statusText}`);
      });
  }

  beatDown(data): TrackType[] {
    const filtered: TrackType[] = [];
    const deep = JSON.parse(JSON.stringify(data));
    deep.map(({track}) => {
      const {
        track_name, album_name, artist_name, track_id, primary_genres, explicit,
        first_release_date, album_id
      } = track;
      filtered.push( {
        track_name, album_name, artist_name, track_id, primary_genres, explicit,
        first_release_date, album_id
      });
    });
    return filtered;
  }

  getTrackById(trackId: string): TrackType {
    let currTrack: TrackType;
    this.state.tracklist.map(track => {
      if (track.track_id.toString() === trackId) {
        currTrack = track;
      }
    });

    return currTrack;
  }

  // TODO (oneeyedsunday)\
  // fix data structure
  // so you switch between found tracks and ytacklist dependomg on urk;

  findTrack(queryOptions: SearchQueryInterface) {
    this.uiState.loading();
    this.http.get(
      // tslint:disable-next-line:max-line-length
      `/api/ws/1.1/track.search?q_track=${queryOptions.title}
      &page_size=${queryOptions.resultSize}&page=1&s_track_rating=desc&apikey=${ENV.apiKey}`).pipe(
        finalize(() => { this.uiState.notloading(); }),
        take(1)
      )
      .subscribe(json => {
        // console.log(json.message.body.track_list);
        this.setState({
          ...this.state,
          CurrentSearchTracks : this.beatDown(json['message'].body.track_list)
        });
      }, (err: HttpErrorResponse) => {
        this.uiState.setError(`An error occured, sorry: ${err.statusText}`);
      });
  }
}
