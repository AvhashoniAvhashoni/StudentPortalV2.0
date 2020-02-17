import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { User } from '../class/user';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  public user: User;
  public proofOfPayUrl: string = null;
  constructor(private _service: AppService, private _router: Router, private _loadingController: LoadingController, private _toastController: ToastController) { }

  ngOnInit() {
    this.user = this._service.getLocal("user");
  }

  uploadProofOfPay(event) {
    let pop = <File>event.target.files[0];
    this.presentLoadingWithOptions();
    this._service.upload("proofOfPay/", this.user.id + "/" + new Date().toString(), pop).then(res => {
      res.ref.getDownloadURL().then(url => {
        this.proofOfPayUrl = url;
        this._loadingController.dismiss().then(res => {
          this.presentToast("Proof of payment uploaded successfuly!");
        });
      });
    });
  }

  submit() {
    if (this.proofOfPayUrl) {
      if (this.user.proofOfPayUrl) {
        this.user.proofOfPayUrl.splice(this.user.proofOfPayUrl.length, 0, this.proofOfPayUrl);
      } else {
        this.user.proofOfPayUrl = [];
        this.user.proofOfPayUrl.push(this.proofOfPayUrl);
      }
      this._service.updateUser(this.user).then(res => {
        this._router.navigateByUrl("/finance");
      }).catch(err => {
        console.log(err);
      });
    } else {
      this.presentToast("Please upload your proof of payment!");
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
