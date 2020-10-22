import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/web/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<string>;
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isLoggesIn;
    this.currentUser$ = this.authService.currentUserName;
    console.log(this.isAuthenticated$);
    console.log(this.currentUser$);

  }

  logout(): void {
    this.authService.logout();
  }

}
