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

  isNaturalAtriumON = false;
  isNaturalVentricleON = false;
  pulseWidthA = 1;
  pulseWidthV = 1;
  atriumAmplitude = 1;
  ventricleAmplitude = 1;
  lowerRateLimit = 1;
  upperRateLimit = 1;

  @ViewChild('chart') chart: ChartComponent;
  public chartAOptions: Partial<any>;
  public chartVOptions: Partial<any>;

  constructor() {
    this.chartAOptions = {
      series: [
        {
          name: "My-series",
          data: [10, 41, 35, 10, 10, 11, 9, 12, 45]
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
        text: "Atrium Signals"
      },
      xaxis: {
        categories: ["10000", "10001", "10002", "10003", "10004", "10005", "10006", "10007", "10008"]
      }
    };
    this.chartVOptions = {
      series: [
        {
          name: "My-series",
          data: [10, 41, 35, 10, 10, 11, 9, 12, 45]
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

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

}
