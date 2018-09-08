import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-tracks',
  template: `
    <div class="row">
      <app-track *ngFor="let track of tracks.tracklist" [track]="track"></app-track>
    </div>
  `,
  styles: [],
})
export class TracksComponent implements OnInit {
  @Input() tracks;
  constructor() {
  }

  ngOnInit() {
  }

}
