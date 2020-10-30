import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from 'ng-apexcharts';
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

  // DCM parameters
  isRunning = false;
  isConnected = false;
  port = 0;
  status = 'Disconnected';
  mode: number;
  lowerRateLimit = 60;
  upperRateLimit = 120;
  atrialPulseWidth = 0.4;
  ventriclePulseWidth = 0.4;
  pulseWidthSelect = 1;
  atrialPulseAmplitude = 1;
  ventriclePulseAmplitude = 1;

  amplitudeRegulated = 3.5;
  amplitudeRegulatedSelect = 1;
  amplitudeUnregulated = 3.7;
  atrialRefractoryPeriod = 250;
  ventricularRefractoryPeriod = 320;

  changeset = false;
  @ViewChild('chart') chart: ChartComponent;
  public chartAOptions: Partial<any>;
  public chartVOptions: Partial<any>;
  data = [10, 41, 35, 10, 10, 11, 9, 12, 45, 10, 10, 11, 9, 12, 10, 10, 11, 9, 12];

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
          easing: 'linear',
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
        categories: ['10000', '10001', '10002', '10003', '10004', '10005', '10006', '10007', '10008']
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
          data: [10, 10, 10, 10, 10, 10, 10, 10, 10]
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
        categories: ['10000', '10001', '10002', '10003', '10004', '10005', '10006', '10007', '10008']
      }
    };
  }

  ngOnInit(): void {
    // load user defined pacemaker parameters
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
      if (this.mode === 0 || this.mode === 1) {
        this.pulseWidthSelect = response.atrialPulseWidth < 0.1 ? 0 : 1;
        this.amplitudeRegulatedSelect = response.atrialPulseAmplitude < 0.5 ? 0 : 1;
      }
      else {
        this.pulseWidthSelect = response.ventriclePulseWidth < 0.1 ? 0 : 1;
        this.amplitudeRegulatedSelect = response.ventriclePulseAmplitude < 0.5 ? 0 : 1;
      }
    });
  }

  stopStart(): void {
    this.isRunning = !this.isRunning;
    if (this.isRunning) { this.updateSeries(); this.status = 'Communicating'; }
    else { this.status = 'Connected'; }
  }

  connect(): void {
    this.isConnected = !this.isConnected;
    if (this.isConnected) {
      this.status = 'Connected';
      this.mode = 0;
      if (this.port === 1) {
        this.snackBar.open('New Device Connected', undefined, { duration: 1000, verticalPosition: 'top' });
      }
    }
    else { this.status = 'Disconnected'; }
  }

  updateParameters(): void {
    if (this.pulseWidthSelect === 0) {
      if (this.mode === 0 || this.mode === 1) { this.atrialPulseWidth = 0.05; }
      else { this.ventriclePulseWidth = 0.05; }
    }
    if (this.amplitudeRegulatedSelect === 0) {
      if (this.mode === 0 || this.mode === 1) { this.atrialPulseAmplitude = 0; }
      else { this.ventriclePulseAmplitude = 0; }
    }
    const body = {
      username: this.authService.currentUser,
      mode: this.mode,
      lowerRateLimit: this.lowerRateLimit,
      upperRateLimit: this.upperRateLimit,
      atrialPulseAmplitude: this.atrialPulseAmplitude,
      ventriclePulseAmplitude: this.ventriclePulseAmplitude,
      atrialPulseWidth: this.atrialPulseWidth,
      ventriclePulseWidth: this.ventriclePulseWidth,
      ventricularRefractoryPeriod: this.ventricularRefractoryPeriod,
      atrialRefractoryPeriod: this.atrialRefractoryPeriod
    };
    this.dashService.updatePaceMakerData(body).subscribe(result => {
      this.snackBar.open(result.msg, undefined, { duration: 1000, verticalPosition: 'top' });
    });
  }

  // for demo use
  public updateSeries(): void {
    this.changeset = !this.changeset;
    this.chartAOptions.series = this.changeset ? [{
      data: [23, 44, 1, 22, 10, 11, 10, 10, 12, 13]
    }] : [{
      data: [11, 10, 10, 12, 11, 10, 10, 12, 13, 23]
    }];
  }
}
