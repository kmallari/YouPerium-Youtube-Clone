import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-side-menubar',
  templateUrl: './side-menubar.component.html',
  styleUrls: ['./side-menubar.component.css']
})
export class SideMenubarComponent implements OnInit {

  smallBar: string = "close";
  bigBar: string = "show";
  offBar: string = "close";
  backdrop: boolean = false;

  @Input() onShow!: Observable<string>;
  @Input() onBackdrop!: Observable<boolean>;

  @Output() toggle = new EventEmitter<null>();
  @Output() ready = new EventEmitter<null>();

  @Input() fromStudio!: Observable<boolean>;
  
  tempLogo = "https://upload.wikimedia.org/wikipedia/commons/5/54/YouTube_dark_logo_2017.svg";

  constructor(
    private cdref: ChangeDetectorRef,
    private router : Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.onBackdrop.subscribe((backdrop) => {
      this.backdrop = backdrop;
    })
    this.onShow.subscribe((show) => {
      this.smallBar = show;
      if(this.bigBar == "unshown") 
        setTimeout(() => this.bigBar = "show", 200);
    })
    this.userService.sideToggle$.subscribe(() => {
      if(this.bigBar == "show") this.bigBar = "unshown";
    })
    this.onReady();
  }

  onReady() {
    this.ready.emit();
  }

  onToggle(): void {
    if(this.bigBar == "show") this.bigBar = "close";
    else this.bigBar = "show";
    this.toggle.emit()
  }

  destroySidebar(): void {
    this.backdrop = false;
    this.router.navigate([""])
  }
}
