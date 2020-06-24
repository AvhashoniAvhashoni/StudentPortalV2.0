import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.page.html',
    styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

    constructor(private _service: AppService, private _router: Router, private _menuCtrl: MenuController) { }

    ngOnInit() {
        this._service.signOut();
        this._menuCtrl.enable(false);
        this._router.navigateByUrl("/signin");
    }
}
