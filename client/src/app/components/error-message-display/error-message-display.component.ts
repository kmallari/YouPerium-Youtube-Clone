import { ErrorMessageService } from './../../services/error-message.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-message-display',
  templateUrl: './error-message-display.component.html',
  styleUrls: ['./error-message-display.component.css']
})
export class ErrorMessageDisplayComponent implements OnInit {

  currentMessage: string | null = null;

  constructor(
    private errorMessageService : ErrorMessageService
  ) { }

  ngOnInit(): void {
    this.currentMessage = this.errorMessageService.getMessage();
  }

}
