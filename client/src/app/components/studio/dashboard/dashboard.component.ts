import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { VideoListingService } from 'src/app/services/video-listing.service';
import { VideoListing } from 'src/app/Interfaces/video';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user ?: User;
  videos : VideoListing[] = [];
  page : number = 0;

  creatorInsider : {imgsrc : string; title : string; content : string, reference : string}[] = [
    {
      imgsrc : "https://www.gstatic.com/youtube/img/promos/growth/a8047de2758b3fed2df89aa0c6ad59cdf567adca02cc75b9029b94193b62ba8b_1280x720.jpeg",
      title : "This Week at YouTube",
      content : `Hello Insiders! This week we're talking about the newly renamed "Shopping" tab in Studio (formerly "Merchandise"), the new Creator Safety Center site, and July Shorts Fund notifications`,
      reference : "https://www.youtube.com/watch?v=oLjFkzqAzDU"
    },
    {
      imgsrc : "https://www.gstatic.com/youtube/img/promos/growth/15c5d31932796871d19199ce6c0a41a6edb009b261a382d483caa763b76b3d66_1280x720.jpeg",
      title : "Shorts and the Algorithm",
      content : `Hello Insiders! Today we're back to answer your top questions about Shorts and the algorithm. Make sure to leave more questions below and we'll try to answer them in another video`,
      reference : "https://www.youtube.com/watch?v=DY_oxuM8niQ"
    }
  ]

  constructor(
    private userService : UserService,
    private authService : AuthService,
    private videoListingService : VideoListingService
  ) { }

  ngOnInit(): void {
    if (this.authService.loggedIn()) {
      this.userService.getUserById(this.authService.getUserIdFromToken()).subscribe(
        user => {
          this.user = user.data;
          this.initializeVideos();
        }
      )
    }
  }

  initializeVideos () {
    this.videoListingService.getChannelVideos(this.user?.userId, 0, false, 3, 'videoTotalViews').subscribe(
      res => {
        this.videos = res.data;
      }
    )
  }

  displayViews (view: number) : string {
    if (view == 0) return `0`;
    else if (view == 1) return `1`;
    else if (view < 1000) return `${view}`;
    else if (view < 10000) return `${(view/1000.0).toFixed(1)}K`;
    else if (view < 1000000) return `${Math.trunc(view/1000)}K`;
    else if (view < 10000000) return `${(view/1000000).toFixed(1)}M`;
    else if (view < 1000000000) return `${Math.trunc(view/1000000)}M`;
    else if (view < 10000000000) return `${(view/1000000000).toFixed(1)}B`;
    else return `${Math.trunc(view/1000000000)}B`;
  }

  leftClick() : void {
    if (this.page > 0) {
      this.page -= 1;
    }
  }

  rightClick() : void {
    if (this.page < 1) {
      this.page += 1;
    }
  }

}
