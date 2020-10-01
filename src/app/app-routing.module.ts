import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WelcomeComponent} from './components/welcome/welcome/welcome.component';
import {GameComponent} from './components/game/game/game.component';
import {ColorSelectionComponent} from './components/colorSelection/color-selection/color-selection.component';

const routes: Routes = [
  {
    path: "",
    component: WelcomeComponent
  },
  {
    path: "game",
    component: GameComponent
  },
  {
    path: "color",
    component: ColorSelectionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
