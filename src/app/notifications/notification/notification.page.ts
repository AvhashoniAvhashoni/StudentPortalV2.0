import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { User } from 'src/app/class/user';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  public notification: any;
  constructor(private _modalController: ModalController, private _service: AppService) { }

  ngOnInit() {
    // console.log(this.notification);
    // this.deleteNotification();
  }

  deleteNotification() {
    let user: User = this._service.getLocal("user").id;
    for (let i = 0; i < this.notification.read.length; i++) {
      if (this.notification.read[i].user == user) {
        this.notification.read[i] = { user: user, delete: true };
      }
    }
    this._service.updateNotifications(this.notification).then(res => { this.closeModal() });
  }

  async closeModal() {
    await this._modalController.dismiss();
  }
}
