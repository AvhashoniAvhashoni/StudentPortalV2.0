import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { ToastController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  spinner: boolean = false;
  constructor(private _service: AppService, private _router: Router, private _toastController: ToastController) { }

  ngOnInit() { }

  user = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")])),
  });

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required!' },
      { type: 'pattern', message: 'Invalid Email!' },
    ]
  };

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

  public resetPassword(): void {
    this.validateAllFormFields(this.user);
    if (this.user.valid) {
      this.spinner = true;
      this._service.resetPassword(this.user.get("email").value).then(res => {
        this.presentToast("Email sent with instuction on how to reset you password!");
        this._router.navigateByUrl("/signin");
        this.user.reset();
        this.spinner = false;
      }, err => {
        this.presentToast(err.message);
        this.spinner = false;
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
