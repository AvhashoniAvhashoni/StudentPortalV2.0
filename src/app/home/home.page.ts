import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    public imageIndexes: Array<number> = [];
    @ViewChild('slides', { static: false }) slide;

    constructor(private _router: Router) { }

    ngOnInit() {
        let i: number = 1;
        while (i < 41) {
            this.imageIndexes.push(i);
            i++;
        }
    }

    disableSlides() {
        localStorage.setItem("slides", "true");
        this._router.navigateByUrl("/signin");
    }
}
