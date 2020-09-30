import { Component, OnInit } from '@angular/core';
import {ConnectionService} from '../../../services/connection/connection.service';
import {count} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  private width = 1400;
  private height = 800;
  private direction = "down";
  private x = Math.random() * this.width;
  private y = Math.random() * this.height;
  private stringLength = 10;
  private velocity = 2;
  preRunning = true;
  countdown = 3;
  ifCountdown = false;
  private coinX = 0;
  private coinY = 0;
  private locations;
  private increaseLength = 0;
  private map = new Map<number, {color: string, positions: [{x: number, y: number}]}>();
  private isUsed = false;
  private count = 0;

  constructor(public cs: ConnectionService, private router: Router) { }

  ngOnInit(): void {
    if (this.cs.getRoomCode() === "") {
      this.router.navigate([""]);
    }

    this.locations = [{x: this.x, y: this.y}];
    for (let i = 0; i < this.stringLength / this.velocity; i++) {
      this.locations.push({x: this.x, y: this.y + this.velocity*(i+1)});
    }

    const snake = document.getElementById('snake') as HTMLCanvasElement;
    const ctx = snake.getContext('2d');
    ctx.strokeStyle = 'white';

    this.velocity = this.cs.getVelocity();
    this.cs.subscribeGame().subscribe(game => {
      if (game.message === "Game Full") {
        this.preRunning = false;
      } else if (game.message === "Coin generated") {
        this.coinX = game.payload.x;
        this.coinY = game.payload.y;
      } else if (game.message === "start Countdown") {
        this.ifCountdown = true;
        setTimeout(() => {
          this.countdown--;
          setTimeout(() => {
            this.countdown--;
            setTimeout(() => {
              this.countdown--;
              this.ifCountdown = false;
            }, 1000);
          }, 1000);
        }, 1000);
      }
    });
    this.cs.subscribeMovements().subscribe(movements => {
      if (movements.id !== this.cs.getId()) {
        while (this.isUsed) {}
        this.isUsed = true;
        this.map.set(movements.id, movements.payload);
        this.isUsed = false;
      }
    });

    document.addEventListener("keydown", e => {
      if (!this.preRunning && !this.ifCountdown) {
        switch (e.key) {
          case "ArrowUp": if (this.direction !== "down") { this.direction = "up"; } break;
          case "ArrowLeft": if (this.direction !== "right") { this.direction = "left"; } break;
          case "ArrowDown": if (this.direction !== "up") { this.direction = "down"; } break;
          case "ArrowRight": if (this.direction !== "left") { this.direction = "right"; } break;
        }
      }
    });

    setInterval(() => {
      if (!this.preRunning && !this.ifCountdown) {
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.beginPath();
        ctx.arc(this.coinX, this.coinY, 6, 0, Math.PI * 2);
        ctx.strokeStyle = "white";
        ctx.stroke();

        const diff = Math.sqrt(Math.pow(this.coinX-this.x, 2) + Math.pow(this.coinY-this.y, 2));
        if (diff <= 6) {
          this.cs.setCoinCollected();
          this.increaseLength += this.stringLength/this.velocity;
        }
        this.move(ctx, this.direction);
      }
    }, 17);
  }

  move(ctx, dir: string): void {
    if (dir === "up") {
      if (this.y - this.stringLength - this.velocity > 0) {
        this.drawNewLine(ctx,1);
      } else {
        this.drawNewLine(ctx,0);
      }
    } else if (dir === "left") {
      if (this.x - this.stringLength - this.velocity > 0) {
        this.drawNewLine(ctx, 2);
      } else {
        this.drawNewLine(ctx,0);
      }
    } else if (dir === "down") {
      if (this.y + this.stringLength + this.velocity < this.height) {
        this.drawNewLine(ctx, 3);
      } else {
        this.drawNewLine(ctx, 0);
      }
    } else if (dir === "right") {
      if (this.x + this.stringLength + this.velocity < this.width) {
        this.drawNewLine(ctx, 4);
      } else {
        this.drawNewLine(ctx,0);
      }
    } else {
      this.drawNewLine(ctx, 0);
    }
  }

  drawNewLine(ctx, upDown: number): void {
    let newLog;
    switch (upDown) {
      case 1: {
        newLog = {x: this.x, y: this.y - this.velocity};
      }       break;
      case 2: {
        newLog = {x: this.x - this.velocity, y: this.y};
      }       break;
      case 3: {
        newLog = {x: this.x, y: this.y + this.velocity};
      }       break;
      case 4: {
        newLog = {x: this.x + this.velocity, y: this.y};
      }       break;
    }
    if (upDown !== 0) {
      this.locations.unshift(newLog);
      if (this.increaseLength <= 0) {
        this.locations.pop();
      } else {
        this.increaseLength--;
      }
      this.x = newLog.x;
      this.y = newLog.y;
    }
    ctx.beginPath();
    let i = 0;
    this.locations.forEach(loc => {
      if (i === 0) {
        ctx.moveTo(loc.x, loc.y);
      } else {
        ctx.lineTo(loc.x, loc.y);
        if (i >= 5) {
          const diff = Math.sqrt(Math.pow(loc.x - this.x, 2) + Math.pow(loc.y - this.y, 2));
          if (diff <= this.velocity) {
            this.cs.setColor("red");
          }
        }
      }
      i++;
    });
    ctx.strokeStyle = this.cs.getColor();
    ctx.stroke();
    while (this.isUsed) {}
    this.isUsed = true;
    this.map.forEach((value, key) => {
      ctx.beginPath();
      let first2 = true;
      value.positions.forEach(loc => {
        if (first2) {
          ctx.moveTo(loc.x, loc.y);
          first2 = false;
        } else {
          ctx.lineTo(loc.x, loc.y);
        }
        const diff = Math.sqrt(Math.pow(loc.x - this.x, 2) + Math.pow(loc.y - this.y, 2));
        if (diff <= this.velocity) {
          this.cs.setColor("red");
        }
      });
      ctx.strokeStyle = value.color;
      ctx.stroke();
    });
    this.isUsed = false;
    this.count++;
    if (this.count % 10 === 0) {
      this.cs.sendMovement(this.locations);
    }
  }

}
