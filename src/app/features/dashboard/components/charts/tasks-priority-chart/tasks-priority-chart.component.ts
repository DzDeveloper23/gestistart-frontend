import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { ChartComponent, ApexChart, ApexNonAxisChartSeries, ApexResponsive } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  responsive: ApexResponsive[];
  legend: any;
  dataLabels: any;
};

@Component({
  selector: 'app-tasks-priority-chart',
  standalone: false,
  templateUrl: './tasks-priority-chart.component.html',
  styleUrl: './tasks-priority-chart.component.scss'
})
export class TasksPriorityChartComponent implements OnChanges {
  @Input() data: any;
  @ViewChild('chart') chart!: ChartComponent;

  public chartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      type: 'donut',
      height: 300
    },
    labels: [],
    colors: ['#17a2b8', '#ffc107', '#dc3545', '#6c757d'],
    legend: {
      position: 'bottom',
      fontSize: '14px'
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return Math.round(val) + '%';
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 250
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  ngOnChanges(): void {
    if (this.data) {
      this.updateChart();
    }
  }

  updateChart(): void {
    const labels = Object.keys(this.data);
    const series = Object.values(this.data) as number[];

    this.chartOptions.series = series;
    this.chartOptions.labels = labels;
  }
}
