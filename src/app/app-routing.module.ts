import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WelcomeComponent} from './components/welcome/welcome/welcome.component';
import {GameComponent} from './components/game/game/game.component';

const routes: Routes = [
  {
    path: "",
    component: WelcomeComponent
  },
  {
    path: "game",
    component: GameComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
