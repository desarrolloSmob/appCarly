import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';

import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  ///api/v1/cars
  url = "https://6e06-2806-2a0-b2e-81ab-4cc7-d020-6d40-8f0a.ngrok-free.app/";
  //url = "https://andanacmsg.herokuapp.com/"
  //url = "https://andanac.uc.r.appspot.com/"
  constructor(
    private db: AngularFireDatabase,
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private http: HttpClient
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }
  //Smob@_2022
  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        let token=result["user"]!["refreshToken"]
        let uid=result["user"]!["uid"]
        
        let key = "webData/" + result.user?.uid+"/user";
        const tutRef = this.db.object(key).valueChanges().subscribe((item: any) => {
          if (item) {
            item["token"]=token
            item["uid"]=uid
            localStorage.setItem('userProfile', JSON.stringify(item))
            this.router.navigate(['home']);
          }
        })
      })
      .catch((error) => {
        this.spinner.hide();
        this.toastr.error('Usuario/Contraseña incorrecta', 'Error');

        //window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(user: any) {
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, user.pass)
      .then((result) => {
        this.toastr.success('Usuario creado correctamente', 'Bienvenido');
        //api/v1/newuser
        console.log(user)
        let uid=result["user"]!["uid"]
        this.db.list('webData/' + uid ).update("user",user).then((result) => {
          this.SignIn(user.email,user.pass)
        })
      })
      .catch((error) => {
        this.spinner.hide();
        window.alert(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user != null;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      if (res) {
        this.router.navigate(['dashboard']);
      }
    });
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        // this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any, user2: any) {

    const tutRef = this.db.object("profile/" + user.uid);
    // set() for destructive updates

    const userData: any = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      name: user2.name,
      type: user2.type,
      emailVerified: user.emailVerified,
      position: user2.position,
      groupUser: user2.groupUser,
      distribuidoresGroup: user2.distribuidoresGroup,
      groupName: user2.groupName
    };

    tutRef.set(userData);

    /*
    return userRef.set(userData, {
      merge: true,
    }); */
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
}
