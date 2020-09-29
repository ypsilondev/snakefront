import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  private width = 1400;
  private height = 800;
  private coins = [];

  constructor() { }

  ngOnInit(): void {
    const snake = document.getElementById('snake') as HTMLCanvasElement;
    const ctx = snake.getContext('2d');
    ctx.strokeStyle = 'white';

    // First coins
    for (let i = 0; i<2; i++) {
      const coinRadius = 5;
      const ranX = Math.random() * (this.width - coinRadius);   // width - radius
      const ranY = Math.random() * (this.height - coinRadius);  // height - radius
      ctx.beginPath();
      ctx.arc(ranX, ranY, coinRadius, 0, Math.PI * 2);
      this.coins.push({x: ranX, y: ranY});
      ctx.stroke();
    }
  }

}
