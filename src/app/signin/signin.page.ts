import { Component, OnInit, DoCheck } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { ToastController, MenuController } from '@ionic/angular';
import { User } from '../class/user';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit, DoCheck {
  error: string = "";
  spinner: boolean = false;
  constructor(private _service: AppService, private _router: Router, private _toastController: ToastController, private _menuCtr: MenuController) { }

  ngDoCheck() {
    if (this.user.get("email").touched && !this.user.get("email").value && this.user.get("password").touched && !this.user.get("password").value) {
      this.error = "Email address and password are required!";
    } else if (this.user.get("email").touched && !this.user.get("email").value) {
      this.error = "Email address is required!";
    } else if (this.user.get("email").touched && this.user.get("email").invalid) {
      this.error = "Invalid email address!";
    } else if (this.user.get("password").touched && !this.user.get("password").value) {
      this.error = "Password is required!";
    } else if (this.user.get("password").touched && this.user.get("password").invalid) {
      this.error = "Password requires more than 6 charecters!";
    } else {
      this.error = "";
    }
  }

  ngOnInit() { }

  user = new FormGroup({
    email: new FormControl(null, Validators.compose([Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")])),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
  });

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  public signin(): void {
    this.validateAllFormFields(this.user);
    if (this.user.valid) {
      this.spinner = true;
      this._service.signInEmail(this.user.value.email, this.user.value.password).then(res => {
        let uid = res.user.uid;
        this._service.readUser(uid).subscribe(res => {
          this.spinner = false;
          let user: any = res;
          user.id = uid;
          this._service.setLocal("user", user);
          this._router.navigateByUrl("/landing").then(res => {
            this._menuCtr.enable(true);
            this.user.reset();
          });
        }, err => {
          this.spinner = false;
          this.presentToast(err.message);
        });
      }).catch(err => {
        this.spinner = false;
        this.presentToast(err.message);
      });
    }
  }

  async presentToast(message: string) {
    const toast = await this._toastController.create({
      message: message,
      duration: 5000,
      color: "tertiary"
    });
    toast.present();
  }
}
