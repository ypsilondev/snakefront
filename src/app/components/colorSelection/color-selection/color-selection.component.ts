import { Component, OnInit } from '@angular/core';
import {ConnectionService} from '../../../services/connection/connection.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-color-selection',
  templateUrl: './color-selection.component.html',
  styleUrls: ['./color-selection.component.scss']
})
export class ColorSelectionComponent implements OnInit {
  colors = [
    "yellow",
    "green",
    "orange",
    "red",
    "blue",
    "aqua",
    "lightblue",
    "white",
    "lightgreen",
    "darkmagenta"
  ];
  selectedColor = "";
  error = "";

  constructor(private cs: ConnectionService, private router: Router) { }

  ngOnInit(): void {
    if (this.cs.getRoomCode() === "") {
      this.router.navigate([""]);
      return;
    }
  }

  submitColor(): void {
    this.cs.sendSubmitColor(this.selectedColor);
    this.cs.subscribeRoom().subscribe(room => {
      console.log(room);
      if (room.payload.success) {
        this.cs.setColor(this.selectedColor);
        this.router.navigate(["game"]);
      } else {
        this.error = "Color already in use";
      }
    });
  }

}
