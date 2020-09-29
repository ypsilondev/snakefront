import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../services/settings/settings.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  roomCode = "";
  error = false;

  constructor(public ss: SettingsService) { }

  ngOnInit(): void {
  }

  submitCode(): void {

  }

  createRoom(): void {

  }

}
