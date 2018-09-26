import { Injectable } from '@angular/core';
import {Store} from 'rxjs-observable-store';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
// tslint:disable-next-line:class-name
export class lyricStore extends Store<lyricState> {

  constructor(private http: HttpClient) {
    super(new lyricState());
  }

  fetchLyrics(lyricId: string) {
    // tslint:disable-next-line:max-line-length
    this.http.get(`/api/ws/1.1/track.lyrics.get?track_id=${lyricId}&apikey=df8bb52b21472814f3ae35139ba4e50e`).subscribe(
      json => {
        console.log(json);
        this.setState({
          lyrics: json['message'].body.lyrics.lyrics_body
        });
      });
  }
}



// tslint:disable-next-line:class-name
class lyricState {
  lyrics: ''
}
