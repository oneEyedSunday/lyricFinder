import { Injectable } from '@angular/core';
import {Store} from 'rxjs-observable-store';
import { HttpClient } from '@angular/common/http';
import ENV from './../../../env';
import { LyricsState } from '../interfaces';
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
    // tslint:disable-next-line:max-line-length
    this.http.get(
      `${ENV.baseAPIURL}/ws/1.1/track.lyrics.get?track_id=${trackId}
      &apikey=${ENV.apiKey}`).subscribe(response => {
        const { status_code } = response['message'].header;
        const { lyrics } = response['message'].body;
        if (status_code !== 200) {
          const errorMessage = status_code === 404 ? `The lyrics for ${trackName} not found` : 'An error occured';
          this.uiState.setError(errorMessage);
          this.uiState.notloading();
        } else if (lyrics) {
          this.setState({
            lyrics: lyrics.lyrics_body
          });
        }
      });
  }
}
