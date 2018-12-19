import { Injectable } from '@angular/core';
import {Store} from 'rxjs-observable-store';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import ENV from './../../../env';
import { LyricsState, LyricObjectInterface } from '../interfaces';
import { uiStore } from '../services/ui.service';

@Injectable({
  providedIn: 'root'
})
// tslint:disable-next-line:class-name
export class lyricStore extends Store<LyricsState> {
  uiState: uiStore;

  constructor(private http: HttpClient, private _ui: uiStore) {
    super(new LyricsState());
    this.uiState = _ui;
  }

  fetchLyrics(trackId: string | number, trackName?: string) {
    if (this.state.lyrics && this.state.lyrics[trackId]) {
      console.log('Fetching lyrics from Store');
      return;
     }
    console.log(`fetching lyrics for: ${trackName} with id: ${trackId}`);
    // tslint:disable-next-line:max-line-length
    this.http.get(
      `${ENV.baseAPIURL}/ws/1.1/track.lyrics.get?track_id=${trackId}
      &apikey=${ENV.apiKey}`)
      .pipe(
        finalize(() => this._ui.notloading())
      )
      .subscribe(response => {
        const { status_code } = response['message'].header;
        const { lyrics } = response['message'].body;
        if (status_code !== 200) {
          if (status_code === 404) {
            this.setState({
              lyrics: {
                ...this.state.lyrics,
                [trackId]: { text: null, error: `The lyrics for ${trackName} were not found in the API` }
              }
            });
          } else {
            this.uiState.setError('Sorry, an error occured');
          }
          this.uiState.notloading();
        } else if (lyrics) {
          const typeToLyricObjectInterface: LyricObjectInterface  = {
            [trackId]: { text: lyrics.lyrics_body, error: null }
          };
          this.setState({
            lyrics: {...this.state.lyrics, ...typeToLyricObjectInterface }
          });

          // clear error
          // or separate lyric and track errors
          this.uiState.setError(undefined);
        }
      }, (err: HttpErrorResponse) => {
        this.uiState.setError(`Sorry, an error occured: ${err.statusText}`);
      });
  }
}
