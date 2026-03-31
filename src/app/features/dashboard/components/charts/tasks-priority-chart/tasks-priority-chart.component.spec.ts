import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksPriorityChartComponent } from './tasks-priority-chart.component';

describe('TasksPriorityChartComponent', () => {
  let component: TasksPriorityChartComponent;
  let fixture: ComponentFixture<TasksPriorityChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksPriorityChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksPriorityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
