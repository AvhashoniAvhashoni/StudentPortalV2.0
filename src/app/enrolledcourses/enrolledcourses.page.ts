import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { User } from '../class/user';
import { Course } from '../class/course';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enrolledcourses',
  templateUrl: './enrolledcourses.page.html',
  styleUrls: ['./enrolledcourses.page.scss'],
})
export class EnrolledcoursesPage implements OnInit {
  public registeredCoures: Array<Object>;
  public acceptedCourse: Array<Object>;
  public completedCourse: Array<Object>;
  public unacceptedCourse: Array<Object>;
  public isAcceptedCourse: boolean = false;
  public isCompletedCourse: boolean = false;
  public isRegisteredCoures: boolean = false;
  public isUnacceptedCourse: boolean = false;
  public user: User;
  public loader: boolean = true;

  constructor(private _service: AppService, private _router: Router) { }

  ngOnInit() {
    this.user = this._service.getLocal("user");
    this.courseList();
  }

  courseList() {
    this._service.readStudentCourse(this.user.id).subscribe(rez => {
      this.registeredCoures = [];
      this.acceptedCourse = [];
      this.unacceptedCourse = [];
      this.completedCourse = [];
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
              this.loader = false;
              this.registeredCoures.push(res);
              this.isRegisteredCoures = true;
            }, err => {
              console.log(err);
            });
          if (sc.status && !sc.dateRegistered && !sc.courseComplete)
            this._service.readCourse(sc.courseID).subscribe(res => {
              this.loader = false;
              this.acceptedCourse.push(res);
              this.isAcceptedCourse = true;
            }, err => {
              console.log(err);
            });
          if (!sc.status && !sc.dateRegistered && !sc.courseComplete)
            this._service.readCourse(sc.courseID).subscribe(res => {
              this.loader = false;
              this.unacceptedCourse.push(res);
              this.isUnacceptedCourse = true;
            }, err => {
              console.log(err);
            });
          if (sc.courseComplete)
            this._service.readCourse(sc.courseID).subscribe(res => {
              this.loader = false;
              this.completedCourse.push(res);
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
    this._router.navigateByUrl("/enrolledcoursesinfo");
  }
}
