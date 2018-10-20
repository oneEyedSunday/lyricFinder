import { Injectable } from '@angular/core';
import {Store} from 'rxjs-observable-store';

@Injectable({
  providedIn: 'root'
})
// tslint:disable-next-line:class-name
export class uiStore extends Store<uiState> {

  constructor() {
    super(new uiState());
  }

  toggleLoading() {
    this.setState({
      ...this.state,
      loading: !this.state.loading
    });
  }

  setError(err) {
    this.setState({
      ...this.state,
      error: err
    });
  }

  loading() {
    this.setState({
      ...this.state,
      loading: true
    });
    console.log('loading called');
  }

  notloading() {
    this.setState({
      ...this.state,
      loading: false
    });
    console.log('not loading called');
  }

  setHeading(heading: string) {
    this.setState({
      ...this.state,
      heading
    });
  }
}

// tslint:disable-next-line:class-name
class uiState {
  heading = 'Lyric Finder App - Powered by MusixMatch';
  loading = true;
  error = undefined;
}
