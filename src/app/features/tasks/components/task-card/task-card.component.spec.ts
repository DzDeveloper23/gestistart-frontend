import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe'; // ajuste le chemin
import { TaskCardComponent } from './task-card.component';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TaskCardComponent,
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

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
component.task = {
  _id: '1',
  titre: 'Test task',
  description: 'Test',
  dateEcheance: new Date(),
  status: 'En cours',
  priorite: 'Haute',
  projectId: { _id: '1', titre: 'Projet test' },
  assigneId: { _id: '1', nom: 'Doe', email: 'doe@test.com' },
  piecesJointes: [],
  commentaires: [],
  createdBy: null,
  createdAt: new Date(),
  updatedAt: new Date()
} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
