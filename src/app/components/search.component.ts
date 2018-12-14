import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TracksStore as TracksService , uiStore as uiService} from './../services';
import { SearchQuery as SearchQueryInterface } from './../interfaces/Search';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-search',
    template: `
            <div class="card card-body mb-4 p-4">
                <h1 class="display-4 text-center">
                    <i class="fas fa-music"></i> Search For a Song
                </h1>
                <p class="lead text-center"> and get the Lyrics</p>
                <form [formGroup]="searchForm" (ngSubmit)="onSubmit()">
                    <div class="form-group">
                        <input class="form-control form-control-lg" placeholder="Song title..."  formControlName="trackTitle" />
                    </div>
                    <div class="button_container">
                    <button class="btn btn-primary three-fourth" type="submit" [disabled]="searchForm.invalid">Get Track Lyrics</button>
                    <input formControlName="noOfResults"  class="px-2" type="number" max="20" min="5"/>
                    </div>
                </form>
            </div>
    `,
  styles: [
    `
      .button_container {
        display: flex;
        flex-direction: row;
        justify-content: center
      }

      .three-fourth {
        flex: 3;
        margin-right: 5%
      }
    `
  ],
  providers: []
})


// TODO (oneeyedsunday)
// emit a value to help with pagination

// TODO (oneeyedsunday)
// Home page country


export class SearchComponent implements OnInit, OnDestroy {
  @Output() search = new EventEmitter();
  trackTitle: FormControl;
  noOfResults: FormControl;
  searchForm: FormGroup;
  searchOptionsSub: Subscription;
    constructor(private formBuilder: FormBuilder, private tracksService: TracksService,
        private _ui: uiService) {
          // TODO (oneeyedsunday)
          // make users aware of errors
       this.trackTitle = new FormControl('', Validators.required);
       this.noOfResults = new FormControl(5, {
         validators: [Validators.required, Validators.min(5), Validators.max(20)]
       });
    }

    ngOnInit() {
        this.searchForm = this.formBuilder.group({
            trackTitle: this.trackTitle,
            noOfResults: this.noOfResults
        });

        this.searchOptionsSub = this.searchForm.valueChanges.subscribe(changes => {
          if (changes.trackTitle.length === 0 || this.searchForm.invalid) {
            this.search.emit({
              type: 'SHOW DEFAULT TRACKS',
              code: 0
            });
            this._ui.setHeading();
          }
          console.log(changes);
        });
    }

    onSubmit() {
        // console.log(this.searchForm.controls);
        if (this.searchForm.invalid) {
          return;
        }
        const searchOptions: SearchQueryInterface = {
          title: this.searchForm.value['trackTitle'],
          resultSize: parseInt(this.searchForm.value['noOfResults'], 10)
        };
        this.tracksService.findTrack(searchOptions);

        this.search.emit({
          type: 'Search Initiated',
          code: 1
        });
        // TODO (oneeyedsunday)
        // perhaps make this conditional on successful search
        this._ui.setHeading(`Search Results: ${searchOptions.title}`);
    }

    ngOnDestroy() {
      this.searchOptionsSub.unsubscribe();
    }
}

