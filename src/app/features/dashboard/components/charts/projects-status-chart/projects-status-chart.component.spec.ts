import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsStatusChartComponent } from './projects-status-chart.component';

describe('ProjectsStatusChartComponent', () => {
  let component: ProjectsStatusChartComponent;
  let fixture: ComponentFixture<ProjectsStatusChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectsStatusChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsStatusChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
