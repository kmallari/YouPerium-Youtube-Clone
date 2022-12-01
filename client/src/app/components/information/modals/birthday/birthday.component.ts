import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { PatchUser, User } from 'src/app/Interfaces/user';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-birthday',
  templateUrl: './birthday.component.html',
  styleUrls: ['./birthday.component.css']
})
export class BirthdayComponent implements OnInit {

  @Input() user !: User;

  birthDate = new FormControl();

  constructor(
    private activeModal : NgbActiveModal,
    private userService : UserService
  ) { }

  ngOnInit(): void {
  }

  closeModal() : void {
    this.activeModal.close();
  }

  onSaveClicked()  : void {
    let patchUser : PatchUser = {
      userProfilePicture : null,
      username : this.user.username,
      email : null,
      userPassword :  null,
      firstName : null,
      lastName : null,
      age : this.ageCalculator(),
      channelName : null,
      channelDescription :  null,
      channelBanner : null,
    }
    
    this.userService.patchUser(patchUser).subscribe();
    this.closeModal();
    window.location.reload();
  }

  disabler(): boolean {
    return this.birthDate.value === null || this.birthDate.value === '' || this.ageCalculator() <= 0;
  }

  ageCalculator() : number {
    if (this.birthDate.value === null || this.birthDate.value === '') {
      return 0
    } else {
      let today = new Date();
      let birthdate = new Date(this.birthDate.value)
      var age = today.getFullYear() - birthdate.getFullYear();
      var m = today.getMonth() - birthdate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
          age--;
      }

      return age
    }
  }
}
