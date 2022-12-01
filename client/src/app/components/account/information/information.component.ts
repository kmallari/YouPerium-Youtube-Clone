import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ConfirmIdentity, User } from 'src/app/Interfaces/user';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NameComponent } from '../../information/modals/name/name.component';
import { BirthdayComponent } from '../../information/modals/birthday/birthday.component';
import { EmailComponent } from '../../information/modals/email/email.component';
import { ProfilePictureComponent } from '../../information/modals/profile-picture/profile-picture.component';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {

  identityConfirmed : boolean = false;
  password = new FormControl();
  user ?: User;

  constructor(
    private authService : AuthService,
    private userService : UserService,
    private modalService : NgbModal
  ) { }

  ngOnInit(): void {
    this.identityConfirmed = this.authService.identityLoggedIn();
    if (this.identityConfirmed) {
      this.getuUserById();
    }
  }

  confirmIdentity() {
    let identityConfirmed : ConfirmIdentity = {
      user : this.authService.getUserIdFromToken(),
      userPassword : this.password.value
    }

    this.authService.confirmIdentity(identityConfirmed).subscribe(
      res => {
        localStorage.setItem('identity-token', res.data.token);
        window.location.reload();
      }
    )
  }

  getuUserById() : void {
    this.userService.getUserById(this.authService.getUserIdFromToken()).subscribe(
      res => this.user = res.data
    )
  }

  getChannelPicture() : string | undefined {
    if (this.user?.userProfilePicture === '') {
      return "https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png"
    } else {
      return `https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/${this.user?.userProfilePicture}.jpg`
    }
  }

  changeSource(event : any) {
    event.target.src = "https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png";
  }

  nameChangeClicked() : void {
    let modalRef = this.modalService.open(NameComponent, {centered: true});
    modalRef.componentInstance.user = this.user;
  }

  ageChangeClicked() : void {
    let modalRef = this.modalService.open(BirthdayComponent, {centered: true});
    modalRef.componentInstance.user = this.user;
  }

  emailChangeClicked() : void {
    let modalRef = this.modalService.open(EmailComponent, {centered: true});
    modalRef.componentInstance.user = this.user;
  }

  profilePictureClicked() : void {
    let modalRef = this.modalService.open(ProfilePictureComponent, {centered: true, size: 'sm'});
    modalRef.componentInstance.user = this.user;
  }

}
