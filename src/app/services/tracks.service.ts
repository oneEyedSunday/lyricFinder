import { Injectable } from '@angular/core';
import {Store} from 'rxjs-observable-store';
import { skip, finalize, take } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {uiStore} from './ui.service';
import ENV from './../../../env';
import { Observable, throwError } from 'rxjs';
import { SearchQuery as SearchQueryInterface } from './../interfaces';
import { TrackType, TrackState } from './../interfaces';


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

  // TODO: add env file and config
  fetchTracks() {
    this.uiState.loading();
    // tslint:disable-next-line:max-line-length
    this.http.get(`${ENV.baseAPIURL}/ws/1.1/chart.tracks.get?page=1&page_size=30&country=NA&f_has_lyrics=1&apikey=${ENV.apiKey}`).pipe(
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
        first_release_date, album_id, commontrack_id
      } = track;
      filtered.push( {
        track_name, album_name, artist_name, track_id, primary_genres, explicit,
        first_release_date, album_id, commontrack_id
      });
    });
    return filtered;
  }

  getTrackById(trackId: string): TrackType {
    let currTrack: TrackType;
    const allTracks = [
      ...this.state.tracklist,
      ...this.state.cachedTracks,
      ...this.state.CurrentSearchTracks
    ];

    for (let i = 0; i < allTracks.length; i++) {
      if (allTracks[i].commontrack_id.toString() === trackId) {
        console.log(allTracks[i], trackId);
        currTrack = allTracks[i];
        break;
      }
    }
    console.log('currTrack', currTrack)
    return currTrack;
  }

  // TODO (oneeyedsunday)\
  // fix data structure
  // so you switch between found tracks and ytacklist dependomg on urk;

  findTrack(queryOptions: SearchQueryInterface) {
    this.uiState.loading();
    this.http.get(
      // tslint:disable-next-line:max-line-length
      `${ENV.baseAPIURL}/ws/1.1/track.search?q_track=${queryOptions.title}
      &page_size=${queryOptions.resultSize}&page=1&s_track_rating=desc&apikey=${ENV.apiKey}`).pipe(
        finalize(() => {
          this.uiState.notloading();
          this.uiState.setError(undefined);
        }),
        take(1)
      )
      .subscribe(json => {
        // console.log(json.message.body);
        this.setState({
          ...this.state,
          CurrentSearchTracks : this.beatDown(json['message'].body.track_list)
        });
      }, (err: HttpErrorResponse) => {
        this.uiState.setError(`An error occured, sorry: ${err.statusText}`);
      });
  }

  getTrackFromAPIByTrackId(trackId: string) {
    this.uiState.loading();
    this.http.get(`${ENV.baseAPIURL}/ws/1.1/track.get?commontrack_id=${trackId}&apikey=${ENV.apiKey}`)
    .pipe(
      finalize(() => { this.uiState.notloading(); }),
      take(1)
    ).subscribe(response => {
      console.log(response['message'].header.status_code);
      const { status_code } = response['message'].header;
      if (status_code !== 200) {
        const errorMessage = status_code === 404 ? 'The track was not found' : 'An error occured';
        this.uiState.setError(errorMessage);
        this.uiState.notloading();
      }

      const {track} = response['message'].body;
      if (track) {
        const {
          track_name, album_name, artist_name, track_id, primary_genres, explicit,
          first_release_date, album_id, commontrack_id
        } = track;
        const filtered = {
          track_name, album_name, artist_name, track_id, primary_genres, explicit,
          first_release_date, album_id, commontrack_id
        };
        if (filtered) {
          console.log('filtered');
          const formerCachedTracks = this.state.cachedTracks || [];

          this.setState({
            ...this.state,
            cachedTracks: [...formerCachedTracks, filtered]
          });
        }
      }
      // add current track to state
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this.uiState.setError(`An error occured, sorry: ${err.statusText}`);
    });
  }
}
