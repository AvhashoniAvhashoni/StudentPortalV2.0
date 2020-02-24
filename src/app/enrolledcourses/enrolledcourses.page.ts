import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { User } from '../class/user';
import { Course } from '../class/course';
import { Router } from '@angular/router';

@Component({
    selector: 'app-enrolledcourses',
    templateUrl: './enrolledcourses.page.html',
    styleUrls: ['./enrolledcourses.page.scss'],
})
export class EnrolledcoursesPage implements OnInit {
    public registeredcourse: Array<Object>;
    public acceptedCourse: Array<Object>;
    public completedCourse: Array<Object>;
    public unacceptedCourse: Array<Object>;
    public isAcceptedCourse: boolean = false;
    public isCompletedCourse: boolean = false;
    public isRegisteredcourse: boolean = false;
    public isUnacceptedCourse: boolean = false;
    public user: User;
    public loader: boolean = true;

    constructor(private _service: AppService, private _router: Router) { }

    ngOnInit() {
        this.user = this._service.getLocal("user");
        this.courseList();
    }

    ionViewDidEnter() {
        setTimeout(res => {
            if (!this.isAcceptedCourse && !this.isCompletedCourse && !this.isRegisteredcourse && !this.isUnacceptedCourse) {
                this._router.navigateByUrl("/landing");
            }
        }, (1000));
    }

    courseList() {
        this._service.readStudentCourse(this.user.id).subscribe(rez => {
            this.registeredcourse = [];
            this.acceptedCourse = [];
            this.unacceptedCourse = [];
            this.completedCourse = [];
            this.isAcceptedCourse = false;
            this.isCompletedCourse = false;
            this.isRegisteredcourse = false;
            this.isUnacceptedCourse = false;
            if (rez.length > 0) {
                let studentCourse: any = rez.map(sc => {
                    return {
                        id: sc.payload.doc.id,
                        ...sc.payload.doc.data()
                    }
                });
                for (let sc of studentCourse) {
                    if (sc.status && sc.dateRegistered && !sc.courseComplete)
                        this._service.readCourse(sc.courseID).subscribe(res => {
                            this.loader = false;
                            let course: any = res;
                            course.id = sc.courseID;
                            this.registeredcourse.push(course);
                            this.isRegisteredcourse = true;
                        }, err => {
                            console.log(err);
                        });
                    if (sc.status && !sc.dateRegistered && !sc.courseComplete)
                        this._service.readCourse(sc.courseID).subscribe(res => {
                            this.loader = false;
                            let course: any = res;
                            course.id = sc.courseID;
                            this.acceptedCourse.push(course);
                            this.isAcceptedCourse = true;
                        }, err => {
                            console.log(err);
                        });
                    if (!sc.status && !sc.dateRegistered && !sc.courseComplete)
                        this._service.readCourse(sc.courseID).subscribe(res => {
                            this.loader = false;
                            let course: any = res;
                            course.id = sc.courseID;
                            this.unacceptedCourse.push(course);
                            this.isUnacceptedCourse = true;
                        }, err => {
                            console.log(err);
                        });
                    if (sc.courseComplete)
                        this._service.readCourse(sc.courseID).subscribe(res => {
                            this.loader = false;
                            let course: any = res;
                            course.id = sc.courseID;
                            this.completedCourse.push(course);
                            this.isCompletedCourse = true;
                        }, err => {
                            console.log(err);
                        });
                }
            }
        }, err => {
            this.loader = false;
            console.log(err);
        });
    }

    info(course: Course) {
        this._router.navigateByUrl("/enrolledcoursesinfo");
    }

    register(course: Course) {
        this._service.setLocal("enrollCourse", course);
        this._router.navigateByUrl("/payment");
    }
}
