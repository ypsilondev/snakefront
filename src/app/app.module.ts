import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import { WelcomeComponent } from './components/welcome/welcome/welcome.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import { GameComponent } from './components/game/game/game.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ColorSelectionComponent } from './components/colorSelection/color-selection/color-selection.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

const config: SocketIoConfig = { url: 'https://snake.ypsilon.tech', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    GameComponent,
    ColorSelectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatButtonToggleModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
