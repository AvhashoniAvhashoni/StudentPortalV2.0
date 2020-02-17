import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { Course } from '../class/course';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  public loader: boolean = false;
  public courses: any;
  constructor(private _router: Router, private _service: AppService) { }

  ngOnInit() {
    this.readCourses();
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
      setTimeout(() => {
        this.loader = false  
      }, 1000);      
    }, err => {
      console.log(err);
      this.loader = false
    });
  }

  scroll() {
    document.getElementById("top").scrollIntoView({ behavior: "smooth" })
  }

  viewCourse(course) {
    this._service.setSession("course", course);
    this._router.navigateByUrl("/course");
  }
}
