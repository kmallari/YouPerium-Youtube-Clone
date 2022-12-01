import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LoginUser } from 'src/app/Interfaces/user';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  constructor(
    private authService : AuthService,
    private router : Router,
  ) { }

  userNameEmail = new FormControl();
  password = new FormControl();

  ngOnInit(): void {
  }

  signIn() : void { 
    let loginUser : LoginUser = {
      username : null,
      email : null,
      userPassword : this.password.value,
    }
    let pattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
    if (this.userNameEmail.value?.match(pattern) == null) {
      loginUser.username = this.userNameEmail.value;
    } else {
      loginUser.email = this.userNameEmail.value;
    }
    this.authService.loginUser(loginUser).subscribe(
      res => {
        localStorage.setItem('token', res.data.token);
        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      }
    )
  }

  createAccountClicked() {
    this.router.navigate(['/signup'])
  }

}
