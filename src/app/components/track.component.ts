import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-track',
  template: `
      <div class="card mb-4 shadow-sm height--fix">
        <div class="card-body">
          <h5>{{track.artist_name}}</h5>
          <p class="card-text">
           <strong><i class="fas fa-play"></i> Track : </strong>{{track.track_name}}
           <br />
           <strong><i class="fas fa-compact-disc"></i> Album : </strong>{{track.album_name}}
          </p>
          <a routerLink="/{{track.commontrack_id}}" class="btn btn-dark btn-block">
            <i class="fas fa-chevron-right"></i> View Lyrics
          </a>
        </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
    .height--fix {
      height: 90%;
    }
    `
  ]
})
export class TrackComponent implements OnInit {
  @Input() track;
  constructor() { }

  ngOnInit() {
  }

}
