import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnrolledcoursesinfoPage } from './enrolledcoursesinfo.page';

const routes: Routes = [
  {
    path: '',
    component: EnrolledcoursesinfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnrolledcoursesinfoPageRoutingModule {}
