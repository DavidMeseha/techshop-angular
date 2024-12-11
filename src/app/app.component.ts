import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavComponent } from './layout/side-nav/side-nav.component';
import { HeaderComponent } from './layout/header/header.component';
import { BottomNavComponent } from './layout/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SideNavComponent,
    HeaderComponent,
    BottomNavComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
