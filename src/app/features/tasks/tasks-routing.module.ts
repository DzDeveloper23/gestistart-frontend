import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';
import { TaskDetailComponent } from './pages/task-detail/task-detail.component';
import { KanbanBoardComponent } from './pages/kanban-board/kanban-board.component';
import { TaskCreateComponent } from './pages/task-create/task-create.component';

const routes: Routes = [
  { path: '', component: TasksListComponent },
  { path: 'kanban', component: KanbanBoardComponent },
  { path: 'create', component: TaskCreateComponent },
  { path: ':id', component: TaskDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
