import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnrolledcoursesinfoPage } from './enrolledcoursesinfo.page';

const routes: Routes = [
  {
    path: '',
    component: EnrolledcoursesinfoPage
  },  {
    path: 'rating',
    loadChildren: () => import('./rating/rating.module').then( m => m.RatingPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnrolledcoursesinfoPageRoutingModule {}
