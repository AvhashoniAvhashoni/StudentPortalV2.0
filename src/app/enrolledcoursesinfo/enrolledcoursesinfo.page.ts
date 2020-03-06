import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Course } from '../class/course';
import { RatingPage } from './rating/rating.page';
import { ModalController } from '@ionic/angular';
import { User } from '../class/user';

@Component({
    selector: 'app-enrolledcoursesinfo',
    templateUrl: './enrolledcoursesinfo.page.html',
    styleUrls: ['./enrolledcoursesinfo.page.scss'],
})
export class EnrolledcoursesinfoPage implements OnInit {
    public course: Course;
    public user: User = null;
    public duration: number = 0;
    constructor(private _service: AppService, public modalController: ModalController) { }

    ngOnInit() {
        this.user = this._service.getLocal("user");
        this.course = this._service.getSession("enrolledCourseInfo");
        this._service.readRatings(this.course.id, this.user.id).subscribe(res => {
            if (res.length == 0) {
                this.presentModal();
            }
        });
        var timeDiff = Math.abs(new Date(this.course.endDate).getTime() - new Date(this.course.startDate).getTime());
        this.duration = Math.ceil((timeDiff / (1000 * 3600 * 24)) / 30.4167);
    }

    async presentModal() {
        const modal = await this.modalController.create({
            component: RatingPage
        });
        return await modal.present();
    }
}
