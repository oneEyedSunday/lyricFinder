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

  getFromStoreOrAPI(id) {
    // don't just check if store is populated
    // since we get track data bar lyrics from store
    const data = this.store.getTrackById(id);
    console.log(data);
    if (data) {
      return true;
    } else {
      // fetch tracks populate store
      this.store.fetchTracks();
    }
  }
}
