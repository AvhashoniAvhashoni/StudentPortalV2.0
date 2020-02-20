import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Course } from '../class/course';
import { User } from '../class/user';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
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
  public newStudentCourse: boolean = false;
  constructor(private _service: AppService, private _router: Router, private _toastController: ToastController) { }

  ngOnInit() {
    this.user = this._service.getLocal("user");
    this.course = this._service.getSession("course");
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
              this.presentToast(`You've already applied for: ${this.course.name}!`);
              this.applyBtn = false;
              break;
            }
          }
        }
      }
    });
  }

  apply() {
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
}
