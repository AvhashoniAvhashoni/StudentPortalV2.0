import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/class/course';
import { AppService } from 'src/app/app.service';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/class/user';

@Component({
    selector: 'app-rating',
    templateUrl: './rating.page.html',
    styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {
    public course: Course = null;
    public user: User = null;
    public rating: Array<number> = [0, 0, 0, 0, 0];
    public starRate = null;
    constructor(private _service: AppService, public _modalController: ModalController) { }

    ngOnInit() {
        this.course = this._service.getSession("enrolledCourseInfo");
        this.user = this._service.getLocal("user");
    }

    async closeModal() {
        await this._modalController.dismiss();
    }

    public rate(value, key): void {
        this.rating[key] = value;
        switch (key) {
            case 0: {
                if (this.rating[key] == 0) {
                    this.rating[1] = 0;
                    this.rating[2] = 0;
                    this.rating[3] = 0;
                    this.rating[4] = 0;
                }
                this.starRate = value;
                break;
            }
            case 1: {
                if (this.rating[key] == 0) {
                    this.rating[0] = 1;
                    this.rating[1] = 0;
                    this.rating[2] = 0;
                    this.rating[3] = 0;
                    this.rating[4] = 0;
                    this.starRate = 1;
                } else {
                    this.rating[0] = 1;
                    this.starRate = value;
                }
                break;
            }
            case 2: {
                if (this.rating[key] == 0) {
                    this.rating[0] = 1;
                    this.rating[1] = 2;
                    this.rating[2] = 0;
                    this.rating[3] = 0;
                    this.rating[4] = 0;
                    this.starRate = 2;
                } else {
                    this.rating[0] = 1;
                    this.rating[1] = 2;
                    this.starRate = value;
                }
                break;
            }
            case 3: {
                if (this.rating[key] == 0) {
                    this.rating[0] = 1;
                    this.rating[1] = 2;
                    this.rating[2] = 3;
                    this.rating[3] = 0;
                    this.rating[4] = 0;
                    this.starRate = 3;
                } else {
                    this.rating[0] = 1;
                    this.rating[1] = 2;
                    this.rating[2] = 3;
                    this.starRate = value;
                }
                break;
            }
            case 4: {
                if (this.rating[key] == 0) {
                    this.rating[0] = 1;
                    this.rating[1] = 2;
                    this.rating[2] = 3;
                    this.rating[3] = 4;
                    this.rating[4] = 0;
                    this.starRate = 4;
                } else {
                    this.rating[0] = 1;
                    this.rating[1] = 2;
                    this.rating[2] = 3;
                    this.rating[3] = 4;
                    this.starRate = value;
                }
                break;
            }
        }
        if (this.starRate == 0) {
            this.starRate = null;
        }
    }

    public rateCourse(): void {
        this._service.postRatings({ courseID: this.course.id, userID: this.user.id, rating: this.starRate }).then(res => {
            this.closeModal();
        });
    }
}
