import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Interfaces/user';
import { VideoListing } from 'src/app/Interfaces/video';
import { UserService } from 'src/app/services/user.service';
import { VideoListingService } from 'src/app/services/video-listing.service';

@Component({
  selector: 'app-channel-videos',
  templateUrl: './channel-videos.component.html',
  styleUrls: ['./channel-videos.component.css']
})
export class ChannelVideosComponent implements OnInit {

  constructor(
    private videoListingService : VideoListingService,
    private userService : UserService,
    private route : ActivatedRoute
  ) { }

  videos: VideoListing[] = [];
  offset: number = 0;
  endOfList: boolean = false;

  user ?: User;

  ngOnInit(): void {
    let username = String(this.route.parent?.snapshot.paramMap.get('username'))
    this.userService.getUserByUsername(username).subscribe(
      res => {
        this.user = res.data;
        this.initializeVideos(this.user.userId); 
      }
    )

  }

  initializeVideos(userId : string | undefined) {
    this.endOfList = false;
    this.offset = 0;
    this.videoListingService.getChannelVideos(userId, this.offset, false, this.offset+60, 'videoCreatedAt')
      .subscribe(out=>{ 
        console.log(out);
        if(this.videos.length === 0) this.videos = out.data;
        else setTimeout(() => this.videos = out.data, 500)
      })
  }
  onScroll() {
    this.offset = this.offset + 60;
    if(!this.endOfList)
      this.videoListingService.getChannelVideos(this.user?.userId, this.offset, false, this.offset+60, 'videoCreatedAt')
        .subscribe(out=>{ 
          this.videos = this.videos.concat(out.data); 
          if (out.data.length == 0) this.endOfList = true;
        })
  }

}
