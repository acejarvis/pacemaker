import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientHelperService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  rootUrl = 'http://localhost:3000';

  dashGet(dashUrl: string): Observable<any> {
    return this.http.get(this.rootUrl + dashUrl, this.httpOptions);
  }
  dashPost(dashUrl: string, body: any): Observable<any> {
    return this.http.post(this.rootUrl + dashUrl, JSON.stringify(body), this.httpOptions);
  }
}
