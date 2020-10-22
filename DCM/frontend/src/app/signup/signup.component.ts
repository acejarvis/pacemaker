import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/web/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  username: string;
  password: string;
  retypePassword: string;
  hide = true;
  isSignupValid = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }

  signUp(): void {
    if ((this.password === this.retypePassword) && this.password && this.retypePassword) {
      this.authService.signup(this.username, this.password).subscribe(response => {
        this.isSignupValid = true;
        if (response.status === true) {
          this.snackBar.open(response.msg, undefined, { duration: 1000 }).afterDismissed()
            .subscribe(() => this.router.navigate(['/login']));
        }
        else if (response.status === false) { this.snackBar.open(response.msg, undefined, { duration: 1000 }); }
      });
    }
    else { this.isSignupValid = false; }
  }

}
