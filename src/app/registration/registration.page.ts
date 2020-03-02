import { Component, OnInit, DoCheck } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidateId } from '../class/validateid';
import { User } from '../class/user';
import { AppService, Feature } from '../app.service';
import { StudentCourse } from '../class/studentCourse';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.page.html',
    styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit, DoCheck {
    public index: number = 1;
    public idnumErr: string = null;
    public dobErr: string = null;
    public validate = new ValidateId();
    public currentUser: User;
    public id: boolean = false;
    public address: string[] = [];
    public isDisable: boolean = false;
    public disabilityErr: string = "";
    public addressErr: string = "";
    public maxYear: number = new Date().getFullYear() - 14;
    public minYear: number = new Date().getFullYear() - 100;
    public addresses: string[] = [];
    public selectedAddress = null;
    public searchHeight: boolean = false;
    public course: any = null;
    public studentCourse: StudentCourse;
    public allowRegister: boolean = false;

    constructor(private _service: AppService, private _toastController: ToastController, private _router: Router) { }
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
        this.user.controls["disability"].setValue(this.currentUser.disability);
        this.user.controls["addressLn1"].setValue(this.currentUser.addressLn1);
        if (this.currentUser.guardian) {
            this.user.controls["gName"].setValue(this.currentUser.guardian.firstName);
            this.user.controls["gSurname"].setValue(this.currentUser.guardian.lastName);
            this.user.controls["gCell"].setValue(this.currentUser.guardian.cellNr);
        }
        this.address = this.currentUser.address;

        this._service.readStudentCourse(this.currentUser.id).subscribe(res => {
            if (res.length > 0) {
                let studentCourse: any = res.map(sc => {
                    return {
                        id: sc.payload.doc.id,
                        ...sc.payload.doc.data()
                    } as StudentCourse
                });
                for (let sc of studentCourse) {
                    if (sc.status && !sc.dateRegistered) {
                        this.studentCourse = sc;
                        this.allowRegister = true;
                        this._service.readCourse(sc.courseID).subscribe(course => {
                            this.course = course;
                        });
                    }
                }
            }
        });
    }

    ionViewDidEnter() {
        setTimeout(() => {
            if (!this.allowRegister) {
                this.presentToast("You are not permitted to register!").then(res => {
                    this._router.navigateByUrl("/landing");
                })
            }
        }, 1000);
    }

    user = new FormGroup({
        name: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[A-Za-z]+")])),
        surname: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[A-Za-z]+")])),
        cell: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^(\\0|0)[6-8][0-9]{8}$")])),
        idNr: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern("[0-9]+")])),
        dob: new FormControl(null, Validators.compose([Validators.required])),
        disability: new FormControl(null, Validators.compose([Validators.minLength(3), Validators.maxLength(225), Validators.pattern("[A-Za-z- ]+")])),
        addressLn1: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern("[a-zA-Z0-9- ]+")])),
        gName: new FormControl(null, Validators.compose([Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[A-Za-z]+")])),
        gSurname: new FormControl(null, Validators.compose([Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[A-Za-z]+")])),
        gCell: new FormControl(null, Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^(\\0|0)[6-8][0-9]{8}$")])),
        payMethod: new FormControl(null, Validators.required)
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
        ],
        'payMethod': [
            { type: 'required', message: 'Please select one mode of payment!' },
        ]
    };

    toggle($event) {
        this.isDisable = !this.isDisable;
    }

    changeIndex(index: number, prevNext: string) {
        if (prevNext == "prev") {
            if (this.currentUser.addressLn1 && index == 3) {
                let dateDiff = (new Date().getTime() - new Date(this.currentUser.dob).getTime()) / 1000;
                dateDiff /= (60 * 60 * 24)
                let age = Math.abs(Math.round(dateDiff / 365.25));
                if (age >= 18)
                    this.index = 2;
                else
                    this.index = index;
            } else {
                this.index = index;
            }
        }

        if (index == 2 && prevNext == "next") {
            if (this.user.value.name && this.user.get("name").valid) {
                this.currentUser.firstName = this.user.value.name;
            } else {
                this.user.get("name").markAsTouched({ onlySelf: true });
            }

            if (this.user.value.surname && this.user.get("surname").valid) {
                this.currentUser.lastName = this.user.value.surname;
            } else {
                this.user.get("surname").markAsTouched({ onlySelf: true });
            }

            if (this.user.value.cell && this.user.get("cell").valid) {
                this.currentUser.cellNumber = this.user.value.cell;
            } else {
                this.user.get("cell").markAsTouched({ onlySelf: true });
            }

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

            if (this.isDisable) {
                if (!this.currentUser.disability) {
                    this.disabilityErr = "This field is required!"
                } else {
                    this.currentUser.disability = this.user.value.disability;
                }
            }

            if (this.user.get("name").valid && this.user.get("surname").valid && this.user.get("cell").valid && this.user.get("idNr").valid && this.user.get("dob").valid
                && this.idnumErr == null && this.dobErr == null) {
                this.index = index;
            } else {
                this.index = 1;
            }
        }

        if (index == 3 && prevNext == "next") {
            if (this.user.value.addressLn1 && this.user.get("addressLn1").valid) {
                this.currentUser.addressLn1 = this.user.value.addressLn1;
            } else {
                this.user.get("addressLn1").markAsTouched({ onlySelf: true });
            }

            if (!this.address) {
                this.addressErr = "Street address is required!";
            }

            if (this.currentUser.addressLn1 && this.user.get("addressLn1").valid && this.address) {
                this.currentUser.address = this.address;
                let dateDiff = (new Date().getTime() - new Date(this.currentUser.dob).getTime()) / 1000;
                dateDiff /= (60 * 60 * 24)
                let age = Math.abs(Math.round(dateDiff / 365.25));
                if (age >= 18)
                    this.index = 4;
                else
                    this.index = index;
            } else {
                this.index = 2;
            }
        }

        if (index == 4 && prevNext == "next") {
            if (!this.currentUser.guardian) {
                this.currentUser.guardian = {};
            }
            if (this.user.value.gName && this.user.get("gName").valid) {
                this.currentUser.guardian.firstName = this.user.value.gName;
            } else {
                this.user.get("gName").markAsTouched({ onlySelf: true });
            }

            if (this.user.value.gSurname && this.user.get("gSurname").valid) {
                this.currentUser.guardian.lastName = this.user.value.gSurname;
            } else {
                this.user.get("gSurname").markAsTouched({ onlySelf: true });
            }

            if (this.user.value.gCell && this.user.get("gCell").valid) {
                this.currentUser.guardian.cellNr = this.user.value.gCell;
            } else {
                this.user.get("gCell").markAsTouched({ onlySelf: true });
            }

            if (this.user.get("gCell").valid && this.user.get("gSurname").valid && this.user.get("gName").valid) {
                this.index = index;
            } else {
                this.index = 3;
            }
        }
    }

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

    registration() {
        if (this.user.value.payMethod && this.user.get("payMethod").valid) {
            this.currentUser.payMethod = this.user.value.payMethod;
        } else {
            this.user.get("payMethod").markAsTouched({ onlySelf: true });
        }
        if (this.user.valid) {
            this._service.updateUser(this.currentUser).then(res => {
                this._service.setLocal("user", this.currentUser);
                this.studentCourse.dateRegistered = new Date();
                this._service.updateStudentCourse(this.studentCourse).then(res => {
                    this._router.navigateByUrl("/payment");
                    this.presentToast("Registration successful!")
                });
            }).catch(err => {
                console.log(err);
            });
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
