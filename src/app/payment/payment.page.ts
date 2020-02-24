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
    public courseCode: any = null;
    constructor(private _service: AppService, private _router: Router, private _loadingController: LoadingController, private _toastController: ToastController) { }

    ngOnInit() {
        this.user = this._service.getLocal("user");
        this.courseCode = this._service.getLocal("enrollCourse").id;
        if (this.user.proofOfPayUrl.registration) {
            for (let registration of this.user.proofOfPayUrl.registration) {
                if (registration.courseCode == this.courseCode) {
                    this._router.navigateByUrl("/registration");
                }
            }
        }
    }

    uploadProofOfPay(event) {
        let pop = <File> event.target.files[0];
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
            if (!this.user.proofOfPayUrl.registration) {
                this.user.proofOfPayUrl.registration = [];
            }

            let proofOfPay = {
                url: this.proofOfPayUrl,
                courseCode: this.courseCode
            }
            this.user.proofOfPayUrl.registration.push(proofOfPay);
            this._service.setLocal("user", this.user);
            this._service.updateUser(this.user).then(res => {
                this._router.navigateByUrl("/registration");
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
