import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChangePassword } from 'src/app/Interfaces/user';
import { UserService } from 'src/app/services/user.service';
declare let alertify : any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(
    private userService : UserService
  ) { }

  oldPassword = new FormControl();
  newPassword = new FormControl();
  confirmPassword = new FormControl();

  ngOnInit(): void {
  }

  saveNewPassword() : void {
    let changePassword : ChangePassword = {
      oldPassword : this.oldPassword.value,
      newPassword : this.newPassword.value
    }
    this.userService.changePassword(changePassword).subscribe(
      res => {
        alertify.success(res.message)
      }
    );
    this.oldPassword.reset();
    this.newPassword.reset();
    this.confirmPassword.reset();
    localStorage.removeItem('identity-token')
  }
}
