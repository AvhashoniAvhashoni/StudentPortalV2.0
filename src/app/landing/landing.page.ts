import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { Course } from '../class/course';
import { User } from '../class/user';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.page.html',
    styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
    public loader: boolean = true;
    public courses: any;
    private user: User;
    public registeredCoures: any;
    constructor(private _router: Router, private _service: AppService) { }

    ngOnInit() {
        this.user = this._service.getLocal("user");
        this.readCourses();
        this.enrolledCourse();
    }

    enrolledCourse() {
        this._service.readStudentCourse(this.user.id).subscribe(rez => {
            this.registeredCoures = [];
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
                            this.registeredCoures.push(res);
                        }, err => {
                            console.log(err);
                        });
                }
            }
        });
    }

    public readCourses(): void {
        this.loader = true;
        this._service.readCourses().subscribe(res => {
            this.courses = res.map(c => {
                return {
                    id: c.payload.doc.id,
                    ...c.payload.doc.data()
                } as Course
            });
            this.loader = false;
        }, err => {
            console.log(err);
            this.loader = false;
        });
    }

    scroll() {
        document.getElementById("top").scrollIntoView({ behavior: "smooth" });
    }

    viewCourse(course) {
        this._service.setSession("course", course);
        this._router.navigateByUrl("/course");
    }

    info(course: Course) {
        this._service.setSession("enrolledCourseInfo", course);
        this._router.navigateByUrl("/enrolledcoursesinfo");
    }
}
