import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private roomCode = "XXSTEST";

  constructor() { }

  public getRoomCode(): string {
    return this.roomCode;
  }
}
