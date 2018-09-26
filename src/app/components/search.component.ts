import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TracksStore as TracksService , uiStore as uiService} from './../services';

@Component({
    selector: 'app-search',
    template: `
            <div class="card card-body mb-4 p-4">
                <h1 class="display-4 text-center">
                    <i class="fas fa-music"></i> Search For a Song
                </h1>
                <p class="lead text-center">Get the Lyrics for any song</p>
                <form [formGroup]="searchForm" (ngSubmit)="onSubmit()">
                    <div class="form-group">
                        <input class="form-control form-control-lg" placeholder="Song title..."  formControlName="trackTitle" />
                    </div>
                    <button class="btn btn-primary btn-lg btn-block mb-5" type="submit">Get Track Lyrics</button>
                </form>
            </div>
    `,
  styles: [],
  providers: []
})

export class SearchComponent implements OnInit {
    trackTitle: FormControl;
    searchForm: FormGroup;
    constructor(private formBuilder: FormBuilder, private tracksService: TracksService,
        private _ui: uiService) {
       
       this.trackTitle = new FormControl('');
    //    this.trackTitle.valueChanges.subscribe(changes => {console.log(changes);});
    }

    ngOnInit() {
        this.searchForm = this.formBuilder.group({
            trackTitle: ['', Validators.required]
        });
    }

    onSubmit() {
        // validate
        // console.log(this.searchForm.controls);
        this.tracksService.findTrack(this.searchForm.value['trackTitle']);
        this._ui.setHeading('Search Results');

    }
}

