import { Component, OnInit, DoCheck } from '@angular/core';
import { User } from '../class/user';
import { AppService } from '../app.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ModalController, AlertController } from '@ionic/angular';

import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EditPage } from './edit/edit.page';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, DoCheck {
    public user: User;
    public gaurd: boolean = false;
    public addr: boolean = false;
    constructor(private _service: AppService, private _loadingController: LoadingController, private _toastController: ToastController, private _sanitizer: DomSanitizer, private _modalController: ModalController, private _alertController: AlertController) { }

    ngOnInit() {
        this.user = this._service.getLocal("user");
    }

    ngDoCheck() {
        this.user = this._service.getLocal("user");
    }

    open(item) {
        if (item == "gaurd")
            this.gaurd = !this.gaurd;

        if (item == "addr")
            this.addr = !this.addr;
    }

    public async takePicture() {
        const image = await Plugins.Camera.getPhoto({
            quality: 100,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Prompt
        });
        const photo = this._sanitizer.bypassSecurityTrustResourceUrl(image && (image.base64String));
        const arr = image.dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        this.presentLoadingWithOptions();
        this._service.upload("proofilePicture/", this.user.id, new File([u8arr], "hi.jpeg", { type: "jpeg" })).then(res => {
            res.ref.getDownloadURL().then(url => {
                this.user.profilePicUrl = url;
                this._service.setLocal("user", this.user);
                this._service.updateUser(this.user).then(res => {
                    this._loadingController.dismiss().then(res => {
                        this.presentToast("Profile picture uploaded successfuly!");
                    });
                });
            });
        });
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

    async presentToast(message: string) {
        const toast = await this._toastController.create({
            message: message,
            duration: 3000,
            color: "tertiary"
        });
        toast.present();
    }

    async editProfile() {
        const modal = await this._modalController.create({
            component: EditPage
        });
        return await modal.present();
    }

    showAddress(addressLn1: string, address: any) {
        let addr = addressLn1;
        for (let a of address) {
            addr += " " + a;
        }
        this.presentAlertConfirm("Address", addr);
    }

    async presentAlertConfirm(header: string, message: string) {
        const alert = await this._alertController.create({
            header: header,
            message: message,
            cssClass: "alt",
            buttons: [
                {
                    cssClass: "altBtn",
                    text: 'Close',
                }
            ]
        });

        await alert.present();
    }
}
