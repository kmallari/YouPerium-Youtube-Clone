import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { PatchUser, User } from 'src/app/Interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  @Input() user !: User;
  userEmail = new FormControl('', Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"), this.userService.userAsyncValidator());

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
      email : this.userEmail.value,
      userPassword :  null,
      firstName : null,
      lastName : null,
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
    return (this.userEmail.value === '' || this.userEmail.value === null) || this.userEmail.invalid
  }

  invalid_input(input : string) : boolean | undefined {
    let controlErrors: ValidationErrors | null | undefined = null;
    if (input === "email") {
      controlErrors = this.userEmail?.errors
    }
    
    if (controlErrors != null){
      return controlErrors['pattern'] != null;
    } else {
      return undefined;
    }
  }

  user_exists (input : string) : boolean | undefined {
    let controlErrors: ValidationErrors | null | undefined = null;
    if (input === "email") {
      controlErrors = this.userEmail?.errors;;
    }

    if (controlErrors != null){
      return controlErrors['userExists'];
    } else {
      return undefined;
    }
  }

}
