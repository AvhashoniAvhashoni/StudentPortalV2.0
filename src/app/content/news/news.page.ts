import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { User } from 'src/app/class/user';
import { StudentCourse } from 'src/app/class/studentCourse';

@Component({
    selector: 'app-news',
    templateUrl: './news.page.html',
    styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
    public user: User;
    public courseContent: Array<any> = [];
    public content: boolean = false;
    public loader: boolean = true;
    public isCourse: boolean = true;
    public isContent: boolean = true;
    public courseName: string = "";
    constructor(private _service: AppService, private _router: Router, private _toastController: ToastController, public alertController: AlertController) { }

    ngOnInit() {
        this.courseContents();
    }

    ionViewDidEnter() {
        setTimeout(() => {
            if (!this.isContent) {
                this._router.navigateByUrl("/landing").then(res => {
                    this.presentToast("You are not permitted to view the course content!");
                });
            }
        }, 1000);
    }

    courseContents() {
        this.courseContent = [];
        this.user = this._service.getLocal("user");
        this._service.readStudentCourse(this.user.id).subscribe(res => {
            if (res.length == 0) {
                this.isContent = false;
            } else {
                let userCourse = res.map(uc => {
                    return {
                        id: uc.payload.doc.id,
                        ...uc.payload.doc.data()
                    } as StudentCourse
                });
                for (let i = 0; i < userCourse.length; i++) {
                    if (userCourse[i].status && userCourse[i].dateRegistered && !userCourse[i].courseComplete) {
                        this._service.readCourse(userCourse[i].courseID).subscribe(courseRes => {
                            this.loader = false;
                            let course: any = courseRes;
                            this.isCourse = true;
                            this.courseName = course.name;
                            if (course.contents) {
                                this.content = true;
                                for (let c of course.contents) {
                                    if (c.format == "news") {
                                        this.courseContent.push(c);
                                        this.courseContent.sort((a, b) => (a.uploadDate < b.uploadDate) ? 1 : ((b.uploadDate < a.uploadDate) ? -1 : 0));
                                    }
                                }
                            } else {
                                this.presentAlert("No course content has been uploaded!");
                            }
                        }, err => {
                            this.loader = false;
                            console.log(err);
                        });
                    }
                }
            }
        }, err => {
            this.loader = false;
            console.log(err);
        });
    }

    async presentToast(message: string) {
        const toast = await this._toastController.create({
            message: message,
            duration: 3000,
            color: "tertiary"
        });
        toast.present();
    }

    async presentAlert(message: string) {
        const alert = await this.alertController.create({
            header: 'Alert',
            // subHeader: 'Subtitle',
            message: message,
            buttons: ['OK']
        });
        await alert.present();
    }
}
