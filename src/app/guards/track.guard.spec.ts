import { TestBed, async, inject } from '@angular/core/testing';

import { TrackGuard } from './track.guard';

describe('TrackGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackGuard]
    });
  });

  it('should ...', inject([TrackGuard], (guard: TrackGuard) => {
    expect(guard).toBeTruthy();
  }));
});
