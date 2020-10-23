import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/web/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  currentUser: string;
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    console.log(this.currentUser);
  }

  logout(): void {
    this.authService.logout();
  }

}
