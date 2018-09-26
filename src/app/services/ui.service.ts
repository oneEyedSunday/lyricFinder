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
      heading: this.state.heading,
      loading: !this.state.loading
    });
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
  heading = 'Top 10 Tracks';
  loading = true;
}
