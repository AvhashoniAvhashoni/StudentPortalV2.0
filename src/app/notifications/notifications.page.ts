import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Notification } from '../class/notification';
import { User } from '../class/user';
import { StudentCourse } from '../class/studentCourse';
import { DatePipe } from '@angular/common';
import { NotificationPage } from './notification/notification.page';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.page.html',
    styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
    public notification: any;
    public date: string;
    public unread: number = null;
    public color: Array<{ letter: string, color?: string }> = [
        { letter: "A" }, { letter: "B" }, { letter: "C" }, { letter: "D" },
        { letter: "E" }, { letter: "F" }, { letter: "G" }, { letter: "H" },
        { letter: "I" }, { letter: "J" }, { letter: "K" }, { letter: "L" },
        { letter: "M" }, { letter: "N" }, { letter: "O" }, { letter: "P" },
        { letter: "Q" }, { letter: "R" }, { letter: "S" }, { letter: "T" },
        { letter: "U" }, { letter: "V" }, { letter: "W" }, { letter: "X" },
        { letter: "Y" }, { letter: "Z" }];
    constructor(private _service: AppService, private _modalController: ModalController) {
        let hexArr: Array<any> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
        for (let j = 0; j < 26; j++) {
            let color = "";
            for (let i = 0; i < 6; i++) {
                color += hexArr[(Math.floor(Math.random() * 16))];
            }
            this.color[j].color = `#${color}`;
        }
    }

    ngOnInit() {
        let locale = new DatePipe("en-ZA");
        this.date = locale.transform(new Date(), "MM/dd/yyyy");
        this.notifications();
    }

    notifications() {
        let user: User = this._service.getLocal("user");
        this._service.readStudentCourse(user.id).subscribe(res => {
            if (res.length > 0) {
                let userCourse = res.map(uc => {
                    return {
                        id: uc.payload.doc.id,
                        ...uc.payload.doc.data()
                    } as StudentCourse;
                });
                for (let uc of userCourse) {
                    if (uc.dateRegistered && uc.status && !uc.courseComplete) {
                        this._service.readNotifications(uc.courseID).subscribe(res => {
                            this.unread = null;
                            if (res.length > 0) {
                                this.notification = res.map(n => {
                                    return {
                                        id: n.payload.doc.id,
                                        ...n.payload.doc.data()
                                    } as Notification;
                                });
                                this.notification.sort((a, b) => (a.date < b.date) ? 1 : ((b.time < a.time) ? -1 : 0));
                                for (let n of this.notification) {
                                    if (!n.read) {
                                        n.read = [];
                                    }
                                    let color = true;
                                    for (let r of n.read) {
                                        if (r.user == user.id) {
                                            if (r.delete) {
                                                n.delete = r.delete;
                                            }
                                            color = false;
                                            this.unread++;
                                        }
                                    }
                                    if (color) {
                                        n.color = true;
                                    }
                                }
                            }
                        }, err => {
                            console.log(err);
                        });
                        break;
                    }
                }
            }
        });
    }

    async readNotification(notification) {
        let user: User = this._service.getLocal("user");
        let addID: boolean = true;
        if (notification.color) {
            if (!notification.read) {
                notification.read = [];
            }
            delete notification.color;
            delete notification.delete;
            this.unread = null;
            for (let n of notification.read) {
                if (n.user == user.id) {
                    addID = false;
                }
            }
            if (addID) {
                notification.read.push({ user: user.id });
            }
            this._service.updateNotifications(notification).then(res => {
            }, err => {
                console.log(err);
            });
        }
        this.notifications();
        const modal = await this._modalController.create({
            component: NotificationPage,
            componentProps: { notification }
        });
        return await modal.present();
    }

    public colors(letter: string): string {
        letter.toUpperCase();
        let color = "";
        this.color.forEach(c => {
            c.letter == letter ? color = c.color : null;
        });
        return color;
    }
}