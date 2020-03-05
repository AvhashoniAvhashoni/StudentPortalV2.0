import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/class/course';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'app-rating',
    templateUrl: './rating.page.html',
    styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {
    public course: Course = null;
    constructor(private _service: AppService) { }

    ngOnInit() {
        this.course = this._service.getSession("enrolledCourseInfo");
    }

}
