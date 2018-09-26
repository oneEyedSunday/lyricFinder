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

  getTrackById(trackId: string): trackType {
    let currTrack: trackType;
    this.state.tracklist.map(track => {
      if (track.track_id.toString() === trackId) {
        currTrack = track;
      }
    });

    return currTrack;
  }

  findTrack(query: string) {
    this.http.get(
      `/api/ws/1.1/track.search?q_track=${query}&page_size=5&page=1&s_track_rating=desc&apikey=df8bb52b21472814f3ae35139ba4e50e`)
      .subscribe(json => {
        // console.log(json.message.body.track_list);
        this.setState({
          tracklist : this.beatDown(json['message'].body.track_list)
        });
      });
  }
}

// tslint:disable-next-line:class-name
interface trackType {
  track_name: string;
  album_name: string;
  artist_name: string;
  track_id: string;
  album_id: string;
  primary_genres: any;
  explicit: string;
  first_release_date: string;
}

// tslint:disable-next-line:class-name
interface tracknameType {
  track: trackType;
}


class TrackState {
 tracklist: trackType[] = [
 ];
}


