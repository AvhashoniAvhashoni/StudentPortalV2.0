import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnrolledcoursesPage } from './enrolledcourses.page';

const routes: Routes = [
  {
    path: '',
    component: EnrolledcoursesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnrolledcoursesPageRoutingModule {}
