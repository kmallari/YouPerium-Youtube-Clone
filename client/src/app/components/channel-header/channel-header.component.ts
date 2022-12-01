import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/Interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { VideoListing } from 'src/app/Interfaces/video';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channel-header',
  templateUrl: './channel-header.component.html',
  styleUrls: ['./channel-header.component.css']
})
export class ChannelHeaderComponent implements OnInit {

  @Input() user !: User | VideoListing;
  @Input() type : string = 'channel-header'

  subscribed : boolean = false;
  alreadySubscribed :  boolean = false;

  style !: {profileSize : string, nameSize :string, countSize :string, componentHeight : string};

  channel = {
    componentHeight : '80px',
    profileSize : '80px',
    nameSize : '1.9em',
    countSize : '1rem'
  }

  video = {
    componentHeight : '48px',
    profileSize : '48px',
    nameSize : '1.2rem',
    countSize : '0.9rem'
  }

  constructor(
    private authService : AuthService,
    private userService : UserService,
    private router : Router
  ) { }

  ngOnInit(): void {
    if (this.authService.loggedIn()) {
      this.subscriptionCheck();
    }

    if (this.type === 'channel-header') {
      this.style = this.channel
    } else if (this.type === 'video-page') {
      this.style = this.video
    }
  }

  getChannelPicture() : string | undefined {
    if (this.user?.userProfilePicture === '') {
      return "https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png"
    } else {
      return `https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/${this.user?.userProfilePicture}.jpg`
    }
  }

  canSubscribe() : boolean {
    if (this.authService.getUserIdFromToken() === this.user.userId) {
      return false
    } else {
      return true
    }
  }

  subscriptionCheck() {
    this.userService.subscriptionCheck(this.user.userId).subscribe(
      res => {
        this.alreadySubscribed = res.data.subscription;
      }
    )
  }

  subscribeToChannel() : void {
    if (this.alreadySubscribed) {
      this.userService.unsubscribe(this.user.channelName).subscribe()
      this.alreadySubscribed = false;
      this.user.subscribersCount -= 1;
    } else {
      this.userService.subscribe(this.user.channelName).subscribe()
      this.alreadySubscribed = true;
      this.user.subscribersCount += 1;
    }
  }

  changeSource(event : any) {
    event.target.src = "https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png";
  }

  displaySubscribers (subscribersCount: number) : string {
    if (subscribersCount == 0) return `No subscribers`;
    else if (subscribersCount == 1) return `1 subscriber`;
    else if (subscribersCount < 1000) return `${subscribersCount} subscribers`;
    else if (subscribersCount < 10000) return `${(subscribersCount/1000.0).toFixed(1)}K subscribers`;
    else if (subscribersCount < 1000000) return `${Math.trunc(subscribersCount/1000)}K subscribers`;
    else if (subscribersCount < 10000000) return `${(subscribersCount/1000000).toFixed(1)}M subscribers`;
    else if (subscribersCount < 1000000000) return `${Math.trunc(subscribersCount/1000000)}M subscribers`;
    else if (subscribersCount < 10000000000) return `${(subscribersCount/1000000000).toFixed(1)}B subscribers`;
    else return `${Math.trunc(subscribersCount/1000000000)}B subscribers`;
  }
  
  userClicked() : void {
    this.router.navigate(['/c', this.user?.channelName]);
  }

}
