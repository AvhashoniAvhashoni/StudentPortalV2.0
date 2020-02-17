import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { User } from '../class/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  spinner: boolean = false;
  constructor(private _service: AppService, private _router: Router, private _toastController: ToastController) { }

  ngOnInit() { }

  user = new FormGroup({
    name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[A-Za-z]+")])),
    surname: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[A-Za-z]+")])),
    email: new FormControl('', Validators.compose([Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")])),
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z0-9\d$@$!%*?&].{5,}")])),
  });

  validation_messages = {
    'name': [
      { type: 'required', message: 'Name is required!' },
      { type: 'pattern', message: 'Name should contain letters only!' },
      { type: 'minlength', message: 'Name should contain atleast 3 letters!' },
    ],
    'surname': [
      { type: 'required', message: 'Surname is required!' },
      { type: 'pattern', message: 'Surname should contain letters only!' },
      { type: 'minlength', message: 'Surname should contain atleast 3 letters!' },
    ],
    'email': [
      { type: 'required', message: 'Email is required!' },
      { type: 'pattern', message: 'Invalid Email!' },
    ],
    'password': [
      { type: 'required', message: 'Password is required!' },
      { type: 'minlength', message: 'Password should contain atleast 6 characters!' },
      { type: 'pattern', message: 'Password should contain characters, numbers, lowercase and uppercase letters!' },
    ],
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

  public register(): void {
    this.validateAllFormFields(this.user);
    if (this.user.valid) {
      this.spinner = true;
      this._service.signupEmail(this.user.value.email, this.user.value.password).then(res => {
        let user: User = {
          firstName: this.user.value.name,
          lastName: this.user.value.surname,
          email: this.user.value.email,
          id: res.user.uid
        }
        this._service.createUser(user).then(resp => {
          this.spinner = false;
          this.presentToast("Account successfuly created please log in!");
          this._router.navigateByUrl("/signin");
          this.user.reset();
        }, err => {
          this.presentToast(err.message);
          this.spinner = false;
        });
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
