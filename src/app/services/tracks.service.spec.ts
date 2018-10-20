import { TestBed, inject } from '@angular/core/testing';

import { TracksStore } from './tracks.service';

describe('TracksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TracksStore]
    });
  });

  it('should be created', inject([TracksStore], (service: TracksStore) => {
    expect(service).toBeTruthy();
  }));
});
