import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Notification } from '../class/notification';
import { User } from '../class/user';
import { StudentCourse } from '../class/studentCourse';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.page.html',
    styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
    public notification: any;
    constructor(private _service: AppService) { }

    ngOnInit() {
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
                            if (res.length > 0) {
                                this.notification = res.map(n => {
                                    return {
                                        id: n.payload.doc.id,
                                        ...n.payload.doc.data()
                                    } as Notification;
                                });
                                for (let n of this.notification) {
                                    if (n.userIDs) {
                                        for (let uID of n.userIDs) {
                                            if (uID != user.id) {
                                                n.color = true;
                                            }
                                        }
                                    } else {
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

    public colors(letter: string): string {
        letter.toUpperCase();
        let color = "";
        switch (letter) {
            case 'A': {
                color = "rgba(3, 169, 244, 0.7)";
                break;
            }
            case 'B': {
                color = "rgba(244, 67, 54, 0.7)";
                break;
            }
            case 'C': {
                color = "rgba(233, 30, 99, 0.7)";
                break;
            }
            case 'D': {
                color = "rgba(156, 39, 176, 0.7)";
                break;
            }
            case 'E': {
                color = "rgba(63, 81, 181, 0.7)";
                break;
            }
            case 'F': {
                color = "rgba(0, 188, 212, 0.7)";
                break;
            }
            case 'G': {
                color = "rgba(0, 150, 136, 0.7)";
                break;
            }
            case 'H': {
                color = "rgba(76, 175, 80, 0.7)";
                break;
            }
            case 'I': {
                color = "rgba(205, 220, 57, 0.7)";
                break;
            }
            case 'J': {
                color = "rgba(255, 235, 59, 0.7)";
                break;
            }
            case 'K': {
                color = "rgba(255, 152, 0, 0.7)";
                break;
            }
            case 'L': {
                color = "rgba(121, 85, 72, 0.7)";
                break;
            }
            case 'M': {
                color = "rgba(158, 158, 158, 0.7)";
                break;
            }
            case 'N': {
                color = "rgba(96, 125, 139, 0.7)";
                break;
            }
            case 'O': {
                color = "rgba(0, 0, 0, 0.7)";
                break;
            }
            case 'P': {
                color = "rgba(62, 69, 81, 0.7)";
                break;
            }
            case 'Q': {
                color = "#1c2a48";
                break;
            }
            case 'R': {
                color = "#37474f";
                break;
            }
            case 'S': {
                color = "#ff8f00";
                break;
            }
            case 'T': {
                color = "#3F729B";
                break;
            }
            case 'U': {
                color = "";
                break;
            }
            case 'V': {
                color = "";
                break;
            }
            case 'W': {
                color = "";
                break;
            }
            case 'X': {
                color = "";
                break;
            }
            case 'Y': {
                color = "";
                break;
            }
            case 'Z': {
                color = "";
                break;
            }
            default:
                break;
        }
        return color;
    }
}