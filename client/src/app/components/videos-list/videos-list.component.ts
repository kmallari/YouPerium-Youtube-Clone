import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VideoListing } from 'src/app/Interfaces/video';
import { VideoForPlaylist } from 'src/app/Interfaces/video';
import { VideoService } from 'src/app/services/video.service';
@Component({
  selector: 'app-videos-list',
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.css']
})
export class VideosListComponent implements OnInit {

  @Input() videos: VideoListing[] = [];
  @Input() type: string = "mini";

  pagelink: string = "http://localhost:4200/watch?v=";
  baselink: string = "http://localhost:4200/watch?v=";

  constructor(
    private router: Router,
    private videoService: VideoService
  ) { }

  ngOnInit(): void {
  }

  getThumbnail(path?: string): string {
    if (path) return path
    else return 'http://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/video-thumbnails/defaultThumbnail.jpg';
  }

  changeLink(id: string): void {
    this.pagelink = this.baselink + id;
  }

  displayViews (view: number) : string {
    if (view == 0) return `No views`;
    else if (view == 1) return `1 view`;
    else if (view < 1000) return `${view} views`;
    else if (view < 10000) return `${(Math.trunc(view*100)/10).toFixed(1)}K views`;
    else if (view < 1000000) return `${Math.trunc(view/1000)}K views`;
    else if (view < 10000000) return `${(Math.trunc(view/100000)/10).toFixed(1)}M views`;
    else if (view < 1000000000) return `${Math.trunc(view/1000000)}M views`;
    else if (view < 10000000000) return `${(Math.trunc(view*100000000)/10).toFixed(1)}B views`;
    else return `${Math.trunc(view/1000000000)}B views`;
  }

  
  getTime(time: number) : [number, string] {
    let now = Math.floor((new Date()).getTime()/1000) + 1;
    let timeDiff = now - time;

    if (timeDiff < 60) return [timeDiff, ' sec'];
    else if (timeDiff >= 60 && timeDiff < 3600) return [(Math.floor(timeDiff/60)), ' min'];
    else if (timeDiff >= 3600 &&  timeDiff < 86400) return [(Math.floor(timeDiff/3600)), ' hour'];
    else if (timeDiff >= 86400 && timeDiff < 2592000) return [(Math.floor(timeDiff/86400)), ' day'];
    else if (timeDiff >= 2592000 && timeDiff < 31536000) return [(Math.floor(timeDiff/2592000)), ' month']; 
    else return [(Math.floor(timeDiff/31536000)), ' month']; 
  }

  formatTime(time: number) : string {
    let timeStr = this.getTime(time)
    if(timeStr[0] == 1) return timeStr[0].toString() + timeStr[1] + ' ago';
    else return timeStr[0].toString() + timeStr[1] + 's ago';
  }

  getPicture(id: string): string {
    if(id) return `https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/${id}.jpg`;
    else return "https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png";
  }

  changeSourceThumbnail(event : any) {
    event.onerror = null;
    event.target.src = "http://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/video-thumbnails/defaultThumbnail.jpg";
  }

  changeSourceProfile(event : any) {
    event.onerror = null;
    event.target.src = "https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png";
  }
  getVideoData(video: VideoListing) {
    //conversion of data
    let newVideo: VideoForPlaylist = {
      videoId: video.videoId,
      videoTitle: video.videoTitle,
      videoDescription: video.videoDescription,
      videoCategory: video.videoCategory,
      videoCreatedAt: video.videoCreatedAt,
      videoTotalViews: video.videoTotalViews,
      videoDuration: video.videoDuration,
      userId: video.userId,
      subscribersCount: video.subscribersCount,
      userProfilePicture: video.userProfilePicture,
      videoChannelName: video.channelName,
      videoThumbnailUrl: video.videoThumbnailPath,
    };
    console.log(newVideo);
    this.videoService.setVideo(newVideo);
    //get which playlists they are a part of
  }
}
