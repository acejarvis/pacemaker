import { Component, OnInit, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";

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
  mode = 0;
  lowerRateLimit = 60;
  upperRateLimit = 120;
  pulseWidth = 0.4;
  pulseWidthSelect = 1;
  amplitudeRegulated = 3.5;
  amplitudeRegulatedSelect = 1;
  amplitudeUnregulated = 3.7;
  atrialRefractoryPeriod = 250;
  ventricularRefractoryPeriod = 320;


  @ViewChild('chart') chart: ChartComponent;
  public chartAOptions: Partial<any>;
  public chartVOptions: Partial<any>;
  data = [10, 41, 35, 10, 10, 11, 9, 12, 45, 10, 10, 11, 9, 12, 10, 10, 11, 9, 12]

  constructor() {
    this.chartAOptions = {
      series: [
        {
          name: "My-series",
          data: this.data
        }
      ],
      chart: {
        height: 350,
        type: "line",
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
        text: "Atrium Signals"
      },
      xaxis: {
        categories: ["10000", "10001", "10002", "10003", "10004", "10005", "10006", "10007", "10008"]
      }
    };
    // window.setInterval(function () {
    //   this.chart.updateSeries([{ data: this.data }])
    // }, 100);

    this.chartVOptions = {
      series: [
        {
          name: "My-series",
          data: [10, 41, 35, 15, 10, 11, 39, 12, 45]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: true,
          type: 'xy',
          autoScaleYaxis: true,
        }
      },
      title: {
        text: "Ventricle Signals"
      },
      xaxis: {
        categories: ["10000", "10001", "10002", "10003", "10004", "10005", "10006", "10007", "10008"]
      }
    };

  }

  ngOnInit(): void {
  }

  stopStart(): void {
    this.isRunning = !this.isRunning;
  }
}
