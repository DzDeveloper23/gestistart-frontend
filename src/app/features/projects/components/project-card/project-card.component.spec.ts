import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { ProjectCardComponent } from './project-card.component';
import { Project } from '../../../projects/models/project.model'; // ← ajuste le chemin

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;

  const mockProject: Project = {
    _id: '1',
    titre: 'Projet Test',
    description: 'Description test',
    clientId: {
      _id: 'client-1',
      nomEntreprise: 'Entreprise Test',
      email: 'client@test.com'
    },
    team: [],
    status: 'En cours',
    budget: 10000,
    montantUtilise: 5000,
    dateDebut: new Date(),
    dateFin: new Date(),
    priorite: 'Haute',
    notes: '',
    createdBy: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectCardComponent, DateFormatPipe],
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    component.project = mockProject; // ← injecté avant detectChanges
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
