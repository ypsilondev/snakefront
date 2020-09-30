import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../services/settings/settings.service';
import {ConnectionService} from '../../../services/connection/connection.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  roomCode = "";
  error = false;
  players = 2;
  snakeSpeed = 2;
  color = "#ffffff";

  constructor(public ss: SettingsService, public cs: ConnectionService, private router: Router) { }

  ngOnInit(): void {
    this.cs.registerChannels();
  }

  submitCode(): void {
    this.cs.setRoomCode(this.roomCode).subscribe(resp => {
      if (resp.code !== 19 && resp.code !== 18) {
        this.cs.setColor(this.color);
        this.router.navigate(["game"]);
      } else {
        this.error = true;
      }
    });
  }

  createRoom(): void {
    this.cs.createNewRoom(this.snakeSpeed, this.players).subscribe(() => {
      this.cs.setColor(this.color);
      this.router.navigate(["game"]);
    });
  }

}
