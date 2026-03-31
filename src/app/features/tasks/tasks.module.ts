import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { TasksRoutingModule } from './tasks-routing.module';

// Pages
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';
import { TaskDetailComponent } from './pages/task-detail/task-detail.component';
import { KanbanBoardComponent } from './pages/kanban-board/kanban-board.component'; 
import { TaskCreateComponent } from './pages/task-create/task-create.component';

// Components
import { TaskCardComponent } from './components/task-card/task-card.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { KanbanColumnComponent } from './components/kanban-column/kanban-column.component';
import { TaskCommentsComponent } from './components/task-comments/task-comments.component';
import { TaskAttachmentsComponent } from './components/task-attachments/task-attachments.component';

@NgModule({
  declarations: [
    TasksListComponent,
    TaskDetailComponent,
    KanbanBoardComponent,
    TaskCreateComponent,
    TaskCardComponent,
    TaskFormComponent,
    KanbanColumnComponent,
    TaskCommentsComponent,
    TaskAttachmentsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TasksRoutingModule
  ]
})
export class TasksModule { }
