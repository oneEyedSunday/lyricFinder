import { TracksStore } from '../services/tracks.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
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
    this.getFromStoreOrAPI(id);
    return of(true);
  }

  constructor(private store: TracksStore) {
  }

  // or I could cache tracks in cachedTracks
  // then search store, then cached tracks, then finally new API request
  getFromStoreOrAPI(id) {
    // don't just check if store is populated
    // since we get track data bar lyrics from store
    const data = this.store.getTrackById(id);
    console.log(data);
    if (data) {
      return true;
    } else {
      // TODO (oneeyedsunday)
      // fetch tracks populate store
      // or just find particular track
      this.store.fetchTracks();
    }
  }
}
