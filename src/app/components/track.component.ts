import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-track',
  template: `
    <div class="col">
      <div class="card mb-4 shadow-sm">
        <div class="card-body">
          <h5>{{track.artist_name}}</h5>
          <p class="card-text">
           <strong><i class="fas fa-play"></i> Track : </strong>{{track.track_name}}
           <br />
           <strong><i class="fas fa-compact-disc"></i> Album : </strong>{{track.album_name}}
          </p>
          <a routerLink="/lyrics/track/{{track.track_id}}" class="btn btn-dark btn-block">
            <i class="fas fa-chevron-right"></i> View Lyrics
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TrackComponent implements OnInit {
  @Input() track;
  constructor() { }

  ngOnInit() {
  }

}
