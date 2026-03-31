import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgentTasksWidgetComponent } from './urgent-tasks-widget.component';

describe('UrgentTasksWidgetComponent', () => {
  let component: UrgentTasksWidgetComponent;
  let fixture: ComponentFixture<UrgentTasksWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UrgentTasksWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrgentTasksWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
