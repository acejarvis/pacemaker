import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientHelperService } from '../web/http-client-helper.service';

@Injectable({
  providedIn: 'root'
})
export class DashService {

  constructor(private http: HttpClientHelperService) { }
  getPaceMakerData(username: string): Observable<any> {
    const body = {
      username: username
    };
    return this.http.dashPost('/pacemaker/user', body);
  }

  dispatchPaceMakerData(body: any): Observable<any> {
    return this.http.dashPost('/pacemaker/dispatch', body);
  }

}
