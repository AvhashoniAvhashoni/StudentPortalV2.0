import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnrolledcoursesinfoPageRoutingModule } from './enrolledcoursesinfo-routing.module';

import { EnrolledcoursesinfoPage } from './enrolledcoursesinfo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnrolledcoursesinfoPageRoutingModule
  ],
  declarations: [EnrolledcoursesinfoPage]
})
export class EnrolledcoursesinfoPageModule {}
