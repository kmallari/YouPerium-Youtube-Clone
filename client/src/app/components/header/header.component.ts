import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from 'src/app/Interfaces/user';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  tempIcon =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/American_Eskimo_Dog.jpg/360px-American_Eskimo_Dog.jpg';
  tempLogo =
    'https://upload.wikimedia.org/wikipedia/commons/5/54/YouTube_dark_logo_2017.svg';

  userIconClicked: boolean = false;
  user?: User;

  loggedIn: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.loggedIn()) {
      this.loggedIn = true;
      this.getUserById();
      this.userService.observeRequest$.subscribe(() =>{
        this.getUserById();
      })
    }
  }

  getUserById(): void {
    this.userService
      .getUserById(this.authService.getUserIdFromToken())
      .subscribe((user) => {
        this.user = user.data;
        this.userService.userItem(this.user);
        this.userService.setUser(this.user);
      });
  }

  getChannelPicture(): string | undefined {
    if (this.user?.userProfilePicture === '') {
      return 'https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png';
    } else {
      return `https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/${this.user?.userProfilePicture}.jpg`;
    }
  }

  // Click events
  onUserIconClicked(): void {
    this.userIconClicked = !this.userIconClicked;
  }

  yourChannelClicked(): void {
    this.router.navigate(['/c', this.user?.channelName]);
    this.userIconClicked = false;
  }

  yourStudioClicked(): void {
    this.router.navigate(['/studio/channel', this.user?.channelName]);
    this.userIconClicked = false;
  }

  signoutClicked(): void {
    this.authService.logOut();
    this.loggedIn = false;
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
    this.userIconClicked = false;
  }

  manageAccountClicked(): void {
    this.router.navigate(['/account/info']);
    this.userIconClicked = false;
  }

  onSignInClicked(): void {
    this.router.navigate(['/login']);
  }

  clickedOutside(): void {
    this.userIconClicked = false;
  }

  changeSource(event: any) {
    event.target.src =
      'https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png';
  }

  onSearch(f: NgForm) {
    let searchQuery = (f.value.searchQuery as string).trim();
    if (searchQuery === '') {
      console.log('Search query empty!');
      return;
    }
    
    // We quickly navigate to home then to the search result
    // to refresh the search result component when its searchQuery
    // parameter changes.
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => {
        this.router
          .navigateByUrl('/search?type=videos&searchQuery=' + searchQuery)
          .catch(console.log);
    })
    .catch(console.log);
  }

  sideToggle() {
    this.userService.onSideToggle()
  }
}
