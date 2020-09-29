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
  private startPositions = [];

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

    // Players
    for (let i = 0; i<2; i++) {
      const initialLength = 10;
      const ranX = Math.random() * (this.width - initialLength);
      const ranY = Math.random() * (this.height - initialLength);
      ctx.moveTo(ranX, ranY);
      ctx.lineTo(ranX+initialLength, ranY);
      this.startPositions.push({x: ranX, y: ranY, length: initialLength});
      ctx.stroke();
    }

    setInterval(() => {
      ctx.clearRect(0, 0, this.width, this.height);
      ctx.clearRect(0, 0, this.width, this.height);
      const newPositions = [];
      for (let i = 0; i<2; i++) {
        const startX = this.startPositions[i].x;
        const startY = this.startPositions[i].y;
        const length = this.startPositions[i].length;

        // Nach rechts:
        if (startX + length < this.width) {
          ctx.beginPath();
          ctx.moveTo(startX + 1, startY);
          ctx.lineTo(startX + 1 + this.startPositions[i].length, startY);
          newPositions.push({x: (startX + 1), y: startY, length});
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX + this.startPositions[i].length, startY);
          newPositions.push({x: startX, y: startY, length});
          ctx.stroke();
        }
      }
      this.startPositions = newPositions;
    }, 17);
  }

  move(event: KeyboardEvent): void {
    console.log("unnddd");
    if (event.key === "ARROW UP") {
      console.log("Aa");
    }
  }

}
