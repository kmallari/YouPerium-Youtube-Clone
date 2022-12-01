import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { User } from 'src/app/Interfaces/user';
import { Component, OnInit, HostListener } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {

  user !: User;

  category: string = 'all';
  offset: number = 0;
  endOfList: boolean = false;

  homeActive : boolean = false;
  videoActive : boolean = false;
  playlistActive : boolean = false;
  aboutActive : boolean = false;
  _noHeader : boolean = false;

  bannerUrl : string = '';

  constructor(
    private route : ActivatedRoute,
    private userService : UserService,
    private router : Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
  }

  ngOnInit(): void {
    this.getUserFromRoute();
  }

  getUserFromRoute() {
    let username = String(this.route.snapshot.paramMap.get('username'))
    this.userService.getUserByUsername(username).subscribe(
      user => {
        this.user = user.data;
        let urlAppend = this.user?.channelName.replace(/\s/g, '%20');
        this.bannerUrl = this.getChannelBanner(this.user);
        console.log(this.bannerUrl);
        /*if (window.location.pathname === `/c/${urlAppend}`) {
          this.homeActive = true;
          this.videoActive = false;
          this.playlistActive = false;
          this.aboutActive = false;
        } else */if (window.location.pathname === `/c/${urlAppend}`) {
          this.homeActive = false;
          this.videoActive = true;
          this.playlistActive = false;
          this.aboutActive = false;
        } else if (window.location.pathname === `/c/${urlAppend}/playlists`) {
          this.homeActive = false;
          this.videoActive = false;
          this.playlistActive = true;
          this.aboutActive = false;
        } else if (window.location.pathname === `/c/${urlAppend}/about`) {
          this.homeActive = false;
          this.videoActive = false;
          this.playlistActive = false;
          this.aboutActive = true;
        }
      }
    )

  }

  getChannelBanner(user : User) : string {
    return `https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/${user.channelBanner}.jpg`
  }

  noHeader(event : any) {
    this._noHeader = true;

  }
  // click event methods
  onHomeClick() {
    this.router.navigate([`${this.route.snapshot.url[0].path + '/' + this.route.snapshot.url[1].path}`], {relativeTo: this.route.parent})
  }

  onChannelNavClicked(route : string) : void {
    this.router.navigate([`${route}`], {relativeTo: this.route})
  }
}
