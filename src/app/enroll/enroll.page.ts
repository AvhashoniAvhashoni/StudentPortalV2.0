import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { User } from '../class/user';
import { Course } from '../class/course';
import { StudentCourse } from '../class/studentCourse';

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.page.html',
  styleUrls: ['./enroll.page.scss'],
})
export class EnrollPage implements OnInit {
  public user: User;
  public idUrl: string = null;
  public cvUrl: string = null;
  public resultsUrl: string = null;
  public proofOfPayUrl: string = null;
  private course: Course = null;
  constructor(private _service: AppService, private _router: Router, private _loadingController: LoadingController, private _toastController: ToastController) { }

  ngOnInit() {
    this.user = this._service.getLocal("user");
    this.course = this._service.getSession("course");
  }

  uploadID(event) {
    let id = <File>event.target.files[0];
    this.presentLoadingWithOptions();
    this._service.upload("idCard/", this.user.id, id).then(res => {
      res.ref.getDownloadURL().then(url => {
        this.idUrl = url;
        this._loadingController.dismiss().then(res => {
          this.presentToast("ID document uploaded successfuly!");
        });
      });
    });
  }

  uploadProofOfRes(event) {
    let por = <File>event.target.files[0];
    this.presentLoadingWithOptions();
    this._service.upload("cv/", this.user.id, por).then(res => {
      res.ref.getDownloadURL().then(url => {
        this.cvUrl = url;
        this._loadingController.dismiss().then(res => {
        });
      });
    });
  }

  uploadResults(event) {
    let results = <File>event.target.files[0];
    this.presentLoadingWithOptions();
    this._service.upload("results/", this.user.id, results).then(res => {
      res.ref.getDownloadURL().then(url => {
        this.resultsUrl = url;
        this._loadingController.dismiss().then(res => {
        });
      });
    });
  }

  uploadProofOfPay(event) {
    let pop = <File>event.target.files[0];
    this.presentLoadingWithOptions();
    this._service.upload("proofOfPay/", this.user.id + "/" + new Date().toString(), pop).then(res => {
      res.ref.getDownloadURL().then(url => {
        this.proofOfPayUrl = url;
        this._loadingController.dismiss().then(res => {
        });
      });
    });
  }

  submit() {
    if (this.idUrl && this.cvUrl && this.resultsUrl) {
      this.user.idUrl = this.idUrl;
      this.user.resultsUrl = this.resultsUrl;
      this.user.cvUrl = this.cvUrl;
      if (!this.user.proofOfPayUrl) {
        this.user.proofOfPayUrl = {};
      }
      this.user.proofOfPayUrl.enroll = this.proofOfPayUrl;
      this._service.updateUser(this.user).then(res => {
        this._service.setLocal("user", this.user)
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
      }).catch(err => {
        console.log(err);
      });
    } else {
      this.presentToast("Please upload missing document(s)!");
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

  async presentLoadingWithOptions() {
    const loading = await this._loadingController.create({
      spinner: "circles",
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }
}
