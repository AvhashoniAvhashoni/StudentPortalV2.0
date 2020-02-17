import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Course } from '../class/course';

@Component({
  selector: 'app-course',
  templateUrl: './course.page.html',
  styleUrls: ['./course.page.scss'],
})
export class CoursePage implements OnInit {
  public course: Course;
  constructor(private _service: AppService) { }

  ngOnInit() {
    this.course = this._service.getSession("course");
    console.log(this.course)
  }


}
