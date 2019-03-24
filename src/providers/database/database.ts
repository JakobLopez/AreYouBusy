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
  }

  /* getUser
  * Desc:  
  *     Gets a user document
  * Params:
  *     uid: uid of user that will be returned
  *     search: if true, only search Teachers 
  * returns: 
  *     user document with all its fields
  */
  async getUser(uid: any, search: boolean) {
    try {
      let userRef: any;
      if (!search) {
        if (this.accountType == 'Student')
          userRef = await this.db.collection('Students').ref.where('uid', '==', uid);
        else
          userRef = await this.db.collection('Teachers').ref.where('uid', '==', uid);
      }
      else
        userRef = await this.db.collection('Teachers').ref.where('uid', '==', uid);

      let result = await userRef.get();

      var doc_obj = {};
      result.forEach(doc => {
        var doc_data = doc.data();
        for (var field in doc_data) {
          doc_obj[field] = doc_data[field];
        }
      });

      return doc_obj;
    }
    catch (e) {
      throw (e);
    }
  }

  /* getAllTeachers
  * Desc:  
  *     Get object containing all the teachers
  * Params:
  *     none
  * returns: 
  *     Object with all teachers
  */
  async getAllTeachers() {
    try {
      var query = await this.fire.collection("Teachers").get();
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


  /* setUserDoc
  * Desc:  
  *     Uploads a user document to the firestore.
  * Params:
  *     id: the id of the document being set
  *     credentials: object with name, email, password and account type
  * returns: nothing.
  */
  async setUserDoc(id: string, credentials: any) {
    try {
      var o = {
        type: credentials.type,
        uid: id
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
        let userRef: any;

        userRef = await this.db.collection('Users').ref.where('uid', '==', id);

        let result = await userRef.get();

        var doc_obj = {};
        result.forEach(doc => {
          var doc_data = doc.data();
          for (var field in doc_data) {
            doc_obj[field] = doc_data[field];
          }
        })
        this.accountType = doc_obj['type'];
      }
    } catch (e) {
      throw (e);
    }
  }

  /* setFavorite
  * Desc:  
  *     Adds a teacher document to current user's favorite collection
  * Params:
  *     id: id of current user
  *     teachID: the id of teacher being added as favorite
  * Returns
  *     none if successful, else throws error
  */
  async setFavorite(id: string, teachID: string) {
    try {
      let temp = {};
      temp["reference"] = this.db.collection('Teachers').doc(teachID).ref;

      if (this.accountType == 'Student')
        await this.db.collection('Students').doc(id).collection('Favorites').doc(teachID).set(temp);
      else
        await this.db.collection('Teachers').doc(id).collection('Favorites').doc(teachID).set(temp);
    } catch (e) {
      throw (e);
    }
  }


  /* isFavorite
  * Desc:  
  *     Determines if teacher is in current user's favorites collection
  * Params:
  *     id: id of current user
  *     teachID: the id of teacher being added as favorite
  * Returns
  *     true if teacher is in favorites collection of current user
  */
  async isFavorite(id: string, teachID: string) {
    try {
      var userRef: any;

      if (this.accountType == 'Student')
        userRef = await this.db.collection('Students').doc(id).collection('Favorites').doc(teachID).ref;
      else
        userRef = await this.db.collection('Teachers').doc(id).collection('Favorites').doc(teachID).ref;

      let docs = await userRef.get();

      if (docs.exists)
        return true;
      else
        return false;

    } catch (e) {
      throw (e);
    }
  }

  /* getFavorites
  * Desc:  
  *     Get favorite teachers from current user
  * Params:
  *     id: id of current user
  * Returns
  *     list containing objects of favorite teachers
  */
  async getFavorites(id: string) {
    try {
      let favs = [];
      let query: any;
      if (this.accountType == 'Student')
        query = await this.fire.collection('Students').doc(id).collection('Favorites').get();
      else
        query = await this.fire.collection('Teachers').doc(id).collection('Favorites').get();

      let teacherObj = await this.getAllTeachers();

      query.forEach(
        (doc: any) => {
          favs.push({ Key: doc.id, User: teacherObj[doc.id] });
        }
      );
      return favs;
    } catch (e) {
      throw (e);
    }
  }

  async removeFavorite(id: string, teachID: string) {
    try {

      if (this.accountType == 'Student')
        await this.db.collection('Students').doc(id).collection('Favorites').doc(teachID).delete();
      else
        await this.db.collection('Teachers').doc(id).collection('Favorites').doc(teachID).delete();
    } catch (e) {
      throw (e);
    }
  }


}
