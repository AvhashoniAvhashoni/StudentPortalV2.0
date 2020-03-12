import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { Course } from '../class/course';
import { User } from '../class/user';
import { StudentCourse } from '../class/studentCourse';
import { Notification } from '../class/notification';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.page.html',
    styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit, DoCheck {
    public loader: boolean = true;
    public courses: any;
    private user: User;
    public registeredCoures: any;
    public notificationColor: string = "#fff";
    public changeColor: boolean = false;
    public notification: any;
    constructor(private _router: Router, private _service: AppService) { }

    ngDoCheck() {
        if (this.changeColor) {
            if (this.notificationColor == "#600018")
                setTimeout(res => {
                    this.notificationColor = "#fff";
                }, (1000));
            else
                setTimeout(res => {
                    this.notificationColor = "#600018";
                }, (1000));
        }
    }

    ngOnInit() {
        this.user = this._service.getLocal("user");
        this.readCourses();
        this.enrolledCourse();
        this.notifications();
    }

    enrolledCourse() {
        this._service.readStudentCourse(this.user.id).subscribe(rez => {
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
                            let course: any = res;
                            course.id = sc.courseID;
                            this.registeredCoures = [];
                            this.registeredCoures.push(course);

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
            for (let c of this.courses) {
                this._service.getRatings(c.id).subscribe(res => {
                    let ratings = 0;
                    let rating: any = res;
                    if (rating.length > 0) {
                        for (let r of rating) {
                            ratings += r.rating;
                        }
                        ratings /= res.length
                    } else {
                        ratings = 0;
                    }
                    c.rating = Math.round(ratings);
                });
            }
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

    notifications() {
        let user: User = this._service.getLocal("user");
        this._service.readStudentCourse(user.id).subscribe(res => {
            if (res.length > 0) {
                let userCourse = res.map(uc => {
                    return {
                        id: uc.payload.doc.id,
                        ...uc.payload.doc.data()
                    } as StudentCourse;
                });
                for (let uc of userCourse) {
                    if (uc.dateRegistered && uc.status && !uc.courseComplete) {
                        this._service.readNotifications(uc.courseID).subscribe(res => {
                            if (res.length > 0) {
                                this.notification = res.map(n => {
                                    return {
                                        id: n.payload.doc.id,
                                        ...n.payload.doc.data()
                                    } as Notification;
                                });
                                for (let n of this.notification) {
                                    if (n.userIDs) {
                                        for (let uID of n.userIDs) {
                                            if (uID != user.id) {
                                                this.changeColor = true;
                                            }
                                        }
                                    } else {
                                        this.changeColor = true;
                                    }
                                }
                            }
                        }, err => {
                            console.log(err);
                        });
                        break;
                    }
                }
            }
        });
    }
}
