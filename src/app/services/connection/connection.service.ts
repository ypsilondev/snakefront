import { Injectable } from '@angular/core';
import {Socket} from "ngx-socket-io";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private roomCode = "";
  private connectObservable;

  constructor(private socket: Socket) {
    this.registerChannels();
  }

  public getRoomCode(): string {
    return this.roomCode;
  }

  public createNewRoom(ready: Observable<void>): void {
    this.connectObservable = ready;
    this.socket.emit("register", "");
  }

  public setRoomCode(code: string, ready: Observable<void>): void {
    this.connectObservable = ready;
    this.roomCode = code;
    this.socket.emit("register", code);
  }

  private registerChannels(): void {
    const self = this;
    this.socket.fromEvent("register").subscribe((resp: {event, roomCode, state, code}) => {
      self.roomCode = resp.roomCode;
      self.connectObservable.submit();
    });
    this.socket.fromEvent("broadcast").subscribe(resp => {
      console.log(resp);
    });
  }

}
