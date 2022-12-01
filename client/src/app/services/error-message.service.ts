import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

  private _message: string | null = null;

  getMessage(): string | null {
    const returnedMessage = this._message;
    this.clear();

    return returnedMessage;
  }

  setMessage(val: string) {
    this._message = val;
  }

  clear() {
    this._message = null;
  }
}
