import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { PlaylistService } from 'src/app/services/playlist.service';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap } from 'rxjs';
import { Playlist } from 'src/app/Interfaces/playlist';
import { Router } from '@angular/router';
import { VideoListingService } from 'src/app/services/video-listing.service';
import { User } from 'src/app/Interfaces/user';
import { Subscription } from 'src/app/Interfaces/subscribe';
@Component({
  selector: 'app-sidebar-content',
  templateUrl: './sidebar-content.component.html',
  styleUrls: ['./sidebar-content.component.css'],
})
export class SidebarContentComponent implements OnInit {
  @Input() content!: string;
  mini: boolean = false;
  big: boolean = false;

  currentPage: string = '';
  fromAnalytics: boolean = false;
  resetMenu: boolean = false;
  userId = this.authService.getUserIdFromToken();
  user!: User;
  loggedIn = this.authService.loggedIn();

  menu = [
    {
      icon: 'home',
      name: 'Home',
      path: '',
    },
    {
      icon: 'explore',
      name: 'Explore',
      path: 'feed/explore',
    },
    {
      icon: 'subscriptions',
      name: 'Subscriptions',
      path: 'feed/subscriptions',
    },
  ];

  menu2 = [
    {
      icon: 'home',
      name: 'Home',
      path: '',
    },
    {
      icon: 'explore',
      name: 'Explore',
      path: 'feed/explore',
    },
    {
      icon: 'subscriptions',
      name: 'Subscriptions',
      path: 'feed/subscriptions',
    },
  ];

  playlists: Playlist[] = [];

  subscriptions: Subscription[] = [];

  tempIcon =
    'https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png';
  constructor(
    private userService: UserService,
    private playlistService: PlaylistService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.content == 'mini') this.mini = true;
    if (this.content == 'big') this.big = true;
    this.userService.selectedUser$
      .pipe(
        switchMap((response) => {
          return this.playlistService.getUserPlaylists(response.userId);
        })
      )
      .subscribe((data) => {
        this.playlists = data.data;
      });

    if (this.authService.loggedIn()) {
      this.userService
        .getSubscriptions()
        .subscribe((res) => (this.subscriptions = res.data));
    }
    this.userService.requestUser();

    this.userService.observeStudio$.subscribe((analytics) => {
      this.fromAnalytics = analytics;
    });

    if (this.userId) this.getUserInfo(this.userId);
  }

  goToPlaylist(playlistId: string): void {
    window.location.href = 'http://localhost:4200/playlist?list=' + playlistId;
  }

  getUserInfo(userId: string): void {
    this.userService.getUserById(userId).subscribe((res) => {
      this.user = res.data;
      this.menu2.push({
        icon: 'dashboard',
        name: 'Dashboard',
        path: `/studio/channel/${this.user.channelName}`,
      });
      this.menu2.push({
        icon: 'auto_fix_high',
        name: 'Customize',
        path: `/studio/channel/${this.user.channelName}/customization`,
      });
    });
  }

  getChannelPicture(subscribed: Subscription): string | undefined {
    if (subscribed.subscribeePicture === '') {
      return 'https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png';
    } else {
      return `https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/${subscribed.subscribeePicture}.jpg`;
    }
  }

  changeSource(event: any) {
    event.target.src =
      'https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png';
  }
}
