import { Component, OnInit, DoCheck } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/class/user';
import { AppService, Feature } from 'src/app/app.service';
import { Router } from '@angular/router';
import { StudentCourse } from 'src/app/class/studentCourse';
import { ValidateId } from 'src/app/class/validateid';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.page.html',
    styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit, DoCheck {
    public idnumErr: string = null;
    public dobErr: string = null;
    public validate = new ValidateId();
    public currentUser: User;
    public id: boolean = false;
    public address: string[] = [];
    public addressErr: string = "";
    public maxYear: number = new Date().getFullYear() - 14;
    public minYear: number = new Date().getFullYear() - 100;
    public addresses: string[] = [];
    public selectedAddress = null;
    public searchHeight: boolean = false;
    public editAddr: boolean = false;
    public age: number = 18;

    constructor(public _modalController: ModalController, private _service: AppService, private _toastController: ToastController, private _router: Router) { }

    ngDoCheck() {
        if (this.dobErr != "Incorrect ID or date of birth!") {
            this.user.controls["dob"].setErrors(null);
        }
        //ID Number
        if (this.user.controls["idNr"].touched && this.user.controls["idNr"].hasError("required")) {
            this.idnumErr = "Please fill in your ID Number!";
        } else if (this.user.controls["idNr"].touched && this.user.controls["idNr"].hasError("minlength")) {
            this.idnumErr = "ID Number has to be 13 characters long!";
        } else if (this.user.controls["idNr"].touched && !this.validate.verifyID(parseInt(this.user.controls["idNr"].value))) {
            this.user.controls["idNr"].setErrors({ 'incorrect': true });
            this.idnumErr = "Invalid id Number!";
        } else {
            this.idnumErr = null;
        }
        //ID and Date of Birth
        let dob = this.user.controls["dob"].value;
        let id = this.user.controls["idNr"].value;
        if (dob && id) {
            dob = dob.substr(2, 2) + dob.substr(dob.indexOf('-') + 1, 2) + dob.substr(dob.lastIndexOf('-') + 1, 2);
            id = id.substr(0, 6);
            if (this.user.controls["dob"].touched && this.user.controls["dob"].hasError("required")) {
                this.dobErr = "Please enter your date of Birth!";
            } else if (this.user.controls["dob"].touched && dob != id) {
                this.user.controls["dob"].setErrors({ 'incorrect': true });
                this.idnumErr = "Incorrect ID or date of birth!";
                this.dobErr = "Incorrect ID or date of birth!";
            } else {
                this.dobErr = null;
            }
        }

        if (this.user.get("dob").value) {
            let dateDiff = (new Date().getTime() - new Date(this.user.get("dob").value).getTime()) / 1000;
            dateDiff /= (60 * 60 * 24)
            this.age = Math.abs(Math.round(dateDiff / 365.25));
        }
    }

    ngOnInit() {
        this.currentUser = this._service.getLocal("user");
        this.user.controls["name"].setValue(this.currentUser.firstName);
        this.user.controls["surname"].setValue(this.currentUser.lastName);
        this.user.controls["cell"].setValue(this.currentUser.cellNumber);
        if (this.currentUser.idNumber) {
            this.id = true;
        }
        this.user.controls["idNr"].setValue(this.currentUser.idNumber);
        this.user.controls["dob"].setValue(this.currentUser.dob);
        this.user.controls["addressLn1"].setValue(this.currentUser.addressLn1);
        if (this.currentUser.guardian) {
            this.user.controls["gName"].setValue(this.currentUser.guardian.firstName);
            this.user.controls["gSurname"].setValue(this.currentUser.guardian.lastName);
            this.user.controls["gCell"].setValue(this.currentUser.guardian.cellNr);
        }
        this.address = this.currentUser.address;
    }

    async closeModal() {
        await this._modalController.dismiss();
    }

    user = new FormGroup({
        name: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[A-Za-z]+")])),
        surname: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[A-Za-z]+")])),
        cell: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^(\\0|0)[6-8][0-9]{8}$")])),
        idNr: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern("[0-9]+")])),
        dob: new FormControl(null, Validators.compose([Validators.required])),
        addressLn1: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern("[a-zA-Z0-9- ]+")])),
        gName: new FormControl(null, Validators.compose([Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[A-Za-z]+")])),
        gSurname: new FormControl(null, Validators.compose([Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[A-Za-z]+")])),
        gCell: new FormControl(null, Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^(\\0|0)[6-8][0-9]{8}$")])),
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
        'cell': [
            { type: 'required', message: 'Cell number is required!' },
            { type: 'minlength', message: 'Cell number should contain 10 digits!' },
            { type: 'pattern', message: 'Invalid cell number!' },
        ],
        'addressLn1': [
            { type: 'required', message: 'Line address 1 is required!' },
            { type: 'pattern', message: 'No characters allowed!' },
            { type: 'minlength', message: 'Line address 1 should contain atleast 3 characters!' },
        ],
        'gName': [
            { type: 'required', message: 'Name is required!' },
            { type: 'pattern', message: 'Name should contain letters only!' },
            { type: 'minlength', message: 'Name should contain atleast 3 letters!' },
        ],
        'gSurname': [
            { type: 'required', message: 'Surname is required!' },
            { type: 'pattern', message: 'Surname should contain letters only!' },
            { type: 'minlength', message: 'Surname should contain atleast 3 letters!' },
        ],
        'gCell': [
            { type: 'required', message: 'Cell number is required!' },
            { type: 'minlength', message: 'Cell number should contain 10 digits!' },
            { type: 'pattern', message: 'Invalid cell number!' },
        ]
    };

    search(event: any) {
        this.searchHeight = true;
        const searchTerm = event.target.value.toLowerCase();
        if (searchTerm && searchTerm.length > 0) {
            this._service.searchQuery(searchTerm).subscribe((features: Feature[]) => {
                this.addresses = features.map(feat => feat.place_name);
            });
        } else {
            this.addresses = [];
            this.searchHeight = false;
        }
    }

    onSelect(address: string) {
        this.address = [];
        this.selectedAddress = address;
        this.addresses = [];
        this.searchHeight = false;
        let selectedAddress: string = this.selectedAddress;
        if (this.address) {
            this.addressErr = "";
        }
        while (selectedAddress.indexOf(',') > 0) {
            this.address.push(selectedAddress.substr(0, selectedAddress.indexOf(',')));
            selectedAddress = selectedAddress.slice(selectedAddress.indexOf(',') + 2, selectedAddress.length);
        }
        this.address.push(selectedAddress);
    }

    update() {
        this.validateAllFormFields(this.user);
        if (this.user.value.idNr && this.user.get("idNr").valid) {
            this.currentUser.idNumber = this.user.value.idNr;
        } else {
            this.user.get("idNr").markAsTouched({ onlySelf: true });
        }

        if (this.user.value.dob && this.user.get("dob").valid) {
            this.currentUser.dob = this.user.value.dob;
        } else {
            this.user.get("dob").markAsTouched({ onlySelf: true });
            this.dobErr = "Please fill in your date of Birth!";
        }
        if (this.user.valid) {
            this.currentUser.firstName = this.user.get("name").value;
            this.currentUser.lastName = this.user.get("surname").value;
            this.currentUser.cellNumber = this.user.get("cell").value;
            this.currentUser.addressLn1 = this.user.get("addressLn1").value;
            if (!this.id) {
                this.currentUser.idNumber = this.user.get("idNr").value;
                this.currentUser.dob = this.user.get("dob").value;
            }
            if (!this.currentUser.guardian) {
                this.currentUser.guardian = {};
            }
            this.currentUser.guardian.firstName = this.user.get("gName").value;
            this.currentUser.guardian.lastName = this.user.get("gSurname").value;
            this.currentUser.guardian.cellNr = this.user.get("gCell").value;
            this.currentUser.address = this.address;
            this._service.updateUser(this.currentUser).then(res => {
                this._service.setLocal("user", this.currentUser);
                this.presentToast("Profile successfully updated!");
                this.closeModal();
            }).catch(err => {
                console.log(err);
            });
        }
    }

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
