import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/web/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  hide = true;
  loginInvalid: boolean;
  invalidMessage: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login(): void {
    this.loginInvalid = false;

    this.authService.login(this.username, this.password).subscribe(response => {
      if (response === true) {
        this.loginInvalid = false;
        this.authService.inMemoryToken = true;
        this.authService.loginInUser = this.username;
        this.router.navigate(['/home']);
      }
      else if (response === false) {
        this.loginInvalid = true;
        this.authService.inMemoryToken = false;
        this.invalidMessage = 'Incorrect password.';
      }
    }, error => {
      if (error === 409) { this.loginInvalid = true; this.invalidMessage = 'User does not exist.'; }
    });

  }
}
