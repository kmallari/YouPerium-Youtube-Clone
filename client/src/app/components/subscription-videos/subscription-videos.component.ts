import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VideoListing } from 'src/app/Interfaces/video';
import { AuthService } from 'src/app/services/auth.service';
import { VideoListingService } from 'src/app/services/video-listing.service';

@Component({
  selector: 'app-subscription-videos',
  templateUrl: './subscription-videos.component.html',
  styleUrls: ['./subscription-videos.component.css'],
})
export class SubscriptionVideosComponent implements OnInit {
  timeRanges = ['today', 'thisWeek', 'thisMonth', 'older'];
  videos: any = {
    today: [],
    thisWeek: [],
    thisMonth: [],
    older: [],
  };

  timeRangeIndex = 0;

  offset: number = -60;
  endOfList: boolean = false;

  userId?: string;
  loggedIn: boolean = false;

  constructor(
    private videoListingService: VideoListingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    if (this.authService.loggedIn()) {
      this.loggedIn = true;
      this.userId = this.authService.getUserIdFromToken();
      this.onScroll();
    }

    this.getVideos();
  }

  onSignInClicked(): void {
    this.router.navigate(['/login']);
  }

  getVideos() {
    if (this.timeRangeIndex > 3) return;

    this.offset = this.offset + 60;
    if (this.endOfList && this.timeRangeIndex < 3) {
      this.timeRangeIndex++;
      this.offset = 0;
      this.endOfList = false;
    }

    if (!this.endOfList)
      this.videoListingService
        .getSubscriptionVideos(
          this.userId!,
          this.timeRanges[this.timeRangeIndex],
          this.offset
        )
        .subscribe((out) => {
          let filteredDuplicates;
          if (this.timeRangeIndex > 0) {
            let checkData: VideoListing[] = [];

            for (let i = 0; i < this.timeRangeIndex; i++) {
              checkData = checkData.concat(this.videos[this.timeRanges[i]]);
            }

            filteredDuplicates = out.data.filter(
              (video) =>
                !checkData.some(
                  (v: VideoListing) => v.videoId === video.videoId
                )
            );
          } else {
            filteredDuplicates = out.data;
          }
          this.videos[this.timeRanges[this.timeRangeIndex]] =
            this.videos[this.timeRanges[this.timeRangeIndex]].concat(
              filteredDuplicates
            );

          if (out.data.length < 60) {
            console.log('end of list');
            this.endOfList = true;
          }

          // check if videos are less than a number of videos
          // if so, call getVideos again
          // if not, stop

          let numDisplayedVideos = 0;

          for (let i = 0; i < this.timeRangeIndex; i++) {
            numDisplayedVideos += this.videos[this.timeRanges[i]].length;
          }

          if (numDisplayedVideos < 10 && this.timeRangeIndex < 4) {
            this.getVideos();
          }



        });
  }

  onScroll() {
    this.getVideos();
  }
}
