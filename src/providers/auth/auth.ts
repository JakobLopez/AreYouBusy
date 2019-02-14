import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  uid:String;

  constructor(public afAuth: AngularFireAuth) {
    console.log('Hello AuthProvider Provider');
  }

  async register(credentials){
    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
      console.log("created");
      
    }
    catch (e) {
      throw(e)
    }
  }

  async login(credentials) {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
      this.uid = this.afAuth.auth.currentUser.uid;
    }
    catch (e) {
      throw (e);
    }
  }
}
