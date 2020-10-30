import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClientHelperService } from './http-client-helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  inMemoryToken = false; // whether the user loginned or not
  currentUser: string; // user name
  constructor(
    private http: HttpClientHelperService,
    private router: Router) { }

  login(username: string, password: string): Observable<any> {
    const body = {
      username,
      password
    };
    return this.http.dashPost('/auth/login', body);
  }

  signup(username: string, password: string): Observable<any> {
    const body = {
      username,
      password
    };
    return this.http.dashPost('/auth/register', body);
  }

  logout(): void {
    this.inMemoryToken = false;
    this.router.navigate(['/login']);
  }
}
