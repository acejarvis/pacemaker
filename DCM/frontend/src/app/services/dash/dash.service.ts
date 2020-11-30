import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClientHelperService } from '../web/http-client-helper.service';

@Injectable({
  providedIn: 'root'
})
export class DashService {
  constructor(
    private http: HttpClientHelperService,
    private socket: Socket) { }

  streamData = this.socket.fromEvent('pacemaker');



  getPaceMakerData(username: string): Observable<any> {
    const body = {
      username
    };
    return this.http.dashPost('/pacemaker/user', body);
  }

  updatePaceMakerData(body: any): Observable<any> {
    return this.http.dashPost('/pacemaker/update', body);
  }

  getPortList(): Observable<any> {
    return this.http.dashGet('/pacemaker/port');
  }

  sendParameters(data: string): void {
    this.socket.emit('pacemaker', data);
  }

  listen(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('packmaker', data => {
        subscriber.next(data);
      });
    });
  }

}
