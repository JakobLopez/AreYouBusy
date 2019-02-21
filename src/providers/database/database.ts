import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs'

import 'firebase/firestore';




@Injectable()
export class DatabaseProvider {

  constructor(public db: AngularFirestore) {
    console.log('Hello DatabaseProvider Provider');
  }

  /* userSetDoc
  * Desc: Asynchronous. Uploads a user document to the firestore.
  * Params:
  *     id: the id of the document being set
  *     firstname: the first name of the user
  *     lastname: the last name of the user
  * returns: nothing.
  */
  async setUserDoc(id: string, credentials:any) {
    try {

      var obj = {
        name: credentials.name,
        email: credentials.email,
        type: credentials.type,
        creation_time: new Date()
      }

      await this.db.collection(`${obj.type}s`).doc(id).set(obj);

    } catch (e) {
      throw e;
    }
  }

}
