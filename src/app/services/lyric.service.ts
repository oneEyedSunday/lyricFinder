import { Injectable } from '@angular/core';
import {Store} from 'rxjs-observable-store';
import { HttpClient } from '@angular/common/http';
import ENV from './../../../env';
import { LyricsState } from '../interfaces/Lyrics'

@Injectable({
  providedIn: 'root'
})
// tslint:disable-next-line:class-name
export class lyricStore extends Store<LyricsState> {

  constructor(private http: HttpClient) {
    super(new LyricsState());
  }

  fetchLyrics(lyricId: string) {
    // tslint:disable-next-line:max-line-length
    this.http.get(`/api/ws/1.1/track.lyrics.get?track_id=${lyricId}&apikey=${ENV.apiKey}`).subscribe(
      json => {
        console.log(json);
        this.setState({
          lyrics: json['message'].body.lyrics.lyrics_body
        });
      });
  }
}
