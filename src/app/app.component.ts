import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { User } from './class/user';
import { AppService } from './app.service';
import { Router } from '@angular/router';
import { Plugins, PluginListenerHandle, NetworkStatus } from "@capacitor/core";

const { Network } = Plugins;

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, DoCheck, OnDestroy {
    private networkListener: PluginListenerHandle;
    private networkStatus: NetworkStatus;
    public profilePic: string = "/assets/images/profile.png";
    public name: string = "";
    public email: string = "";
    public user: User;
    public userNetwork: boolean = false;

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
            title: 'Courses',
            url: 'enrolledcourses',
            icon: 'easel'
        },
        {
            title: 'Content',
            url: '/news',
            icon: 'newspaper'
        },
        {
            title: 'Notification',
            url: '/notifications',
            icon: 'notifications'
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

    ngDoCheck() {
        this.user = this._service.getLocal("user");
        if (this.user) {
            if (this.user.profilePicUrl) {
                this.profilePic = this.user.profilePicUrl;
            }
            this.name = this.user.firstName;
            this.email = this.user.email;
        }
    }

    async ngOnInit() {
        this.user = this._service.getLocal("user");
        if (this.user) {
            this._router.navigateByUrl("/landing");
            this.userNetwork = true;
            this._menuCtr.enable(true);
        } else if (!this.user) {
            if (localStorage.getItem("slides")) {
                this._router.navigateByUrl("/signin");
            } else {
                this._router.navigateByUrl("");
            }
            this._menuCtr.enable(false);
        }

        // this.networkListener = Network.addListener('networkStatusChange', status => {
        //     this.networkStatus = status;
        //     this.checkUser(this.networkStatus);
        // });
        // this.networkStatus = await Network.getStatus();
        // this.checkUser(this.networkStatus);
    }

    // checkUser(networkStatus) {
    //     if (networkStatus.connected) {
    //         if (this.userNetwork) {
    //             this._router.navigateByUrl("/landing");
    //             this._menuCtr.enable(true);
    //         }
    //     } else if (networkStatus.connected) {
    //         if (!this.userNetwork) {
    //             if (localStorage.getItem("slides")) {
    //                 this._router.navigateByUrl("/signin");
    //             } else {
    //                 this._router.navigateByUrl("");
    //             }
    //             this._menuCtr.enable(false);
    //         }
    //     } else {
    //         this._router.navigateByUrl("/network-detection");
    //         this._menuCtr.enable(false);
    //     }
    // }

    ngOnDestroy() {
        // this.networkListener.remove();
    }
}
