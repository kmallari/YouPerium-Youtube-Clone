import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Interfaces/user';
import { VideoListing } from 'src/app/Interfaces/video';

@Component({
  selector: 'app-channels-list',
  templateUrl: './channels-list.component.html',
  styleUrls: ['./channels-list.component.css']
})
export class ChannelsListComponent implements OnInit {

  @Input() channels: User[] = [];
  

  tempThumbnail = "http://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/video-thumbnails/defaultThumbnail.jpg";
  pagelink = "http://localhost:4200/sampleLink";
  authService: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.log(this.channels)
  }

  displaySubs (subscriber: number) : string {
    if (subscriber == 0) return `No subscriber`;
    else if (subscriber == 1) return `1 subscribers`;
    else if (subscriber < 1000) return `${subscriber} subscribers`;
    else if (subscriber < 10000) return `${(Math.trunc(subscriber*100)/10).toFixed(1)}K subscribers`;
    else if (subscriber < 1000000) return `${Math.trunc(subscriber/1000)}K subscribers`;
    else if (subscriber < 10000000) return `${(Math.trunc(subscriber/100000)/10).toFixed(1)}M subscribers`;
    else if (subscriber < 1000000000) return `${Math.trunc(subscriber/1000000)}M subscribers`;
    else if (subscriber < 10000000000) return `${(Math.trunc(subscriber*100000000)/10).toFixed(1)}B subscribers`;
    else return `${Math.trunc(subscriber/1000000000)}B subscribers`;
  }

  displayViews(view: number): string {
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

  getPicture(id: string): string {
    if(id) return `https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/${id}.jpg`;
    else return "https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png";
  }

  changeSource(event : any) {
    event.onerror = null;
    event.target.src = "https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png";
  }

  canSubscribe(channelId: string) : boolean {
    return true;
    // fixed ko to after, for some reason nag-error yung getUserIdFromToken right now
    // dapat false if yung channel ay same sa logged in user
    if (this.authService.getUserIdFromToken() == channelId) return false;
    else return true;
  }

  subscribeToChannel(channelId: string) : void {
    //logic
  }
}
