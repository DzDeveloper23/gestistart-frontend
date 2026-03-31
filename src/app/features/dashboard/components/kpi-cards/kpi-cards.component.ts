import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-cards',
  standalone: false,
  templateUrl: './kpi-cards.component.html',
  styleUrl: './kpi-cards.component.scss'
})
export class KpiCardsComponent {
@Input() kpis: any;

  kpiConfig = [
    {
      label: 'Projets Actifs',
      icon: 'bi-folder',
      color: 'primary',
      getValue: (kpis: any) => kpis?.projets?.enCours || 0,
      subValue: (kpis: any) => `${kpis?.projets?.total || 0} total`
    },
    {
      label: 'Tâches en Cours',
      icon: 'bi-check-square',
      color: 'success',
      getValue: (kpis: any) => kpis?.taches?.enCours || 0,
      subValue: (kpis: any) => `${kpis?.taches?.enRetard || 0} en retard`
    },
    {
      label: 'Clients Actifs',
      icon: 'bi-building',
      color: 'info',
      getValue: (kpis: any) => kpis?.clients?.actifs || 0,
      subValue: (kpis: any) => `${kpis?.clients?.total || 0} total`
    },
    {
      label: 'Employés',
      icon: 'bi-people',
      color: 'warning',
      getValue: (kpis: any) => kpis?.employes?.actifs || 0,
      subValue: (kpis: any) => `${kpis?.employes?.total || 0} total`
    }
  ];
}
