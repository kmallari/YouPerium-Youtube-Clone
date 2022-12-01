import { Component, HostListener, OnInit } from '@angular/core';
import { Subject, switchMap } from 'rxjs';
import { VideoListing } from 'src/app/Interfaces/video';
import { AuthService } from 'src/app/services/auth.service';
import { VideoListingService } from 'src/app/services/video-listing.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/Interfaces/user';

@Component({
  selector: 'app-explore-videos',
  templateUrl: './explore-videos.component.html',
  styleUrls: ['./explore-videos.component.css']
})
export class ExploreVideosComponent implements OnInit {

 
  videos: VideoListing[] = [];
  offset: number = -24;
  endOfList: boolean = false;
  userData: User = {
    userId: '',
    username: '',
    userProfilePicture: '',
    email: '',
    firstName: '',
    lastName: '',
    age: 0,
    channelName: '',
    channelDescription: '',
    channelBanner: '',
    subscribersCount: 0,
    totalViews: 0,
    createdAt: 0
  };

  type: string = "explore";
  
  constructor(
    private videoListingService: VideoListingService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.onScroll();
    
    this.userService.selectedUser$.pipe(
      switchMap((response)=>  {
        this.userData = response;
        return this.videoListingService.getExploreVideos(this.userData.userId)
      })).subscribe((data)=>{
        this.videos = this.videos.concat(data.data); 
      })
    if (window.innerWidth < 660) this.type = "mini";
  }

  onScroll() {
    this.offset = this.offset + 24;
    if(!this.endOfList)
      this.videoListingService.getExploreVideos(this.userData.userId)
        .subscribe(out=> {       
          this.videos = this.videos.concat(out.data); 
          if (out.data.length == 0) this.endOfList = true;
        })
  }

  @HostListener("window:resize", []) updateCollpased() {
    if (window.innerWidth < 660) this.type = "mini";
    else this.type = "explore";
  }

}
