import { AuthService } from 'src/app/services/auth.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { User } from 'src/app/Interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  
  constructor(
    private authService : AuthService,
    private userService : UserService,
    private router : Router,
    private route : ActivatedRoute,
  ) {
    this.router.events.subscribe((event: any) => {
      if ( event instanceof NavigationEnd ) {
        if (event.url === "/account/info") {
          this.accBGColor = "#1f1f1f"
          this.accFontColor = "#1a73e8"
          this.accIcon = "https://www.gstatic.com/identity/boq/accountsettingsmobile/menu_personalinfo_selected_24x24_42cee6fcd98a8be1d1afbbd2d97664e4.png"

          // change password style
          this.cpBGColor = "#282828"
          this.cpFontColor = "#aaaaaa"
          this.cpIcon = "https://www.gstatic.com/identity/boq/accountsettingsmobile/menu_security_48x48_d87e85775419281484a2e5ac87494450.png"
        } else {
          this.accBGColor = "#282828"
          this.accFontColor = "#aaaaaa"
          this.accIcon = "https://www.gstatic.com/identity/boq/accountsettingsmobile/menu_personalinfo_48x48_abc40f5cd0cb6cdf43ccee39a956f199.png"

          // change password style
          this.cpBGColor = "#1f1f1f"
          this.cpFontColor = "#1a73e8"
          this.cpIcon = "https://www.gstatic.com/identity/boq/accountsettingsmobile/menu_security_selected_48x48_026b0f5acd172025af3349e6584a23b3.png"
        }
      }
  });
  }

  user !: User;

  //account info style
  accBGColor : string = "#1f1f1f"
  accFontColor : string = "#1a73e8"
  accIcon : string = "https://www.gstatic.com/identity/boq/accountsettingsmobile/menu_personalinfo_selected_24x24_42cee6fcd98a8be1d1afbbd2d97664e4.png"

  // change password style
  cpBGColor : string = "#282828"
  cpFontColor : string = "#aaaaaa"
  cpIcon : string = "https://www.gstatic.com/identity/boq/accountsettingsmobile/menu_security_48x48_d87e85775419281484a2e5ac87494450.png"

  ngOnInit(): void {
    this.userService.getUserById(this.authService.getUserIdFromToken()).subscribe(
      res => this.user = res.data
    )

    console.log(window.location)
  }

  getChannelPicture() : string | undefined {
    if (this.user?.userProfilePicture === '') {
      return "https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png"
    } else {
      return `https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/${this.user.userProfilePicture}.jpg`
    }
  }

  accInfoClicked() : void {
    this.router.navigate(['account/info'], {relativeTo: this.route.root})
    this.accBGColor = "#1f1f1f"
    this.accFontColor = "#1a73e8"
    this.accIcon = "https://www.gstatic.com/identity/boq/accountsettingsmobile/menu_personalinfo_selected_24x24_42cee6fcd98a8be1d1afbbd2d97664e4.png"

    // change password style
    this.cpBGColor = "#282828"
    this.cpFontColor = "#aaaaaa"
    this.cpIcon = "https://www.gstatic.com/identity/boq/accountsettingsmobile/menu_security_48x48_d87e85775419281484a2e5ac87494450.png"
  }

  cpClicked() : void {
    this.router.navigate(['change_password'], {relativeTo: this.route})
    this.accBGColor = "#282828"
    this.accFontColor = "#aaaaaa"
    this.accIcon = "https://www.gstatic.com/identity/boq/accountsettingsmobile/menu_personalinfo_48x48_abc40f5cd0cb6cdf43ccee39a956f199.png"

    // change password style
    this.cpBGColor = "#1f1f1f"
    this.cpFontColor = "#1a73e8"
    this.cpIcon = "https://www.gstatic.com/identity/boq/accountsettingsmobile/menu_security_selected_48x48_026b0f5acd172025af3349e6584a23b3.png"
  }

  changeSource(event : any) {
    event.target.src = "https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png";
  }

}
