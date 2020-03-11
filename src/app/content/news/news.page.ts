import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import { User } from 'src/app/class/user';
import { StudentCourse } from 'src/app/class/studentCourse';
import { NewsdetailsPage } from './newsdetails/newsdetails.page';

@Component({
    selector: 'app-news',
    templateUrl: './news.page.html',
    styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
    public courseContent: Array<any> = [];
    public content: boolean = false;
    public loader: boolean = true;
    public courseName: string = null;
    public courseImage: string = null;
    constructor(private _service: AppService, private _router: Router, private _toastController: ToastController, public alertController: AlertController, private _modalController: ModalController) { }

    ngOnInit() {
        this.courseContents();
    }

    ionViewDidEnter() {
        setTimeout(() => {
            if (!this.courseName) {
                this._router.navigateByUrl("/landing").then(res => {
                    this.presentToast("You are not permitted to view the course content!");
                });
            }
        }, 2000);
    }

    courseContents() {
        let user: User = this._service.getLocal("user");
        this._service.readStudentCourse(user.id).subscribe(res => {
            if (res.length > 0) {
                let userCourse = res.map(uc => {
                    return {
                        id: uc.payload.doc.id,
                        ...uc.payload.doc.data()
                    } as StudentCourse;
                });
                for (let i = 0; i < userCourse.length; i++) {
                    if (userCourse[i].dateRegistered && userCourse[i].status && !userCourse[i].courseComplete) {
                        this._service.readCourse(userCourse[i].courseID).subscribe(courseRes => {
                            this.courseContent = [];
                            this.loader = false;
                            let course: any = courseRes;
                            this.courseName = course.name;
                            this.courseImage = course.coverUrl;
                            if (course.news) {
                                this.content = true;
                                for (let c of course.news) {
                                    this.courseContent.push(c);
                                    this.courseContent.sort((a, b) => (a.uploadDate < b.uploadDate) ? 1 : ((b.uploadDate < a.uploadDate) ? -1 : 0));
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

    async viewNews(news: any) {
        this._service.setSession("news", news);
        sessionStorage.setItem("courseName", this.courseName);
        sessionStorage.setItem("courseImage", this.courseImage);
        const modal = await this._modalController.create({
            component: NewsdetailsPage
        });
        return await modal.present();
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
            message: message,
            buttons: ['OK']
        });
        await alert.present();
    }
}
