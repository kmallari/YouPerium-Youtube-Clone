import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PatchUser, User } from 'src/app/Interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.css']
})
export class NameComponent implements OnInit {

  @Input() user !: User

  firstName = new FormControl('', Validators.pattern('^[a-zA-Z\s].{0,64}$'));
  lastName = new FormControl('', Validators.pattern('^[a-zA-Z\s].{0,20}$'));
  constructor(
    public activeModal : NgbActiveModal,
    private userService : UserService
  ) { }

  ngOnInit(): void {
  }

  closeModal() : void {
    this.activeModal.close();
  }

  invalid_input(input : string) : boolean | undefined {
    let controlErrors: ValidationErrors | null | undefined = null;
    if (input === "firstname") {
      controlErrors = this.firstName?.errors
    } else if   (input === "lastname") {
      controlErrors = this.lastName?.errors
    }
    
    if (controlErrors != null){
      return controlErrors['pattern'] != null;
    } else {
      return undefined;
    }
  }

  onSaveClicked()  : void {

    let patchUser : PatchUser = {
      userProfilePicture : null,
      username : this.user.username,
      email : null,
      userPassword :  null,
      firstName : this.firstName.value === '' || this.firstName.value === null ? null : this.firstName.value,
      lastName : this.lastName.value === '' || this.lastName.value === null ? null : this.lastName.value,
      age : null,
      channelName : null,
      channelDescription :  null,
      channelBanner : null,
    }
    
    this.userService.patchUser(patchUser).subscribe();
    this.closeModal();
    window.location.reload();
  }

  disabler () : boolean {
    return ((this.firstName.value === '' && this.lastName.value === '') || (this.firstName.value === null && this.lastName.value === null) || (this.firstName.value === '' && this.lastName.value === null) || (this.firstName.value === null && this.lastName.value === '')) || this.lastName.invalid || this.firstName.invalid
  }
}
