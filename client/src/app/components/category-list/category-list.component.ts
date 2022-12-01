import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  @ViewChild('listing') listing!: ElementRef;
  
  @Output() clicked = new EventEmitter<string>;
  current = "All Videos";

  collapsed = false;
  showLeft = false;
  showRight = true;

  categories = [{
    path: '/',
    name: 'All Videos'
  },
  {
    path: '/',
    name: 'Music'
  },
  {
    path: '/',
    name: 'Sports'
  },
  {
    path: '/',
    name: 'Cooking'
  },
  {
    path: '/',
    name: 'Gaming'
  },
  {
    path: '/',
    name: 'Documentary'
  },]

  items = this.categories;

  @HostListener("window:resize", []) updateCollpased() {
    if (window.innerWidth < 664) {
      this.collapsed = true;
      this.showLeft = false;
      this.showRight = true;
    } else {
      this.collapsed = false;
    }
  }

  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
    if (window.innerWidth < 664) {
      this.collapsed = true;
    }
  }

  categoryClicked(name: string): void {
    this.clicked.emit(name);
    setTimeout(() => this.current = name, 200);
    window.scrollTo(0, 0)
  }

  scrollLeft() {
    this.listing.nativeElement.scrollLeft -= 200;
    this.showRight = true;
    if(this.listing.nativeElement.scrollLeft - 200 <= 0)
      this.showLeft = false;
  }

  scrollRight() {
    this.listing.nativeElement.scrollLeft += 200;
    this.showLeft = true;
    if(this.listing.nativeElement.scrollLeft + 200 >= 655 - window.innerWidth )
      this.showRight = false;
  }
  
  scrollUp() {
    window.scrollTo(0, 0)
  }
}
