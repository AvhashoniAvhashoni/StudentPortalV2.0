import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/class/user';
import { AppService, Feature } from 'src/app/app.service';
import { Router } from '@angular/router';
import { StudentCourse } from 'src/app/class/studentCourse';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.page.html',
    styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
    tab: number = 1;
    validations_form: FormGroup;
    errorMessage: string = null;
    successMessage: string = null;
    formBuilder: any;
    registering: FormGroup
    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    currentUser: User;
    userCourse: StudentCourse;
    course: any;

    constructor(public _modalController: ModalController, private _service: AppService, private _router: Router, private _toastController: ToastController) {
        this.currentUser = JSON.parse(localStorage.getItem("user"));
    }

    ngOnInit() {
        this.user.controls["name"].setValue(this.currentUser.firstName);
        this.user.controls["surname"].setValue(this.currentUser.lastName);
        this.user.controls["cell"].setValue(this.currentUser.cellNumber);
        if (this.currentUser.guardian) {
            this.user.controls["gName"].setValue(this.currentUser.guardian.firstName);
            this.user.controls["gSurname"].setValue(this.currentUser.guardian.lastName);
            this.user.controls["gCell"].setValue(this.currentUser.guardian.cellNr);
        }
        this.address = this.currentUser.address;
        this.user.controls["addressLn1"].setValue(this.currentUser.addressLn1);
    }

    user = new FormGroup({
        name: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[A-Za-z]+")])),
        surname: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[A-Za-z]+")])),
        cell: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^(\\0|0)[6-8][0-9]{8}$")])),
        gName: new FormControl(null, Validators.compose([Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[A-Za-z]+")])),
        gSurname: new FormControl(null, Validators.compose([Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[A-Za-z]+")])),
        gCell: new FormControl(null, Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^(\\0|0)[6-8][0-9]{8}$")])),
        addressLn1: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern("[a-zA-Z0-9- ]+")])),

    })
    validation_messages = {
        'name': [
            { type: 'required', message: 'Name is required!' },
            { type: 'pattern', message: 'Name should contain letters only!' },
        ],
        'surname': [
            { type: 'required', message: 'Surname is required!' },
            { type: 'pattern', message: 'Surname should contain letters only!' },
        ],
        'cell': [
            { type: 'required', message: 'Cell number is required!' },
            { type: 'pattern', message: 'Invalid cell number!' },
        ],
        'addressLn1': [
            { type: 'required', message: 'Street address is required!' },
            { type: 'pattern', message: 'No charactes allowed!' },
        ],
        'gName': [
            { type: 'required', message: 'Name is required!' },
            { type: 'pattern', message: 'Name should contain letters only!' },
        ],
        'gSurname': [
            { type: 'required', message: 'Surname is required!' },
            { type: 'pattern', message: 'Name should contain letters only!' },
        ],
        'gCell': [
            { type: 'required', message: 'Cell number is required!' },
            { type: 'pattern', message: 'Invalid cell number!' },
        ],
    };

    addresses: string[] = [];
    selectedAddress = null;

    search(event: any) {
        const searchTerm = event.target.value.toLowerCase();
        if (searchTerm && searchTerm.length > 0) {
            this._service.searchQuery(searchTerm).subscribe((features: Feature[]) => {
                this.addresses = features.map(feat => feat.place_name);
            });
        } else {
            this.addresses = [];
        }
    }

    address: string[] = [];
    onSelect(address: string) {
        this.address = [];
        this.selectedAddress = address;
        this.addresses = [];
        let selectedAddress: string = this.selectedAddress;
        while (selectedAddress.indexOf(',') > 0) {
            this.address.push(selectedAddress.substr(0, selectedAddress.indexOf(',')));
            selectedAddress = selectedAddress.slice(selectedAddress.indexOf(',') + 2, selectedAddress.length);
        }
        this.address.push(selectedAddress);
        this.editAddress();
    }

    update() {
        let update: boolean = false;
        if (this.user.value.name) {
            this.currentUser.firstName = this.user.value.name;
        }
        if (this.user.value.surname) {
            this.currentUser.lastName = this.user.value.surname;
        }
        if (this.user.value.cell) {
            this.currentUser.cellNumber = this.user.value.cell;
        }
        if (this.user.value.addressLn1) {
            this.currentUser.addressLn1 = this.user.value.addressLn1;
        }
        if (this.currentUser.guardian) {
            if (this.user.value.gName) {
                this.currentUser.guardian.firstName = this.user.value.gName;
            }
            if (this.user.value.gSurname) {
                this.currentUser.guardian.lastName = this.user.value.gSurname;
            }
            if (this.user.value.gCell) {
                this.currentUser.guardian.cellNr = this.user.value.gCell;
            }
        }

        if (this.currentUser.firstName && this.currentUser.lastName && this.currentUser.cellNumber && this.currentUser.idNumber &&
            this.currentUser.dob && this.user.get("name").valid && this.user.get("surname").valid && this.user.get("cell").valid &&
            this.currentUser.addressLn1, this.user.get("addressLn1").valid, this.address.length > 0) {
            if (this.currentUser.guardian) {
                if (this.currentUser.guardian.firstName && this.currentUser.guardian.lastName && this.currentUser.guardian.cellNr) {
                    this.currentUser.address = this.address;
                    update = true;
                }
            } else {
                this.currentUser.address = this.address;
                update = true;
            }
        }
        if (update) {
            this._service.updateUser(this.currentUser).then(res => {
                localStorage.setItem("user", JSON.stringify(this.currentUser));
                this.presentToast("Update successful!").then(res => {
                    this.closeModal();
                });
            }).catch(err => {
                console.log(err);
            });
        } else {
            this.presentToast("Update unsuccessful!");
        }
    }

    async closeModal() {
        await this._modalController.dismiss();
    }

    editAddr: boolean = false;

    editAddress() {
        if (this.editAddr) {
            this.editAddr = false;
        } else {
            this.editAddr = true;
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
}
