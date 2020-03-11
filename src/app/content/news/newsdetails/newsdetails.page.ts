import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'app-newsdetails',
    templateUrl: './newsdetails.page.html',
    styleUrls: ['./newsdetails.page.scss'],
})
export class NewsdetailsPage implements OnInit {
    public courseName: string = null;
    public courseImage: string = null;
    public news: any = null;
    constructor(public _modalController: ModalController, private _service: AppService) { }

    ngOnInit() {
        this.news = this._service.getSession("news");
        this.courseName = sessionStorage.getItem("courseName");
        this.courseImage = sessionStorage.getItem("courseImage");
    }

    async closeModal() {
        await this._modalController.dismiss();
    }
}
