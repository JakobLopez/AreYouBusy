import { Injectable, ContentChild } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs'


@Injectable()
export class DatabaseProvider {
  accountType: any;
  allUsers: any;
  usersObj: any;
  private fire: any;
  public strg: any;

  constructor(public db: AngularFirestore,
    public storage: Storage) {
    console.log('Hello DatabaseProvider Provider');
    this.fire = firebase.firestore();
    this.strg = firebase.storage();
  }

  /********************************************************************************************/
  /*                                   GETTER METHODS                                         */
  /*                These methods retrieve some information from the database                 */
  /* getUser                                                                                  */
  /* getAllTeachers                                                                           */
  /* getFavorites                                                                             */
  /********************************************************************************************/

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

  /* getScheduleBySemester
  * Desc:  
  *     Gets a professor's office hours for semester
  * Params:
  *     id: uid of user that will be returned
  *     semster: semester professor wants to get office hours from
  * returns: 
  *     object of office hours for a given semester
  */
 getScheduleBySemester(id: string, semester:string): Observable<any> {
    try {      
      return this.db.collection('Teachers').doc(id).collection(
        'Schedules'
      ).doc(semester).valueChanges();

    } catch (e) {
      throw (e);
    }
  }



  /********************************************************************************************/
  /*                                   SETTER METHODS                                         */
  /*              These methods set some information in the database or global variables      */
  /* setUserDoc                                                                               */
  /* setAccountType                                                                           */
  /* editAccount                                                                              */
  /* setFavorite                                                                              */
  /* removeFavorite                                                                           */
  /* setSchedule                                                                              */
  /********************************************************************************************/

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
      var strg = firebase.storage();
      var strgRef = strg.ref();
      var o = {
        type: credentials.type,
        uid: id
      };
      var sObj = {
        name: credentials.name,
        email: credentials.email,
        type: credentials.type,
        uid: id,
        creation_time: new Date(),
        profile_pic: "profile_pictures/default-profile-pic.jpg"
      };

      var pObj = sObj;
      pObj['toggle'] = "";
      await this.db.collection(`Users`).doc(id).set(o);
      if(credentials.type == 'Student')
        await this.db.collection('Students').doc(id).set(sObj);
      else
        await this.db.collection('Teachers').doc(id).set(pObj);

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

      var query = await this.fire.collection('Users').get();
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

      this.usersObj = collection_obj;

      if (!type)
        this.accountType = collection_obj[id]['type'];

      this.storage.set('usersObj', JSON.stringify(collection_obj));
      this.storage.set('type', JSON.stringify(this.accountType));
    } catch (e) {
      throw (e);
    }
  }


  /* setName
  * Desc:  
  *     Edits users name
  * Params:
  *     id: id of current user
  *     info: users name
  * Returns
  *     none if successful, else throws error
  */
  async setName(id: string, Name: any) {
    try {
      var obj = {
        name: Name
      };
      if (this.accountType == 'Student')
        await this.db.collection('Students').doc(id).update(obj);
      else
        await this.db.collection('Teachers').doc(id).update(obj);

    }
    catch (e) {
      throw (e);
    }
  }


  /* setEmail
  * Desc:  
  *     Edits users email
  * Params:
  *     id: id of current user
  *     info: users email
  * Returns
  *     none if successful, else throws error
  */
  async setEmail(id: string, email: any) {
    try {
      var obj = {
        email: email
      };
      if (this.accountType == 'Student')
        await this.db.collection('Students').doc(id).update(obj);
      else
        await this.db.collection('Teachers').doc(id).update(obj);

    }
    catch (e) {
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

  /* removeFavorite
  * Desc:  
  *     Removes a teacher from current user's favorite list
  * Params:
  *     id: id of current user
  *     teachID: the id of teacher being removed
  * Returns
  *     none if successful, else throws error
  */
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

  /* setSchedule
  * Desc:  
  *     Sets a professor's office hours
  * Params:
  *     id: the id of the document being set
  *     schdule: office hours of teacher
  * returns: nothing.
  */

  async setSchedule(id: string, schedule: any) {
    try {
      await this.db.collection('Teachers').doc(id).collection("Schedules").doc(schedule.semester).set(schedule);
    } catch (e) {
      throw e;
    }
  }

  /* setStatus
  * Desc:  
  *     Sets a professor's toggle status
  * Params:
  *     id: the id of the document being set
  * returns: nothing.
  */

 async setStatus(id: string, status: string) {
  try {
    let temp = { toggle : status};
    await this.db.collection('Teachers').doc(id).update(temp);
  } catch (e) {
    throw e;
  }
}
  /********************************************************************************************/
  /*                                   VALIDATION METHODS                                     */
  /*                    These methods VERIFY some information in the database                 */
  /* isFavorite                                                                               */
  /********************************************************************************************/

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

  async getProfilePic(imagePath:any){
    var pathReference = this.strg.ref(imagePath);
    return await pathReference.getDownloadURL().then(function(url) {
      console.log(url);
      return url;
    }).catch(function(e) {
      console.log(e);
    });
  }




}
