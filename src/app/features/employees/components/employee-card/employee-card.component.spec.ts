import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { EmployeeCardComponent } from './employee-card.component';

describe('EmployeeCardComponent', () => {
  let component: EmployeeCardComponent;
  let fixture: ComponentFixture<EmployeeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EmployeeCardComponent,
        DateFormatPipe
      ],
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCardComponent);
    component = fixture.componentInstance;
component.employee = {
  id: 1,
  nom: 'Doe',
  prenom: 'John',
  email: 'john@test.com',
  status: 'actif',
  poste: 'Dev',
  role: 'admin',
  dateEmbauche: new Date().toISOString(),
  projectsAssignes: []
} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
