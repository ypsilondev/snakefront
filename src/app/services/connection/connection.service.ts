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
  private color = "white";

  constructor(private socket: Socket) {
    this.registerChannels();
  }

  public getRoomCode(): string {
    return this.roomCode;
  }

  public getColor(): string {
    return this.color;
  }

  public setColor(color: string): void {
    this.color = color;
  }

  public sendMovement(dir: string): void {
    this.socket.emit("movement", {id: this.id, payload: {color: this.color, positions: dir}});
  }

  public sendIncLength(wallE: number): void {
    this.socket.emit("game", {message: "incLength", payload: {id: this.id, value: wallE}});
  }

  public getId(): number {
    return this.id;
  }

  public subscribeMovements(): Observable<{id: number, payload: {color: string, positions: string}}> {
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

  sendCord(x: number, y: number): void {
    this.socket.emit("game", {message: "startCord", payload: {x, y, id: this.id}});
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

  setCoinCollected(): void {
    this.socket.emit("game", {message: "coin collected", payload: {}});
  }

}
