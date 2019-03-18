import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs'
import * as firebase from 'firebase';
import 'firebase/firestore';




@Injectable()
export class DatabaseProvider {
  accountType: any;
  allUsers: any;
  private fire: any;

  constructor(public db: AngularFirestore) {
    console.log('Hello DatabaseProvider Provider');
    this.fire = firebase.firestore();
    this.createUsersObject();
  }

  /* usersObject
 * Desc: 
 *      Get an object containing all users in the database.
 * Params:
 *      none
 * Returns: 
 *      an object containing all users in the database, keyed by user id
 */
  async createUsersObject() {

    try {
      var query = await this.fire.collection("Users").get();
      var collection_obj = {};
      query.forEach(
        (doc: any) => {
          var doc_obj = {};
          var doc_data = doc.data();
          for (var field in doc_data) {
            doc_obj[field] = doc_data[field];
          }
          collection_obj[doc.id] = doc_obj;
        }
      );
      this.allUsers = collection_obj;
    }
    catch (e) {
      throw e;
    }
  }

  /* userSetDoc
  * Desc:  
  *     Gets a user document
  * Params:
  *     uid: uid of user that will be returned
  * returns: 
  *     user document with all its fields
  */
  async getUser(uid: any) {
    try {
      let userRef: any;
      console.log(uid)
      if (this.accountType == 'Student')
        userRef = await this.db.collection('Students').ref.where('uid', '==', uid);
      else
        userRef = await this.db.collection('Teachers').ref.where('uid', '==', uid);

      let result = await userRef.get();

      var doc_obj = {};
      result.forEach(doc => {
        var doc_data = doc.data();
        for (var field in doc_data) {
          doc_obj[field] = doc_data[field];
        }
      })

      return doc_obj;
    }
    catch (e) {
      throw (e);
    }
  }

  /* userSetDoc
  * Desc:  
  *     Uploads a user document to the firestore.
  * Params:
  *     id: the id of the document being set
  *     firstname: the first name of the user
  *     lastname: the last name of the user
  * returns: nothing.
  */
  async setUserDoc(id: string, credentials: any) {
    try {
      var o = {
        type: credentials.type
      };
      var obj = {
        name: credentials.name,
        email: credentials.email,
        type: credentials.type,
        uid: id,
        creation_time: new Date()
      };
      await this.db.collection(`Users`).doc(id).set(o);
      await this.db.collection(`${obj.type}s`).doc(id).set(obj);

    } catch (e) {
      throw e;
    }
  }

  /* setAccountType
  * Desc:  
  *     Gets the user type from database
  * Params:
  *     id: the id of the document being fetched
  * returns: 
  *     'Student' or 'Teacher', else throws error
  */
  async setAccountType(id: string, type?: any) {
    try {
      if (type)
        this.accountType = type;
      else {
        await this.createUsersObject();
        let user = this.allUsers[id];
        this.accountType = user['type'];
      }
    } catch (e) {
      throw (e);
    }
  }

}
