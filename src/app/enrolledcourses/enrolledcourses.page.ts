import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { User } from '../class/user';
import { Course } from '../class/course';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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
    public studentCourse: boolean = false;
    public user: User;
    public loader: boolean = true;

    constructor(private _service: AppService, private _router: Router, private _toastController: ToastController) { }

    ngOnInit() {
        this.user = this._service.getLocal("user");
        this.courseList();
    }

    ionViewDidEnter() {
        setTimeout(res => {
            if (!this.isAcceptedCourse && !this.isCompletedCourse && !this.isRegisteredcourse && !this.isUnacceptedCourse) {
                this.presentToast("You have not enrolled for any course yet!");
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
                this.studentCourse = true;
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
                            this._service.getRatings(course.id).subscribe(res => {
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
                                course.rating = Math.round(ratings);
                            });
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
                            this._service.getRatings(course.id).subscribe(res => {
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
                                course.rating = Math.round(ratings);
                            });
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
                            this._service.getRatings(course.id).subscribe(res => {
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
                                course.rating = Math.round(ratings);
                            });
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
                            this._service.getRatings(course.id).subscribe(res => {
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
                                course.rating = Math.round(ratings);
                            });
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
        this._service.setSession("enrolledCourseInfo", course);
        this._router.navigateByUrl("/enrolledcoursesinfo");
    }

    register(course: Course) {
        this._service.setLocal("enrollCourse", course);
        this._router.navigateByUrl("/payment");
    }

    async presentToast(message: string) {
        const toast = await this._toastController.create({
            message: message,
            duration: 3000,
            color: "tertiary"
        });
        toast.present();
    }
}
