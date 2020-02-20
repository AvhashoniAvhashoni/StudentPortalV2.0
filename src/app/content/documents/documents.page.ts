import { Component, OnInit } from '@angular/core';
import { StudentCourse } from 'src/app/class/studentCourse';
import { AppService } from 'src/app/app.service';
import { User } from 'src/app/class/user';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Course } from 'src/app/class/course';

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
  public isCourse: boolean = true;
  public courseName: string = "";
  constructor(private _service: AppService, private _router: Router, private _toastController: ToastController) { }

  ngOnInit() {
    this.courseContents();
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
          this._service.readCourse(userCourse[i].courseID).subscribe(courseRes => {
            this.loader = false;
            this.content = true;
            let course: any = courseRes;
            this.isCourse = true;
            this.courseName = course.name;
            if (course.contents) {
              for (let c of course.contents) {
                if (c.format == "pdf") {
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

  download(file) {
    window.open(file);
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
