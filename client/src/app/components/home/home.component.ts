import { Component, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { VideoListing } from 'src/app/Interfaces/video';
import { AuthService } from 'src/app/services/auth.service';
import { VideoListingService } from 'src/app/services/video-listing.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  category: string = 'all';
  videos: VideoListing[] = [];
  offset: number = 0;
  endOfList: boolean = false;

  constructor(
    private videoListingService: VideoListingService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.categoryClicked(this.category);
  }

  categoryClicked(category: string): void {
    if (category == 'All Videos') category = 'all';

    this.endOfList = false;
    this.category = category;
    this.offset = 0;

    this.videoListingService
      .getHomeVideos(category, this.offset, this._authService._userId)
      .subscribe((out) => {
        if (this.videos.length === 0) this.videos = out.data;
        else setTimeout(() => (this.videos = out.data), 500);
      });
  }

  onScroll() {
    this.offset = this.offset + 60;
    if (!this.endOfList)
      this.videoListingService
        .getHomeVideos(this.category, this.offset, this._authService._userId)
        .subscribe((out) => {
          this.videos = this.videos.concat(out.data);
          if (out.data.length == 0) this.endOfList = true;
        });
  }
}
