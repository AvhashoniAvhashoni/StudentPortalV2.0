import { Component, OnInit } from '@angular/core';
import { StudentCourse } from 'src/app/class/studentCourse';
import { AppService } from 'src/app/app.service';
import { User } from 'src/app/class/user';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { Course } from 'src/app/class/course';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx';

@Component({
    selector: 'app-documents',
    templateUrl: './documents.page.html',
    styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage implements OnInit {
    public user: User;
    public courseContent: Array<any> = [];
    public content: boolean = false;
    public loader: boolean = true;
    public courseName: string = "";
    constructor(private _service: AppService, private _router: Router, private _toastController: ToastController, public alertController: AlertController, private downloader: Downloader) { }

    ngOnInit() {
        this.courseContents();
    }

    courseContents() {
        this.courseContent = [];
        this.user = this._service.getLocal("user");
        this._service.readStudentCourse(this.user.id).subscribe(res => {
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
                        this.content = true;
                        let course: any = courseRes;
                        this.courseName = course.name;
                        if (course.contents) {
                            for (let c of course.contents) {
                                if (c.format == "pdf") {
                                    this.courseContent.push(c);
                                    this.courseContent.sort((a, b) => (a.uploadDate < b.uploadDate) ? 1 : ((b.uploadDate < a.uploadDate) ? -1 : 0));
                                }
                            }
                            if (this.courseContent.length == 0) {
                                this.presentAlert("No course content has been uploaded!");
                            }
                        }
                    }, err => {
                        this.loader = false;
                        console.log(err);
                    });
                }
            }
        }, err => {
            this.loader = false;
            console.log(err);
        });
    }

    download(file, title) {
        // window.open(file);
        var request: DownloadRequest = {
            uri: file,
            title: title,
            description: '',
            mimeType: 'application/pdf',
            visibleInDownloadsUi: true,
            notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
            destinationInExternalFilesDir: {
                dirType: 'Downloads',
                subPath: 'MyFile.pdf'
            }
        };


        this.downloader.download(request).then((location: string) => {
            console.log('File downloaded at:' + location)
            this.presentToast("Download...");
        }).catch((error: any) =>{
			console.log(error);
            this.presentAlert("Error dounloading document!");
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
            message: message,
            buttons: ['OK']
        });
        await alert.present();
    }
}
