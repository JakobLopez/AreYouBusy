import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs'
import * as firebase from 'firebase';
import 'firebase/firestore';




@Injectable()
export class DatabaseProvider {
  
  private fire: any;
  constructor(public db: AngularFirestore) {
    console.log('Hello DatabaseProvider Provider');
    this.fire = firebase.firestore();
  }

    /* usersObject
   * Desc: 
   *      Get an object containing all users in the database.
   * Params:
   *      none
   * Returns: 
   *      an object containing all users in the database, keyed by user id
   */
  async usersObject() {

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

      return collection_obj;

    }
    catch (e) {
      throw e;
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
  async setUserDoc(id: string, credentials:any) {
    try {
      var o = {
        type: credentials.type
      };
      var obj = {
        name: credentials.name,
        email: credentials.email,
        type: credentials.type,
        creation_time: new Date()
      };
      await this.db.collection(`Users`).doc(id).set(o);
      await this.db.collection(`${obj.type}s`).doc(id).set(obj);

    } catch (e) {
      throw e;
    }
  }

  /* getUserType
  * Desc:  
  *     Gets the user type from database
  * Params:
  *     id: the id of the document being fetched
  * returns: 
  *     'Student' or 'Teacher', else throws error
  */
  async getUserType(id: string){
    try{
      let user = await this.usersObject();
      user = user[id];
      return user['type'];
    }catch(e){
      throw(e);
    }
  }

}
