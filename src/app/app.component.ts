import { Component } from '@angular/core';
import {ConnectionService} from './services/connection/connection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(public con: ConnectionService) {

  }

  quit(): void {
    document.location.reload();
  }
}
