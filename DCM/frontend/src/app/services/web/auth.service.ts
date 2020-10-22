import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToolbarComponent } from 'src/app/toolbar/toolbar.component';
import { HttpClientHelperService } from './http-client-helper.service';
import { InMemoryDataService } from './in-memory-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginInUser: string;
  inMemoryToken = false;
  isLogin = new BehaviorSubject<boolean>(this.checkAuthenticated());
  currentUser = new BehaviorSubject<string>(this.getCurrentUser());
  constructor(
    private http: HttpClientHelperService,
    private memory: InMemoryDataService,
    private router: Router) { }

  login(username: string, password: string): Observable<any> {
    const body = {
      username: username,
      password: password
    };
    return this.http.dashPost('/auth/login', body);
  }

  signup(username: string, password: string): Observable<any> {
    const body = {
      username: username,
      password: password
    };
    return this.http.dashPost('/auth/register', body);
  }

  checkAuthenticated(): boolean {
    return this.inMemoryToken;
  }

  getCurrentUser(): string {
    return this.loginInUser;
  }

  logout(): void {
    this.inMemoryToken = false;
    this.router.navigate(['/login']);
  }

  get isLoggesIn() {
    return this.isLogin.asObservable();
  }

  get currentUserName() {
    return this.currentUser.asObservable();
  }


}
