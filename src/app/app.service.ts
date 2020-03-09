import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { User } from './class/user';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { StudentCourse } from './class/studentCourse';

export interface MapboxOutput {
    attribution: string;
    features: Feature[];
    query: [];
}

export interface Feature {
    place_name: string;
}

@Injectable({
    providedIn: 'root'
})
export class AppService {
    constructor(private _auth: AngularFireAuth, private _firestore: AngularFirestore, private _http: HttpClient, private _storage: AngularFireStorage) { }

    setSession(key: string, value: any) {
        return sessionStorage.setItem(key, JSON.stringify(value));
    }

    setLocal(key: string, value: any) {
        return localStorage.setItem(key, JSON.stringify(value));
    }

    getSession(key: string) {
        return JSON.parse(sessionStorage.getItem(key));
    }

    getLocal(key: string) {
        return JSON.parse(localStorage.getItem(key));
    }

    async signupEmail(email: string, password: string) {
        return await this._auth.auth.createUserWithEmailAndPassword(email, password);
    }

    async signInEmail(email: string, password: string) {
        return await this._auth.auth.signInWithEmailAndPassword(email, password);
    }

    async resetPassword(email: string) {
        return await this._auth.auth.sendPasswordResetEmail(email);
    }

    async signOut() {
        sessionStorage.clear();
        localStorage.clear();
        localStorage.setItem("slides", "true");
        return await this._auth.auth.signOut();
    }

    async createUser(user: User) {
        return await this._firestore.collection("students").doc(user.id).set(user);
    }

    readUser(id: string) {
        return this._firestore.collection("students").doc(id).valueChanges();
    }

    async updateUser(user: User) {
        return await this._firestore.collection("students").doc(user.id).set(user);
    }

    async upload(folder: string, fileName: string, file: File) {
        return await this._storage.upload(folder + fileName, file);
    }

    readCourses() {
        return this._firestore.collection("courses", ref => ref.orderBy("name")).snapshotChanges();
    }

    readCourse(cid) {
        return this._firestore.collection("courses").doc(cid).valueChanges();
    }

    searchQuery(query: string) {
        const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
        return this._http.get(url + query + ".json?country=ZA&types=address&access_token=" +
            environment.mapbox.accessToken).pipe(map((res: MapboxOutput) => {
                return res.features;
            }))
    }

    async postStudentCourse(studentCourse: StudentCourse) {
        return await this._firestore.collection("studentCourse").add(studentCourse);
    }

    readStudentCourse(uid: string) {
        return this._firestore.collection("studentCourse", ref => ref.where("userID", "==", uid)).snapshotChanges();
    }

    readStudentCourse2(cid: string) {
        return this._firestore.collection("studentCourse", ref => ref.where("courseID", "==", cid)).snapshotChanges();
    }

    async updateStudentCourse(userCourse: StudentCourse) {
        return await this._firestore.collection("studentCourse").doc(userCourse.id).set(userCourse);
    }

    readRatings(courseID: string, userID: string) {
        return this._firestore.collection("ratings", ref => ref.where("courseID", "==", courseID).where("userID", "==", userID)).valueChanges();
    }
    getRatings(courseID: string) {
        return this._firestore.collection("ratings", ref => ref.where("courseID", "==", courseID)).valueChanges();
    }

    async postRatings(ratings: any) {
        return await this._firestore.collection("ratings").add(ratings);
    }
}
