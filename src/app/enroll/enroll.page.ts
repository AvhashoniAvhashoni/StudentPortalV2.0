import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { User } from '../class/user';

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
  constructor(private _service: AppService, private _router: Router, private _loadingController: LoadingController, private _toastController: ToastController) { }

  ngOnInit() {
    this.user = this._service.getLocal("user");
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
          this.presentToast("Proof of residence uploaded successfuly!");
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
          this.presentToast("Results uploaded successfuly!");
        });
      });
    });
  }

  submit() {
    if (this.idUrl && this.cvUrl && this.resultsUrl) {
      this.user.idUrl = this.idUrl;
      this.user.resultsUrl = this.resultsUrl;
      this.user.cvUrl = this.cvUrl;
      this._service.updateUser(this.user).then(res => {
        this._router.navigateByUrl("/payment");
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
