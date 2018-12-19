import { UiState, defaultUiState  } from './../interfaces';
import { Injectable } from '@angular/core';
import {Store} from 'rxjs-observable-store';

@Injectable({
  providedIn: 'root'
})
// tslint:disable-next-line:class-name
export class uiStore extends Store<UiState> {

  constructor() {
    super(new UiState());
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

  setHeading(heading?: string) {
    const newHeading: string = heading ? heading : defaultUiState.heading;
      this.setState({
        ...this.state,
        heading: newHeading
      });
    }

  setSearchState(searchState) {
    console.log(searchState);
    this.setState({
      ...this.state,
      search: searchState
    });
  }
}
