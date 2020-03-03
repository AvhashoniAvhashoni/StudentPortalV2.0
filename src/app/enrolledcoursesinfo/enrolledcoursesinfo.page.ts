import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Course } from '../class/course';

@Component({
    selector: 'app-enrolledcoursesinfo',
    templateUrl: './enrolledcoursesinfo.page.html',
    styleUrls: ['./enrolledcoursesinfo.page.scss'],
})
export class EnrolledcoursesinfoPage implements OnInit {
    public course: Course;
    public duration: number = 0;
    constructor(private _service: AppService) { }

    ngOnInit() {
        this.course = this._service.getSession("enrolledCourseInfo");
        var timeDiff = Math.abs(new Date(this.course.endDate).getTime() - new Date(this.course.startDate).getTime());
        this.duration = Math.ceil((timeDiff / (1000 * 3600 * 24)) / 30.4167);
    }

}
