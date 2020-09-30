import { Component, OnInit } from '@angular/core';
import {ConnectionService} from '../../../services/connection/connection.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  private width = 1400;
  private height = 800;
  private stringLength = 10;
  private velocity = 2;
  preRunning = true;
  countdown = 3;
  ifCountdown = false;
  private coinX = 0;
  private coinY = 0;
  private increaseLength = new Map<number, number>();
  private map = new Map<number, {color: string, positions: string}>();
  private locations = new Map<number, [{x: number, y: number}]>();

  constructor(public cs: ConnectionService, private router: Router) { }

  ngOnInit(): void {
    if (this.cs.getRoomCode() === "") {
      this.router.navigate([""]);
    }

    const y = Math.random() * this.height;
    const x = Math.random() * this.width;

    this.map.set(this.cs.getId(), {color: this.cs.getColor(), positions: "down"});
    this.locations.set(this.cs.getId(), [{x, y}]);
    this.increaseLength.set(this.cs.getId(), 0);

    const snake = document.getElementById('snake') as HTMLCanvasElement;
    const ctx = snake.getContext('2d');
    ctx.strokeStyle = 'white';

    this.velocity = this.cs.getVelocity();
    this.cs.subscribeGame().subscribe(game => {
      console.log(game);
      if (game.message === "Game Full") {
        this.cs.sendCord(x, y);
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
            this.locations.forEach((value, key) => {
              for (let i = 0; i < this.stringLength / this.velocity; i++) {
                value.push({x: value[0].x, y: value[0].y + this.velocity*(i+1)});
              }
            });
            setTimeout(() => {
              this.countdown--;
              this.ifCountdown = false;
            }, 1000);
          }, 1000);
        }, 1000);
      } else if (game.message === "startCord" && game.payload.id !== this.cs.getId()) {
        console.log(game);
        this.locations.set(game.payload.id, [{x: game.payload.x, y: game.payload.y}]);
        this.increaseLength.set(game.payload.id, 0);
      } else if (game.message === "incLength" && game.payload.id !== this.cs.getId()) {
        this.increaseLength.set(game.payload.id, game.payload.value);
      }
    });
    this.cs.subscribeMovements().subscribe(movements => {
      if (movements.id !== this.cs.getId()) {
        this.map.set(movements.id, movements.payload);
      }
    });

    document.addEventListener("keydown", e => {
      if (!this.preRunning && !this.ifCountdown) {
        switch (e.key) {
          case "ArrowUp": if (this.map.get(this.cs.getId()).positions !== "down") { this.setOwnDir("up"); } break;
          case "ArrowLeft": if (this.map.get(this.cs.getId()).positions !== "right") { this.setOwnDir("left"); } break;
          case "ArrowDown": if (this.map.get(this.cs.getId()).positions !== "up") { this.setOwnDir("down"); } break;
          case "ArrowRight": if (this.map.get(this.cs.getId()).positions !== "left") { this.setOwnDir("right"); } break;
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

        const diff = Math.sqrt(Math.pow(
          this.coinX-this.locations.get(this.cs.getId())[0].x, 2) +
          Math.pow(this.coinY-this.locations.get(this.cs.getId())[0].y, 2)
        );
        if (diff <= 6) {
          this.cs.setCoinCollected();
          const tmp = this.increaseLength.get(this.cs.getId())+(this.stringLength / this.velocity);
          this.increaseLength.set(this.cs.getId(), tmp);
          this.cs.sendIncLength(tmp);
        }
        this.map.forEach((value, key) => {
          this.move(ctx, value.positions, key);
        });
      }
    }, 17);
  }

  move(ctx, dir: string, id: number): void {
    const x = this.locations.get(id)[0].x;
    const y = this.locations.get(id)[0].y;
    if (dir === "up") {
      if (y - this.stringLength - this.velocity > 0) {
        this.drawNewLine(ctx,1, id);
      } else {
        this.drawNewLine(ctx,0, id);
      }
    } else if (dir === "left") {
      if (x - this.stringLength - this.velocity > 0) {
        this.drawNewLine(ctx, 2, id);
      } else {
        this.drawNewLine(ctx,0, id);
      }
    } else if (dir === "down") {
      if (y + this.stringLength + this.velocity < this.height) {
        this.drawNewLine(ctx, 3, id);
      } else {
        this.drawNewLine(ctx, 0, id);
      }
    } else if (dir === "right") {
      if (x + this.stringLength + this.velocity < this.width) {
        this.drawNewLine(ctx, 4, id);
      } else {
        this.drawNewLine(ctx,0, id);
      }
    } else {
      this.drawNewLine(ctx, 0, id);
    }
  }

  drawNewLine(ctx, upDown: number, id: number): void {
    let newLog;
    const data = this.locations.get(id);
    switch (upDown) {
      case 1: {
        newLog = {x: data[0].x, y: data[0].y - this.velocity};
      }       break;
      case 2: {
        newLog = {x: data[0].x - this.velocity, y: data[0].y};
      }       break;
      case 3: {
        newLog = {x: data[0].x, y: data[0].y + this.velocity};
      }       break;
      case 4: {
        newLog = {x: data[0].x + this.velocity, y: data[0].y};
      }       break;
    }
    if (upDown !== 0) {
      data.unshift(newLog);
      if (this.increaseLength.get(id) <= 0) {
        data.pop();
      } else {
        this.increaseLength.set(id, this.increaseLength.get(id)-1);
      }
    }
    ctx.beginPath();
    let i = 0;
    data.forEach(loc => {
      if (i === 0) {
        ctx.moveTo(loc.x, loc.y);
      } else {
        ctx.lineTo(loc.x, loc.y);
        if (i >= 10) {
          const diff = Math.sqrt(Math.pow(loc.x - data[0].x, 2) + Math.pow(loc.y - data[0].y, 2));
          if (diff <= this.velocity) {
            console.log(diff);
            this.cs.setColor("red");
          }
        }
      }
      i++;
    });
    ctx.strokeStyle = this.cs.getColor();
    ctx.stroke();
    this.locations.set(id, data);
  }

  setOwnDir(dir: string): void {
    const entry = this.map.get(this.cs.getId());
    entry.positions = dir;
    this.map.set(this.cs.getId(), entry);
    this.cs.sendMovement(dir);
  }

}
