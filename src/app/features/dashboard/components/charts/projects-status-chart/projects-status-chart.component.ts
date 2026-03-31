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
  selector: 'app-projects-status-chart',
  standalone: false,
  templateUrl: './projects-status-chart.component.html',
  styleUrl: './projects-status-chart.component.scss'
})
export class ProjectsStatusChartComponent  implements OnChanges {
  @Input() data: any;
  @ViewChild('chart') chart!: ChartComponent;

  public chartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      type: 'pie',
      height: 300
    },
    labels: [],
    colors: ['#28a745', '#ffc107', '#7CB342', '#dc3545'],
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
