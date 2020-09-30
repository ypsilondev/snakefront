import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  private width = 1400;
  private height = 800;
  private direction = "";
  private x = Math.random() * this.width;
  private y = Math.random() * this.height;
  private stringLength = 10;
  private velocity = 3;

  constructor() { }

  ngOnInit(): void {
    const snake = document.getElementById('snake') as HTMLCanvasElement;
    const ctx = snake.getContext('2d');
    ctx.strokeStyle = 'white';

    document.addEventListener("keydown", e => {
      switch (e.key) {
        case "ArrowUp": this.direction = "up"; break;
        case "ArrowLeft": this.direction = "left"; break;
        case "ArrowDown": this.direction = "down"; break;
        case "ArrowRight": this.direction = "right"; break;
      }
    });

    setInterval(() => {
      ctx.clearRect(0, 0, this.width, this.height);
      this.move(ctx, this.direction);
    }, 17);
  }

  move(ctx, dir: string): void {
    if (dir === "up") {
      if (this.y - this.stringLength - this.velocity > 0) {
        this.drawNewLine(ctx, this.x, this.y-this.velocity, true);
        this.y = this.y - this.velocity;
      } else {
        this.drawNewLine(ctx, this.x, this.y, true);
      }
    } else if (dir === "left") {
      if (this.x - this.stringLength - this.velocity > 0) {
        this.drawNewLine(ctx, this.x-this.velocity, this.y, false);
        this.x = this.x - this.velocity;
      } else {
        this.drawNewLine(ctx, this.x, this.y, false);
      }
    } else if (dir === "down") {
      if (this.y + this.stringLength + this.velocity < this.height) {
        this.drawNewLine(ctx, this.x, this.y+this.velocity, true);
        this.y = this.y + this.velocity;
      } else {
        this.drawNewLine(ctx, this.x, this.y, true);
      }
    } else if (dir === "right") {
      if (this.x + this.stringLength + this.velocity < this.width) {
        this.drawNewLine(ctx, this.x+this.velocity, this.y, false);
        this.x = this.x + this.velocity;
      } else {
        this.drawNewLine(ctx, this.x, this.y, false);
      }
    } else {
      this.drawNewLine(ctx, this.x, this.y, false);
    }
    // todo: Send to Backend
  }

  drawNewLine(ctx, x: number, y: number, upDown: boolean): void {
    ctx.beginPath();
    ctx.moveTo(x, y);
    if (upDown) {
      ctx.lineTo(x, y+ this.stringLength);
    } else {
      ctx.lineTo(x + this.stringLength, y);
    }
    ctx.stroke();
  }

}
