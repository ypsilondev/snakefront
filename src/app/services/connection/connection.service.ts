import { Injectable } from '@angular/core';
import {Socket} from "ngx-socket-io";
import {Observable, Subscriber} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private id = 0;
  private roomCode = "";
  private connectObservable: Subscriber<{event, roomCode, state, code, id, roomSettings: {velocity, players}}>;
  private movement: Observable<JSON>;
  private players;
  private velocity;

  constructor(private socket: Socket) {
    this.registerChannels();
  }

  public getRoomCode(): string {
    return this.roomCode;
  }

  public sendMovement(data: {x, y}): void {
    // @ts-ignore
    data.id = this.id;
    console.log(data);
    this.socket.emit("movement", data);
  }

  public subscribeMovements(): Observable<JSON> {
    return this.socket.fromEvent("movement");
  }

  public subscribeGame(): Observable<{ message, payload }> {
    return this.socket.fromEvent("game");
  }

  public createNewRoom(velocity: number, players: number): Observable<{event
    , roomCode, state, code, id, roomSettings: {velocity, players}}> {
    this.socket.emit("register", {velocity, players});
    const self = this;
    return new Observable<{event, roomCode, state, code, id, roomSettings: {velocity, players}}>(subscriber => {
      self.connectObservable = subscriber;
    });
  }

  public setRoomCode(code: string): Observable<{event, roomCode, state, code, id, roomSettings: {velocity, players}}> {
    this.roomCode = code;
    this.socket.emit("join", code);
    const self = this;
    return new Observable<{event, roomCode, state, code, id, roomSettings: {velocity, players}}>(subscriber => {
      self.connectObservable = subscriber;
    });
  }

  getVelocity(): number {
    return this.velocity;
  }

  getMaxPlayers(): number {
    return this.players;
  }

  private registerChannels(): void {
    const self = this;
    this.socket.fromEvent("register").subscribe((resp: {event, roomCode, state, code, id, roomSettings: {velocity, players}}) => {
      if(resp.code >= 10 && resp.code < 20) {
        self.roomCode = resp.roomCode;
        self.id = resp.id;
        self.players = resp.roomSettings.players;
        self.velocity = resp.roomSettings.velocity;
        self.connectObservable.next(resp);
        self.connectObservable.complete();
      }
    });
    this.socket.fromEvent("broadcast").subscribe(resp => {
      console.log(resp);
    });
    this.movement = this.socket.fromEvent("movement");
  }

}
