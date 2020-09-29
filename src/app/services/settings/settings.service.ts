import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  /*
    0 = dark
    1 = light
   */
  private colorScheme = 0;

  constructor() { }

  public getColorScheme(): number {
    return this.colorScheme;
  }
}
