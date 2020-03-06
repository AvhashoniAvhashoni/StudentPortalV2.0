import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Course } from '../class/course';
import { User } from '../class/user';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { StudentCourse } from '../class/studentCourse';

@Component({
    selector: 'app-course',
    templateUrl: './course.page.html',
    styleUrls: ['./course.page.scss'],
})
export class CoursePage implements OnInit {
    public course: Course;
    public user: User;
    public applyBtn: boolean = true;
    public pending: boolean = false;
    public registered: boolean = false;
    public newStudentCourse: boolean = false;
    public totalEnrolled: number = 0;
    public duration: number = 0;
    public rating: number = 0;
    constructor(private _service: AppService, private _router: Router, private _toastController: ToastController, public _alertController: AlertController) { }

    ngOnInit() {
        this.user = this._service.getLocal("user");
        this.course = this._service.getSession("course");
        this._service.getRatings(this.course.id).subscribe(res => {
            this.rating = 0;
            let rating: any = res;
            if (rating.length > 0) {
                for (let r of rating) {
                    this.rating += r.rating;
                }
                setTimeout(() => {
                    this.rating /= res.length;
                }, (1));
            }
        });
        if (new Date() >= new Date(this.course.closingDate)) {
            this.applyBtn = false;
        }

        var timeDiff = Math.abs(new Date(this.course.endDate).getTime() - new Date(this.course.startDate).getTime());
        this.duration = Math.ceil((timeDiff / (1000 * 3600 * 24)) / 30.4167);

        this.readStudentCourse(this.course.id);
        this._service.readStudentCourse(this.user.id).subscribe(res => {
            if (res.length > 0) {
                let studentCourse: any = res.map(sc => {
                    return {
                        id: sc.payload.doc.id,
                        ...sc.payload.doc.data()
                    } as StudentCourse
                });
                if (!this.newStudentCourse) {
                    for (let sc of studentCourse) {
                        if (sc.courseID == this.course.id) {
                            // this.presentToast(`You've already applied for: ${this.course.name}!`);
                            this.applyBtn = false;
                            if (sc.dateRegistered)
                                this.registered = true
                            else
                                this.pending = true;
                            break;
                        }
                    }
                }
            }
        });
    }

    public readStudentCourse(cid: string) {
        this._service.readStudentCourse2(cid).subscribe(res => {
            let studentCourse = res.map(sc => {
                return {
                    id: sc.payload.doc.id
                }
            });
            this.totalEnrolled = studentCourse.length;
        });
    }

    public apply() {
        this.newStudentCourse = true;
        if (this.user.idUrl && this.user.cvUrl && this.user.resultsUrl && this.user.proofOfPayUrl) {
            this._router.navigateByUrl("/enrolledcourses");
            let enroll: StudentCourse = {
                userID: this.user.id,
                courseID: this.course.id,
                courseComplete: false,
                status: false,
                dateEnrolled: new Date()
            }
            this._service.postStudentCourse(enroll).then(res => {
                this._router.navigateByUrl("/enrolledcourses");
                this.presentToast(`You've successfully enrolled for: ${this.course.name}!`);
            }).catch(err => {
                console.log(err);
            });
        } else {
            this._router.navigateByUrl("/enroll");
        }
    }

    async presentToast(message: string) {
        const toast = await this._toastController.create({
            message: message,
            duration: 3000,
            color: "tertiary"
        });
        toast.present();
    }

    async presentAlertConfirm() {
        const alert = await this._alertController.create({
            header: this.course.name,
            message: this.course.description,
            cssClass: "alt",
            buttons: [
                {
                    cssClass: "altBtn",
                    text: 'Close',
                }
            ]
        });

        await alert.present();
    }

}
