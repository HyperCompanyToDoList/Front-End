import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main.layout',
  standalone: true,
  imports: [RouterOutlet,RouterModule,RouterLink],
  templateUrl: './main.layout.component.html',
  styleUrl: './main.layout.component.scss'
})
export class MainLayoutComponent {

}
