import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { DatabaseProvider } from '../database/database';


@Injectable()
export class AuthProvider {
  uid: String;

  constructor(public afAuth: AngularFireAuth,
    public db: DatabaseProvider) {
    console.log('Hello AuthProvider Provider');
  }

  /**
  * @FunctionName: register
  * @Description:
  *    Creates a user account in Firebase with credentials
  *    Throws error if credentials don't match a user in Firebase.
  * @Params:
  *    credentials - an object containinf an email and password
  * @Returns:
  *    Error if couldn't create account
  **/
  async register(credentials:any) {
    try {
      let newuser = await this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
      await this.db.setUserDoc(newuser.user.uid, credentials)
      console.log("Authenticated user")
    }
    catch (e) {
      throw (e)
    }
  }

  /**
  * @FunctionName: login
  * @Description:
  *    Logs a valid user in with email and password credentials.
  * @Params:
  *    credentials - an object containinf an email and password
  * @Returns:
  *    Error if credentials don't match a user in Firebase.
  **/
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