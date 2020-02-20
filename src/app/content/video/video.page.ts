import { Component, OnInit } from '@angular/core';
import { StudentCourse } from 'src/app/class/studentCourse';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { User } from 'src/app/class/user';

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
})
export class VideoPage implements OnInit {
  public user: User;
  public courseContent: Array<any> = [];
  public content: boolean = false;
  public isCourse: boolean = false;
  public loader: boolean = true;
  public courseName: string = "";
  constructor(private _toastController: ToastController, private _router: Router, private _service: AppService) { }

  ngOnInit() {
    this.courseContents();
  }

  async presentToast(message: string) {
    const toast = await this._toastController.create({
      message: message,
      duration: 3000,
      color: "tertiary"
    });
    toast.present();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      if (!this.isCourse) {
        this._router.navigateByUrl("/landing").then(res => {
          this.presentToast("You are not permitted to view the course content!");
        });
      }
    }, 1000);
  }

  courseContents() {
    this.courseContent = [];
    this.user = JSON.parse(localStorage.getItem("user"));
    this._service.readStudentCourse(this.user.id).subscribe(res => {
      let userCourse = res.map(uc => {
        return {
          id: uc.payload.doc.id,
          ...uc.payload.doc.data()
        } as StudentCourse
      });
      for (let i = 0; i < userCourse.length; i++) {
        if (userCourse[i].status && userCourse[i].dateRegistered && !userCourse[i].courseComplete) {
          this.isCourse = true;
          this._service.readCourse(userCourse[i].courseID).subscribe(courseRes => {
            this.loader = false;
            setTimeout(() => {
              this.content = true;
            }, 2000);
            let course: any = courseRes;
            this.courseName = course.name;
            if (course.contents) {
              for (let c of course.contents) {
                if (c.format == "video") {
                  this.courseContent.push(c);
                  this.courseContent.sort((a, b) => (a.uploadDate < b.uploadDate) ? 1 : ((b.uploadDate < a.uploadDate) ? -1 : 0));
                }
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
}
