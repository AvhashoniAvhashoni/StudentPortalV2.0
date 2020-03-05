import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnrolledcoursesinfoPageRoutingModule } from './enrolledcoursesinfo-routing.module';

import { EnrolledcoursesinfoPage } from './enrolledcoursesinfo.page';
import {RatingPage} from './rating/rating.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnrolledcoursesinfoPageRoutingModule
  ],
  declarations: [EnrolledcoursesinfoPage, RatingPage],
  entryComponents: [RatingPage]
})
export class EnrolledcoursesinfoPageModule {}
