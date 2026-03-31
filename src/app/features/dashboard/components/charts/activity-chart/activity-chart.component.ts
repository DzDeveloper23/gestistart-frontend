import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexLegend,
  ApexGrid
} from 'ng-apexcharts';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  grid: ApexGrid;
  colors: string[];
};
@Component({
  selector: 'app-activity-chart',
  standalone: false,
  templateUrl: './activity-chart.component.html',
  styleUrl: './activity-chart.component.scss'
})
export class ActivityChartComponent implements OnChanges {
  @Input() data: any[] = [];
  @ViewChild('chart') chart!: ChartComponent;

  public chartOptions: Partial<ChartOptions> = {
    series: [
      {
        name: 'Tâches Créées',
        data: []
      },
      {
        name: 'Tâches Terminées',
        data: []
      }
    ],
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false
      }
    },
    colors: ['#7CB342', '#28a745'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      title: {
        text: 'Nombre de tâches'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    },
    grid: {
      borderColor: '#f1f1f1'
    }
  };

  ngOnChanges(): void {
    if (this.data && this.data.length > 0) {
      this.updateChart();
    }
  }

  updateChart(): void {
    const categories = this.data.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    });
    const tasksCreated = this.data.map(item => item.tasksCreated);
    const tasksCompleted = this.data.map(item => item.tasksCompleted);

    this.chartOptions.xaxis = {
      categories: categories
    };

    this.chartOptions.series = [
      {
        name: 'Tâches Créées',
        data: tasksCreated
      },
      {
        name: 'Tâches Terminées',
        data: tasksCompleted
      }
    ];
  }
}
