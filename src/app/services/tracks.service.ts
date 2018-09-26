import { Injectable } from '@angular/core';
import {Store} from 'rxjs-observable-store';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TracksStore extends Store<TrackState> {

  constructor(private http: HttpClient) {
    super(new TrackState());
  }

  // TODO: add env file and config
  fetchTracks() {
    // tslint:disable-next-line:max-line-length
    this.http.get(`/api/ws/1.1/chart.tracks.get?page=1&page_size=10&country=jp&f_has_lyrics=1&apikey=df8bb52b21472814f3ae35139ba4e50e`).subscribe(
      json => {
        // console.log(json.message.body.track_list);
        this.setState({
          tracklist : this.beatDown(json['message'].body.track_list)
        });
      });
  }

  beatDown(data): trackType[] {
    const filtered: trackType[] = [];
    const deep = JSON.parse(JSON.stringify(data));
    deep.map(({track}) => {
      const {
        track_name, album_name, artist_name, track_id
      } = track;
      filtered.push( {
        track_name, album_name, artist_name, track_id
      });
    });
    return filtered;
  }

  getTrackById(trackId: string): trackType {
    let currTrack: trackType;
    this.state.tracklist.map(track => {
      if (track.track_id.toString() === trackId) {
        currTrack = track;
      }
    });

    return currTrack;
  }
}



// tslint:disable-next-line:class-name
interface trackType {
  track_name: string;
  album_name: string;
  artist_name: string;
  track_id: string;
}

// tslint:disable-next-line:class-name
interface tracknameType {
  track: trackType;
}


class TrackState {
 tracklist: trackType[] = [
  // {
  //   track: {track_name: 'abc', album_name: 'Album name', artist_name: 'Artist Name'}
  // }
 ];
}


/* 
// methods
  updateTestProperty (): void {
      this.setState({
          ...this.state,
          testProperty: 'updated value',
      });
  }
}

*/

/*
//use in component
class TestComponent {
  store: TestStore;

  constructor () {
      this.store = new TestStore();

      this.store.state$.subscribe(state => {
          console.log(state);
      });

      setTimeout(() => {
          this.store.updateTestProperty();
      }, 3000);
  }
}

*/
