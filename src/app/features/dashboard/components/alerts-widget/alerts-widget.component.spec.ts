import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsWidgetComponent } from './alerts-widget.component';

describe('AlertsWidgetComponent', () => {
  let component: AlertsWidgetComponent;
  let fixture: ComponentFixture<AlertsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertsWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
