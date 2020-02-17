import { Component, OnInit } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { User } from './class/user';
import { AppService } from './app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public profilePic: string = "https://images.pexels.com/photos/2250394/pexels-photo-2250394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
  public name: string = "";
  public email: string = "";
  public user: User;

  public appPages = [
    {
      title: 'Home',
      url: '/landing',
      icon: 'home'
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'person'
    },
    {
      title: 'Registration',
      url: '/registration',
      icon: 'newspaper'
    },
    {
      title: 'Registered Courses',
      url: 'enrolledcourses',
      icon: 'clipboard'
    },
    {
      title: 'Course Content',
      url: '/news',
      icon: 'easel'
    },
    {
      title: 'Financial Statement',
      url: '/finance',
      icon: 'wallet'
    },
    {
      title: 'Log Out',
      url: '/logout',
      icon: 'log-out'
    }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _menuCtr: MenuController,
    private _service: AppService,
    private _router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.user = this._service.getLocal("user");
    if (this.user.profilePicUrl) {
      this.profilePic = this.user.profilePicUrl;
    }
    this.name = this.user.firstName;
    this.email = this.user.email;

    if (this.user) {
      this._menuCtr.enable(true);
      // this._router.navigateByUrl("landing");
    } else {
      this._menuCtr.enable(false);
    }
  }
}
