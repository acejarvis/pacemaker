import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from 'ng-apexcharts';
import { Subscription } from 'rxjs';
import { DashService } from '../services/dash/dash.service';
import { AuthService } from '../services/web/auth.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // streaming
  stream: Subscription;
  currentData = [];
  // DCM parameters
  isRunning = false;
  isConnected = false;
  port: any = {};
  portList = [];
  myPortList = [];
  status = 'Disconnected';
  mode: any = {};
  modes = [
    { id: 1, name: 'AOO' },
    { id: 2, name: 'VOO' },
    { id: 3, name: 'AAI' },
    { id: 4, name: 'VVI' },
    { id: 5, name: 'DOO' },
    { id: 6, name: 'AOOR' },
    { id: 7, name: 'VOOR' },
    { id: 8, name: 'AAIR' },
    { id: 9, name: 'VVIR' },
    { id: 10, name: 'DOOR' },
    { id: 11, name: 'DDDR' },
  ];
  lowerRateLimit = 60;
  upperRateLimit = 120;
  atrialPulseWidth = 0.4;
  ventriclePulseWidth = 0.4;
  pulseWidthSelect = 1;
  atrialPulseAmplitude = 1;
  ventriclePulseAmplitude = 1;

  amplitudeSelect = 1;
  atrialRefractoryPeriod = 250;
  ventricularRefractoryPeriod = 320;

  changeset = false;
  @ViewChild('chart') chart: ChartComponent;
  public chartAOptions: Partial<any>;
  public chartVOptions: Partial<any>;
  data: number[] = new Array(100);


  constructor(
    private snackBar: MatSnackBar,
    private dashService: DashService,
    private authService: AuthService) {

    // for demo use
    this.chartAOptions = {
      series: [
        {
          name: 'My-series',
          data: this.data
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        animations: {
          enabled: true,
          easing: 'easeinout',
          dynamicAnimation: {
            speed: 1000
          }
        },
        zoom: {
          enabled: true,
          type: 'xy',
          autoScaleYaxis: true,
        }
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Atrium Signals'
      },
      xaxis: {
        type: 'datetime'
      }
    };
    // window.setInterval(function () {
    //   this.chart.updateSeries([{ data: this.data }])
    // }, 100);

    // for demo use
    this.chartVOptions = {
      series: [
        {
          name: 'My-series',
          data: this.data
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: true,
          type: 'xy',
          autoScaleYaxis: true,
        }
      },
      title: {
        text: 'Ventricle Signals'
      },
      xaxis: {
        type: 'datetime'
      }
    };
  }

  ngOnInit(): void {
    // load user defined pacemaker parameters
    this.getSerialPort();
    this.dashService.getPaceMakerData(this.authService.currentUser).subscribe(response => {
      this.mode = response.mode;
      this.lowerRateLimit = response.lowerRateLimit;
      this.upperRateLimit = response.upperRateLimit;
      this.atrialPulseWidth = response.atrialPulseWidth;
      this.ventriclePulseWidth = response.ventriclePulseWidth;
      this.atrialPulseAmplitude = response.atrialPulseAmplitude;
      this.ventriclePulseAmplitude = response.ventriclePulseAmplitude;
      this.atrialRefractoryPeriod = response.atrialRefractoryPeriod;
      this.ventricularRefractoryPeriod = response.ventricularRefractoryPeriod;
      this.myPortList = response.portList;
      if (this.mode === 0 || this.mode === 1) {
        this.pulseWidthSelect = response.atrialPulseWidth < 0.1 ? 0 : 1;
        this.amplitudeSelect = response.atrialPulseAmplitude < 0.5 ? 0 : 1;
      }
      else {
        this.pulseWidthSelect = response.ventriclePulseWidth < 0.1 ? 0 : 1;
        this.amplitudeSelect = response.ventriclePulseAmplitude < 0.5 ? 0 : 1;
      }
    });

    this.stream = this.dashService.streamData.subscribe(data => {
      const dataPoint = [new Date(), data];
      if (this.currentData.length <= 100) {
        this.currentData.push(dataPoint);
      } else {
        this.currentData.shift();
        this.currentData.push(dataPoint);
      }
      console.log(data);
      if (this.isRunning) { this.updateSeries(this.currentData); }
  });
}

stopStart(): void {
  this.isRunning = !this.isRunning;
  if (this.isRunning) { this.updateSeries(this.currentData); this.status = 'Communicating'; }
    else { this.status = 'Connected'; }
  }

connect(): void {
  this.isConnected = !this.isConnected;
  if (this.isConnected) {
  this.status = 'Connected';
  this.mode = 0;
  const existDevice = this.myPortList.find(device => device.serialNumber === this.port.serialNumber);
  if (!existDevice) {
    this.snackBar.open('New Device Connected', undefined, { duration: 1000, verticalPosition: 'top' });
    this.myPortList.push(this.port);
  }
}
    else { this.status = 'Disconnected'; }
  }

updateParameters(): void {
  if (this.pulseWidthSelect === 0) {
  if (this.mode === 0 || this.mode === 1) { this.atrialPulseWidth = 0.05; }
  else { this.ventriclePulseWidth = 0.05; }
}
  if (this.amplitudeSelect === 0) {
  if (this.mode === 0 || this.mode === 1) { this.atrialPulseAmplitude = 0; }
  else { this.ventriclePulseAmplitude = 0; }
}
  const body = {
  username: this.authService.currentUser,
  mode: this.mode.id,
  lowerRateLimit: this.lowerRateLimit,
  upperRateLimit: this.upperRateLimit,
  atrialPulseAmplitude: this.atrialPulseAmplitude,
  ventriclePulseAmplitude: this.ventriclePulseAmplitude,
  atrialPulseWidth: this.atrialPulseWidth,
  ventriclePulseWidth: this.ventriclePulseWidth,
  ventricularRefractoryPeriod: this.ventricularRefractoryPeriod,
  atrialRefractoryPeriod: this.atrialRefractoryPeriod,
  portList: this.myPortList
};
  this.dashService.updatePaceMakerData(body).subscribe(result => {
  this.snackBar.open(result.msg, undefined, { duration: 1000, verticalPosition: 'top' });
});
  }

getSerialPort(): void {
  this.dashService.getPortList().subscribe(result => {
    result.forEach(port => {
      console.log(port);
      this.portList.push(port);
    });
  });
}

  // for demo use
  public updateSeries(updateData: any[]): void {
  this.chartAOptions.series = [{ data: updateData }];
}
}
