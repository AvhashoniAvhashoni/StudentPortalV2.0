import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _service: AppService, private _router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._service.isLoggedIn ? true : this._router.parseUrl("/signin");
  }
}

@Injectable({
  providedIn: 'root'
})
export class NoUserGuard implements CanActivate {
  constructor(private _service: AppService, private _router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return !this._service.isLoggedIn ? true : this._router.parseUrl("/landing");
  }
}

@Injectable({
  providedIn: 'root'
})
export class SlidesGuard implements CanActivate {
  constructor(private _service: AppService, private _router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return !this._service.isSildes ? true : this._router.parseUrl("/signin");
  }
}