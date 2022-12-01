import { TestBed } from '@angular/core/testing';

import { VideoListingService } from './video-listing.service';

describe('VideoListingService', () => {
  let service: VideoListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
