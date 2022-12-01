import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Client';

  showHeader: boolean = true;
  showSidebar: boolean = false;
  showBigbar: string = "show";

  sidebarOn: boolean = true;
  smallScreen: boolean = false;
  watchScreen: boolean = false;
  
  backdrop: Subject<boolean> = new Subject<boolean>();
  show: Subject<string> = new Subject<string>();

  constructor(
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)

      if( event.url == '/signup' ) this.showHeader = false;
      else if ( event.url == '/login' ) this.showHeader = false;
      else this.showHeader = true;

      if( event.url.includes('studio') ) this.userService.fromAnalytics(true);
      else this.userService.fromAnalytics(false);
      
      if( event.url.includes('watch') ) this.showBigbar = "close";
      else this.showBigbar = "show";

      if( event.url.includes('watch') ) this.watchScreen = true;
      else this.watchScreen = false;

      if (window.innerWidth < 960) this.smallScreen = true;
      this.onReady()
    });
  }

  onToggle() {
    this.sidebarOn = !this.sidebarOn;
  }

  onReady() {
    this.backdrop.next(this.smallScreen || this.watchScreen);
    this.show.next(this.showBigbar)
  }

  @HostListener("window:resize", []) updateCollpased() {
    if (window.innerWidth < 960) {
      if(!this.smallScreen) {
        this.smallScreen = true;
        this.backdrop.next(this.smallScreen || this.watchScreen);
        this.show.next("close")
      }
    } else {
      if(this.smallScreen) {
        this.smallScreen = false;
        this.backdrop.next(this.smallScreen || this.watchScreen);
        this.show.next("show")
      }
    }
  }
}
