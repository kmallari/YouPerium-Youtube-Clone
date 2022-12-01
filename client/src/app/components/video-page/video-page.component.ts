import { Component, OnInit, ElementRef, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap } from 'rxjs';
import { ReceivedVideo, ReceivedVideoListing, VideoForPlaylist, VideoListing } from 'src/app/Interfaces/video';
import { AuthService } from 'src/app/services/auth.service';
import { VideoListingService } from 'src/app/services/video-listing.service';
import { VideoService } from 'src/app/services/video.service';
import videojs from 'video.js';

@Component({
  selector: 'app-video-page',
  templateUrl: './video-page.component.html',
  styleUrls: ['./video-page.component.css'],
})
export class VideoPageComponent implements OnInit, OnDestroy {

  @ViewChild('target', { static: true }) target!: ElementRef;
  player!: videojs.Player;

  videos!: ReceivedVideoListing;
  video!: VideoListing

  truncated: boolean = true;
  longText: boolean = false;
  bigScreen: boolean = true;
  pagelink: string = "http://localhost:4200/";

  options = { 
    autoplay:true, 
    muted:false, 
    controls:true,
    playsinline:true,
    poster: "http://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/video-thumbnails/defaultThumbnail.jpg",
    sources: [{ src: "", type: "" }],
    controlBar: {
      pictureInPictureToggle: false,
    },
  };

  createdAt: number = 1658148441;
  date: string = '';
  videoId: string = ''; 
  currentVideo!: ReceivedVideo;
  
  showNext: boolean = false; 
  reloadNext: boolean = true; 
  incremented: boolean = false;

  playlistId: string = '';
  componentHeight: string = "51px";
  profileSize: string = "48px";

  constructor(
    private elementRef: ElementRef,
    private videoService: VideoService,
    private videoListingService: VideoListingService,
    private route: ActivatedRoute,
    private authService : AuthService
  ) {}

  ngOnInit() {
    console.log(this.route.snapshot.paramMap);
    this.route.queryParams.subscribe(val => { 
      this.videoId = this.route.snapshot.queryParamMap.get('v')!;

      this.playlistId = this.route.snapshot.queryParamMap.get('list')!;

      this.videoService.getVideoInformation(this.videoId).pipe(switchMap( out => {
        this.currentVideo = out;
        this.createdAt = out.data.videoCreatedAt;

        
        let newVideo: VideoForPlaylist = {
          videoId: this.currentVideo.data.videoId,
          videoTitle: this.currentVideo.data.videoTitle,
          videoDescription: this.currentVideo.data.videoDescription,
          videoCategory: this.currentVideo.data.videoCategory,
          videoCreatedAt: this.currentVideo.data.videoCreatedAt,
          videoTotalViews: this.currentVideo.data.videoTotalViews,
          videoDuration: this.currentVideo.data.videoDuration,
          userId: this.currentVideo.data.userId,
          subscribersCount: this.currentVideo.data.subscribersCount,
          userProfilePicture: this.currentVideo.data.userProfilePicture,
          videoChannelName: this.currentVideo.data.channelName,
          videoThumbnailUrl: this.currentVideo.data.videoThumbnailPath,
        };
        console.log("Setting video to", newVideo);
        this.videoService.setVideo(newVideo);

        console.log("Showing Video from route")
        if(this.player) {
          this.player.src({ type: 'video/mp4', src: out.data.videoFilePath });
          this.reloadNext = false;
          this.incremented = false;
          setTimeout(() => this.reloadNext = true , 1000) ;

          let descElem = document.getElementById('description'); 
          if(descElem!.scrollHeight > descElem!.clientHeight) this.longText = true;
          else this.longText = false;
        } else {
          this.options.poster = out.data.videoThumbnailPath;
          this.options.sources = [{
            src: out.data.videoFilePath, 
            type: 'video/mp4' 
          }];
          this.player = videojs(this.target.nativeElement, this.options);
        }
        
        this.date = this.formatDate();
        this.pagelink = `${this.pagelink}watch?v=${this.videoId}`;

        this.player.on('play', () => {
          let event = {
            _eventType : 'video_viewed', 
            _sentAt : new Date(), 
            _sessionId : this.authService._sessionId, 
            _userId : this.authService._userId
          }
          
          if(!this.incremented) 
            this.videoService.incrementVideoTotalViews(this.videoId, event).subscribe();
          this.incremented = true;
        })

        let self = this;
        this.player.on('ended', () => {
          self.showNext = true;
        });

        this.videoService.getNextVideo(this.videoId, this.currentVideo?.data.videoCategory).subscribe(
          out => {
            this.video = out.data;
            console.log( "Recommending ", out)
          }
        )
        
        if (document.readyState !== 'loading') {
          setTimeout(()=> {
            let descElem = document.getElementById('description'); 
            if(descElem!.scrollHeight > descElem!.clientHeight) this.longText = true;
            else this.longText = false;
          }, 1000);
        }

        return this.videoListingService.getRecommendedVideos(this.videoId, 0, this.currentVideo?.data.videoCategory)
      })).subscribe(
        out => {
          this.videos = out;
      })
    }); 
    
    if (window.innerWidth < 993) this.bigScreen = false;

  }


  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }

  hideNext(): void {
    this.showNext = false;
  }

  displayViews (view: number) : string {
    if (view == 0) return `No views`;
    else if (view == 1) return `1 view`;
    else if (view < 1000) return `${view} views`;
    else if (view < 10000) return `${(view / 1000.0).toFixed(1)}K views`;
    else if (view < 1000000) return `${Math.trunc(view / 1000)}K views`;
    else if (view < 10000000) return `${(view / 1000000).toFixed(1)}M views`;
    else if (view < 1000000000) return `${Math.trunc(view / 1000000)}M views`;
    else if (view < 10000000000)
      return `${(view / 1000000000).toFixed(1)}B views`;
    else return `${Math.trunc(view / 1000000000)}B views`;
  }

  displayTotalViews(view: number): string {
    if (view == 0) return 'No views';
    else if (view == 1) return '1 view';
    else return view.toLocaleString() + ' views';
  }

  formatDate(): string {
    let date = new Date(0);
    date.setUTCSeconds(this.createdAt);

    let dateStr = date.toString().split(' ');
    return dateStr[1] + ' ' + dateStr[2] + ', ' + dateStr[3];
  }

  getTime(time: number): [number, string] {
    let now = Math.floor(new Date().getTime() / 1000) + 1;
    let timeDiff = now - time;

    if (timeDiff < 60) return [timeDiff, ' sec'];
    else if (timeDiff >= 60 && timeDiff < 3600)
      return [Math.floor(timeDiff / 60), ' min'];
    else if (timeDiff >= 3600 && timeDiff < 86400)
      return [Math.floor(timeDiff / 3600), ' hour'];
    else if (timeDiff >= 86400 && timeDiff < 2592000)
      return [Math.floor(timeDiff / 86400), ' day'];
    else if (timeDiff >= 2592000 && timeDiff < 31536000)
      return [Math.floor(timeDiff / 2592000), ' month'];
    else return [Math.floor(timeDiff / 31536000), ' month'];
  }

  formatTime(time: number): string {
    let timeStr = this.getTime(time);
    if (timeStr[0] == 1) return timeStr[0].toString() + timeStr[1] + ' ago';
    else return timeStr[0].toString() + timeStr[1] + 's ago';
  }

  getThumbnail(path?: string): string {
    if (path) return path;
    else return "http://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/video-thumbnails/defaultThumbnail.jpg";
  }

  changeSource(event : any): void {
    event.onerror = null;
    event.target.src = "http://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/video-thumbnails/defaultThumbnail.jpg";
  }

  changeTruncated(): void {
    this.truncated = !this.truncated;
  }

  @HostListener("window:resize", []) updateCollpased() {
    let descElem = document.getElementById('description'); 
    if(descElem!.scrollHeight > descElem!.clientHeight) this.longText = true;
    else this.longText = false;

    if (window.innerWidth < 993) this.bigScreen = false;
    else this.bigScreen = true;
  }
}
