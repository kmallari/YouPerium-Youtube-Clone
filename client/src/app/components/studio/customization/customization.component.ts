import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PatchUser, User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { from, mergeMap, bindCallback, Observable } from 'rxjs';
import { nanoid } from 'nanoid'

@Component({
  selector: 'app-customization',
  templateUrl: './customization.component.html',
  styleUrls: ['./customization.component.css']
})
export class CustomizationComponent implements OnInit {

  user !: User;
  branding : boolean = true;
  basicInfo : boolean = false;
  profImageSource : string | undefined = '';
  bannerImageSource : string | undefined = '';

  bannerImageFile ?: File ;
  channelImageFile ?: File ;

  channelName : string | undefined = '';
  channelDescription : string | undefined = '';

  channelNameControl = new FormControl('', Validators.required);

  bannerRemoved : boolean = false;
  profileRemoved : boolean = false;

  constructor(
    private userService : UserService,
    private authService : AuthService,
    private router : Router
  ) { }

  ngOnInit(): void {
    if (this.authService.loggedIn()) {
      this.userService.getUserById(this.authService.getUserIdFromToken()).subscribe(
        user => {
          this.user = user.data;
          this.profImageSource = this.getChannelPicture();
          this.bannerImageSource = this.getChannelBanner();
          this.channelName = this.user.channelName;
          this.channelDescription = this.user.channelDescription;
        }
      )
    }
  }

  brandingClicked() : void {
    this.branding = true;
    this.basicInfo = false;
  }

  basicInfoClicked() : void {
    this.basicInfo = true;
    this.branding = false;
  }

  changeSource(event : any) {
    event.target.src = "https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png";
  }

  getChannelPicture() : string | undefined {
    if (this.user?.userProfilePicture === '' || this.user?.userProfilePicture === 'profilePlaceholder') {
      return "https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png"
    } else {
      return `https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/${this.user?.userProfilePicture}.jpg`
    }
  }

  getChannelBanner() : string | undefined {
    if (this.user?.channelBanner === '' || this.user?.channelBanner === 'profilePlaceholder') {
      return "https://www.solidbackgrounds.com/images/1920x1080/1920x1080-red-solid-color-background.jpg"
    } else {
      return `https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/${this.user?.channelBanner}.jpg`
    }
  }

  viewChannelClicked() : void {
    this.router.navigate(['/c', this.user?.channelName]);
  }

  channelImageSelected(event : any) {
    let reader = new FileReader();
    this.channelImageFile = event.target.files[0];
    if (this.channelImageFile !== undefined) {
      reader.readAsDataURL(this.channelImageFile);
      reader.onload=(event : any) => {
        this.profImageSource = event.target.result;
        this.profileRemoved = false;
      }
    }
  }

  async dropped(files: NgxFileDropEntry[]) {
    let reader = new FileReader();
    from(files).pipe(
      mergeMap(selectedFile => {
        const fileEntry = selectedFile.fileEntry as FileSystemFileEntry;
        const observableFactory = bindCallback(fileEntry.file) as any;
        const file$ = observableFactory.call(fileEntry) as Observable<File>;
        return file$
      })
    ).subscribe(file => {
      this.bannerImageFile = file;
      reader.readAsDataURL(file);
      reader.onload=(event : any) => {
        this.bannerImageSource = event.target.result;
        this.bannerRemoved = false;
      }
     })
  }

  changeBannerSource(event: any) {
    event.target.src =
      'https://www.solidbackgrounds.com/images/1920x1080/1920x1080-red-solid-color-background.jpg';
  }

  changeProfileSource(event: any) {
    event.target.src =
      'https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png';
  }

  removeBannerImage() : void {
    this.bannerImageSource = "https://www.solidbackgrounds.com/images/1920x1080/1920x1080-red-solid-color-background.jpg";
    this.bannerImageFile = undefined;
    this.bannerRemoved = true;
  }

  removeChannelImage() : void {
    this.profImageSource = "https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/user-photos/profilePlaceholder.png";
    this.channelImageFile = undefined;
    this.profileRemoved = true;
  }

  activateWhenInput() : boolean {
    if (this.channelName !== this.user?.channelName || this.channelDescription !== this.user?.channelDescription || this.bannerImageFile !== undefined || this.channelImageFile !== undefined  || this.bannerRemoved || this.profileRemoved) {
      return true;
    } else {
      return false;
    }
  }

  cancelClicked() {
    this.channelImageFile = undefined;
    this.bannerImageFile = undefined;
    this.profImageSource = this.getChannelPicture();
    this.bannerImageSource = this.getChannelBanner();
    this.channelName = this.user?.channelName;
    this.channelDescription = this.user?.channelDescription;
    this.bannerRemoved = false;
    this.profileRemoved = false;
  }

  publishClicked() : void {
    if (this.channelName !== this.user?.channelName && this.channelName !== undefined) {
      this.user.channelName = this.channelName;
    }
    
    if (this.channelImageFile === undefined) {
      if (this.bannerImageFile === undefined) {
        let patchUser : PatchUser = {
          userProfilePicture : this.profileRemoved? 'profilePlaceholder22_' : null,
          username : this.user.username,
          email : null,
          userPassword :  null,
          firstName : null,
          lastName : null,
          age : null,
          channelName : this.channelName !== undefined? this.channelName : null,
          channelDescription :  this.channelDescription !== undefined? this.channelDescription : null,
          channelBanner : this.bannerRemoved? 'profilePlaceholder22_' : null,
        }
        this.userService.patchUser(patchUser).subscribe(
          res => {
            window.location.reload();
          }
        );
      } else {
        let fd = new FormData();
        fd.append('channelBanner', this.bannerImageFile, this.bannerImageFile.name);
        this.userService.updateChannelBanner(fd, this.user.userId).subscribe(
          res => {
            let patchUser : PatchUser = {
              userProfilePicture : this.profileRemoved? 'profilePlaceholder22_' : null,
              username : this.user.username,
              email : null,
              userPassword :  null,
              firstName : null,
              lastName : null,
              age : null,
              channelName : this.channelName !== undefined? this.channelName : null,
              channelDescription :  this.channelDescription !== undefined? this.channelDescription : null,
              channelBanner : null,
            }
            this.userService.patchUser(patchUser).subscribe(
              res => {
                window.location.reload();
              }
            );
          }
        )
      }
    } else {
      let dpFD = new FormData();
      dpFD.append('profilePicture', this.channelImageFile, this.channelImageFile.name);
      this.userService.updateProfilePicture(dpFD, this.user.userId).subscribe(
        res => {
          if (this.bannerImageFile === undefined) {
            let patchUser : PatchUser = {
              userProfilePicture : null,
              username : this.user.username,
              email : null,
              userPassword :  null,
              firstName : null,
              lastName : null,
              age : null,
              channelName : this.channelName !== undefined? this.channelName : null,
              channelDescription :  this.channelDescription !== undefined? this.channelDescription : null,
              channelBanner : this.bannerRemoved? 'profilePlaceholder22_' : null,
            }
            this.userService.patchUser(patchUser).subscribe(
              res => {
                window.location.reload();
              }
            );
          } else {
            let fd = new FormData();
            fd.append('channelBanner', this.bannerImageFile, this.bannerImageFile.name);
            this.userService.updateChannelBanner(fd, this.user.userId).subscribe(
              res => {
                let patchUser : PatchUser = {
                  userProfilePicture : null,
                  username : this.user.username,
                  email : null,
                  userPassword :  null,
                  firstName : null,
                  lastName : null,
                  age : null,
                  channelName : this.channelName !== undefined? this.channelName : null,
                  channelDescription :  this.channelDescription !== undefined? this.channelDescription : null,
                  channelBanner : null,
                }
                this.userService.patchUser(patchUser).subscribe(
                  res => {
                    window.location.reload();
                  }
                );
              }
            )
          }
        }
      )
    }
  }
}
