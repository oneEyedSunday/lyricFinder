import { Injectable } from '@angular/core';
import {Store} from 'rxjs-observable-store';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { skip, finalize, take } from 'rxjs/operators';
import {uiStore} from './ui.service';
import ENV from './../../../env';
import { SearchQuery as SearchQueryInterface, TrackType, TrackState } from './../interfaces';


@Injectable({
  providedIn: 'root'
})
export class TracksStore extends Store<TrackState> {
  constructor(private http: HttpClient, private uiState: uiStore) {
    super(new TrackState());
  }

  // TODO (oneeyedsunday)
  // follow observable pattern
  getTracksFromStoreOrAPI(): Observable<any> | any {
    if (this.state.tracklist && this.state.tracklist.length > 0 ) {
      // remove any error
      // especially since if track wasnt found throws an error
      console.log('using data from store');
      // this.uiState.setState({
      //   ...this.uiState.state,
      //   error: undefined
      // });
    } else {
      this.fetchTracks();
      console.log('making API call');
        return this.state$.pipe(
          skip(1)
        );
    }
  }

  fetchTracks() {
    this.uiState.loading();
    this.http
    .get(`${ENV.baseAPIURL}/ws/1.1/chart.tracks.get?page=1&page_size=30&country=NA&f_has_lyrics=1&apikey=${ENV.apiKey}`)
    .pipe(
      finalize(() => { this.uiState.notloading(); }),
      take(1)
    ).subscribe(
      json => {
        this.setState({
          ...this.state,
          tracklist : this.getRequiredProps(json['message'].body.track_list)
        });
      }, (err: HttpErrorResponse) => {
        this.uiState.setError(`Sorry, an error occured: ${err.statusText}`);
      });
  }

  extractProps(initialObject): TrackType {
    const {
      track_name, album_name, artist_name, track_id, primary_genres, explicit,
      first_release_date, album_id, commontrack_id
    } = initialObject;
    return {
      track_name, album_name, artist_name, track_id, primary_genres, explicit,
      first_release_date, album_id, commontrack_id
    };
  }

  getRequiredProps(data: Array<any>): TrackType[] {
    const filteredTracks: TrackType[] = [];
    const deepCopied: Array<any> = JSON.parse(JSON.stringify(data));
    deepCopied.map(({track}) => {
      filteredTracks.push(this.extractProps(track));
    });
    return filteredTracks;
  }

  getTrackById(trackId: string): TrackType {
    let currTrack: TrackType;
    const allTracks: TrackType[] = [
      ...this.state.tracklist,
      ...this.state.cachedTracks,
      ...this.state.CurrentSearchTracks
    ];

    for (let i = 0; i < allTracks.length; i++) {
      if (allTracks[i].commontrack_id.toString() === trackId) {
        currTrack = allTracks[i];
        break;
      }
    }
    return currTrack;
  }

  findTrack(queryOptions: SearchQueryInterface) {
    this.uiState.loading();
    this.http.get(
      `${ENV.baseAPIURL}/ws/1.1/track.search?q_track=${queryOptions.title}
      &page_size=${queryOptions.resultSize}&page=1&s_track_rating=desc&apikey=${ENV.apiKey}`)
      .pipe(
        finalize(() => {
          this.uiState.notloading();
          this.uiState.setError(undefined);
        }),
        take(1)
      )
      .subscribe(response => {
        const { track_list } = response['message'].body;
        this.setState({
          ...this.state,
          CurrentSearchTracks : this.getRequiredProps(track_list)
        });
      }, (err: HttpErrorResponse) => {
        this.uiState.setError(`Sorry, an error occured: ${err.statusText}`);
      });
  }

  getTrackFromAPIByTrackId(trackId: string) {
    this.uiState.loading();
    this.http.get(`${ENV.baseAPIURL}/ws/1.1/track.get?commontrack_id=${trackId}&apikey=${ENV.apiKey}`)
    .pipe(
      finalize(() => { this.uiState.notloading(); }),
      take(1)
    ).subscribe(response => {
      const { status_code } = response['message'].header;
      if (status_code !== 200) {
        const errorMessage = status_code === 404 ? 'The track was not found' : 'Sorry, an error occured';
        this.uiState.setError(errorMessage);
        this.uiState.notloading();
      }

      const {track} = response['message'].body;
      if (track) {
        const filtered = this.extractProps(track);
        if (filtered) {
          const formerCachedTracks = this.state.cachedTracks || [];
          this.setState({
            ...this.state,
            cachedTracks: [...formerCachedTracks, filtered]
          });
        }
      }
    }, (err: HttpErrorResponse) => {
      console.error(err);
      this.uiState.setError(`Sorry, an error occured: ${err.statusText}`);
    });
  }
}
