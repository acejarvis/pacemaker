import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClientHelperService } from './http-client-helper.service';
import { InMemoryDataService } from './in-memory-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  inMemoryToken = false;
  currentUser: string;
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
  logout(): void {
    this.inMemoryToken = false;
    this.router.navigate(['/login']);
  }

}
