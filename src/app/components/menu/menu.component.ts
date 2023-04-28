import { Component, OnInit,Input } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  constructor(public authService: AuthService) {}

  @Input() name: string="";
  @Input() profile:string="";
  
}
