import { UserService } from 'src/app/services/user.service';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RegisterUser } from 'src/app/Interfaces/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  myGroup = new FormGroup({
    firstName : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z\s].{0,64}$')]),
    lastName : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z\s].{0,20}$')]),
    userName : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{3,60}$')], this.userService.userAsyncValidator()),
    userEmail : new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")], this.userService.userAsyncValidator()),
    password : new FormControl('', [Validators.required, Validators.pattern("^(?=.*[A-Z].)(?=.*[0-9].)(?=.*[a-z].).{8,}$")]),
    confirmPassword : new FormControl('', Validators.required),
    BirthDate : new FormControl()
});
  constructor(
    private router : Router,
    private authService : AuthService,
    private userService : UserService
  ) { }

  ngOnInit(): void {
  }

  signInInstead() {
    this.router.navigate(['/login']);
  }

  get firstName() {
    return this.myGroup.get('firstName');
  }

  get lastName() {
    return this.myGroup.get('lastName');
  }

  get userName() {
    return this.myGroup.get('userName');
  }

  get userEmail() {
    return this.myGroup.get('userEmail');
  }

  get password() {
    return this.myGroup.get('password');
  }

  get confirmPassword() {
    return this.myGroup.get('confirmPassword');
  }

  get BirthDate() {
    return this.myGroup.get('BirthDate');
  }

  signup() {
    console.log(this.password?.value)
    let newUser : RegisterUser = {
      username : this.myGroup.controls.userName.value,
      email : this.myGroup.controls.userEmail.value,
      userPassword : this.myGroup.controls.password.value,
      firstName : this.myGroup.controls.firstName.value,
      lastName : this.myGroup.controls.lastName.value,
      age : this.ageCalculator()
    }

    this.authService.registerUser(newUser).subscribe(
      res => {
        localStorage.setItem('token', res.data.token);
        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      }
    );
    
  }

  ageCalculator() : number {
    if (this.BirthDate?.value === null || this.BirthDate?.value === '') {
      return 0
    } else {
      let today = new Date();
      let birthdate = new Date(this.BirthDate?.value)
      var age = today.getFullYear() - birthdate.getFullYear();
      var m = today.getMonth() - birthdate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
          age--;
      }

      return age
    }
  }

  disabler(): boolean {
    return this.BirthDate?.value === null || this.BirthDate?.value === '' || this.ageCalculator() <= 0;
  }

  invalid_input(input : string) : boolean | undefined {
    let controlErrors: ValidationErrors | null | undefined = null;
    if (input === "firstname") {
      controlErrors = this.firstName?.errors
    } else if   (input === "lastname") {
      controlErrors = this.lastName?.errors
    } else if   (input === "username") {
      controlErrors = this.userName?.errors
    } else if   (input === "email") {
      controlErrors = this.userEmail?.errors
    } else if (input === "password") {
      controlErrors = this.password?.errors
    }
    
    if (controlErrors != null){
      return controlErrors['pattern'] != null;
    } else {
      return undefined;
    }
  }

  errorCheck (input : string) : boolean | undefined {
    let controlErrors: ValidationErrors | null | undefined = null;
    if (input === "username") {
      controlErrors = this.userName?.errors
    } else if (input === "email") {
      controlErrors = this.userEmail?.errors;;
    }
    if (controlErrors != null){
      return controlErrors['userExists'] || controlErrors['pattern'] != null;
    } else {
      return undefined;
    }
  }

  user_exists (input : string) : boolean | undefined {
    let controlErrors: ValidationErrors | null | undefined = null;
    if (input === "username") {
      controlErrors = this.userName?.errors
    } else if (input === "email") {
      controlErrors = this.userEmail?.errors;;
    }

    if (controlErrors != null){
      return controlErrors['userExists'];
    } else {
      return undefined;
    }
  }

}
