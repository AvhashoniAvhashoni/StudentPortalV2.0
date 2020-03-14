import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { User } from './class/user';
import { AppService } from './app.service';
import { Router } from '@angular/router';
import { Plugins, PluginListenerHandle, NetworkStatus } from "@capacitor/core";
import { StudentCourse } from './class/studentCourse';
import { Notification } from './class/notification';

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
    public unread: string = null;

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
            // this.statusBar.styleDefault();
            this.statusBar.backgroundColorByHexString('#600018');
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
        this.notifications();
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
                                let notification = res.map(n => {
                                    return {
                                        id: n.payload.doc.id,
                                        ...n.payload.doc.data()
                                    } as Notification;
                                });
                                notification.sort((a, b) => (a.date < b.date) ? 1 : ((b.time < a.time) ? -1 : 0));
                                let unread: number = 0;
                                for (let n of notification) {
                                    if (!n.read) {
                                        n.read = [];
                                        unread++;
                                    }
                                    for (let r of n.read) {
                                        if (r.user != user.id) {
                                            unread++;
                                        }
                                    }
                                }
                                if (unread > 9) {
                                    this.unread = "9+";
                                } else if (unread > 0) {
                                    this.unread = unread.toString();
                                }
                            }
                        }, err => {
                            console.log(err);
                        });
                    }
                }
            }
        });
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
