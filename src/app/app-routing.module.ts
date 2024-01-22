import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateStudentComponent } from "./students/create-student/create-student.component";
import { ListStudentsComponent } from "./components/list-students/list-students.component";


const routes: Routes = [
  {path: '', redirectTo: '/listStudents', pathMatch: 'full'},
  {path: 'createStudent', component: CreateStudentComponent},
  {path: 'listStudents', component: ListStudentsComponent},
  {
    path: 'listStudents/:id',
    loadComponent: () => import('./components/single-student/single-student.component').then(m => m.SingleStudentComponent)
  },
  { path: '**', redirectTo: 'listStudents', pathMatch: 'full' }, 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
