import { TracksStore, uiStore } from '../services';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackGuard implements CanActivate {
  snapshot: ActivatedRouteSnapshot;
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const id = next.paramMap.get('id');
    if (Number.isNaN(parseInt(id, 10))) {
      console.log('should set error');
      this.uiState.setError('Invalid url');
      // navigate home
      this.route.navigate(['/']);
      return of(false);
    }
    this.getFromStoreOrAPI(id);
    return of(true);
  }

  constructor(private store: TracksStore, private uiState: uiStore, private route: Router) {
  }

  // or I could cache tracks in cachedTracks
  // then search store, then cached tracks, then finally new API request
  getFromStoreOrAPI(id) {
    // check if store is populated
    // since we get track data bar lyrics from store
    if (this.store.state && this.store.state.tracklist && this.store.state.tracklist.length) {
      console.log('Store.state && store.state.tracklist && store.state.tracklist.length');
      const data = this.store.getTrackById(id);
      if (data) {
        return true;
      } else {
        // else find specify trcak
        this.store.getTrackFromAPIByTrackId(id);
      // and also top ten tracks
      }
    } else {
      this.store.getTrackFromAPIByTrackId(id);
      this.store.fetchTracks();
    }
  }
}
