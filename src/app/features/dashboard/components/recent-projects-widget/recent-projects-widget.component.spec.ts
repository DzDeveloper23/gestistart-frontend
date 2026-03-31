import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentProjectsWidgetComponent } from './recent-projects-widget.component';

describe('RecentProjectsWidgetComponent', () => {
  let component: RecentProjectsWidgetComponent;
  let fixture: ComponentFixture<RecentProjectsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecentProjectsWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentProjectsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
