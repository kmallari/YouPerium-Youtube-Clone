import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/Interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-channel-about',
  templateUrl: './channel-about.component.html',
  styleUrls: ['./channel-about.component.css']
})
export class ChannelAboutComponent implements OnInit {

  user ?: User;

  constructor(
    private route : ActivatedRoute,
    private userService : UserService
  ) { }

  ngOnInit(): void {
    this.getUserFromRoute();
  }

  getUserFromRoute() {
    let username = String(this.route.parent?.snapshot.paramMap.get('username'))
    this.userService.getUserByUsername(username).subscribe(
      user => {
        this.user = user.data;
      }
    )

  }

}
