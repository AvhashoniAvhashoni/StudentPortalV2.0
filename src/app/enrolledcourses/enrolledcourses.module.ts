import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnrolledcoursesPageRoutingModule } from './enrolledcourses-routing.module';

import { EnrolledcoursesPage } from './enrolledcourses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnrolledcoursesPageRoutingModule
  ],
  declarations: [EnrolledcoursesPage]
})
export class EnrolledcoursesPageModule {}
